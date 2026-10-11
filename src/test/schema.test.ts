import { describe, it, expect } from 'vitest';
import { validateAdventure, parseJSONFromText, QuestZodSchema } from '../services/ai/schema';

describe('AI Adventure Zod Schema & Sanitization', () => {
  it('validates a complete, correctly-typed adventure object', () => {
    const valid = {
      title: 'Meadow Exploration Walk',
      description: 'A 15-minute nature journey observing wildflowers and pollinator behavior.',
      durationMinutes: 15,
      difficulty: 'easy',
      environment: 'park',
      quests: [
        {
          title: 'Find Three Leaf Shapes',
          instruction: 'Search for three distinct leaf silhouettes without picking them.',
          estimatedMinutes: 5,
          category: 'Botanical Observation',
          reflectionPrompt: 'Which leaf felt the most intricate?',
          safetyTip: 'Stay on the trail.'
        },
        {
          title: 'Two Minutes of Listening',
          instruction: 'Pause and listen closely to the surrounding birds and breeze.',
          estimatedMinutes: 5,
          category: 'Acoustic Mindfulness'
        },
        {
          title: 'Count Shades of Green',
          instruction: 'Discover five distinctly different shades of green foliage.',
          estimatedMinutes: 5,
          category: 'Observation'
        }
      ],
      reflectionPrompt: 'What caught your eye today?',
      safetyNotice: 'Stay on established paths.'
    };

    const result = validateAdventure(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Meadow Exploration Walk');
      expect(result.data.quests).toHaveLength(3);
    }
  });

  it('rejects malformed data missing required fields or having insufficient quests', () => {
    const invalid = {
      title: 'Broken Walk',
      durationMinutes: 15,
      // missing description
      quests: [
        // only 1 quest (minimum is 2)
        {
          title: 'A solitary step',
          instruction: 'Look around you carefully.',
          estimatedMinutes: 5,
          category: 'Observation'
        }
      ]
    };

    const result = validateAdventure(invalid);
    expect(result.success).toBe(false);
  });

  it('sanitizes script tags from generated text', () => {
    const dirtyQuest = {
      title: 'Watch Butterflies <script>alert("hack")</script>',
      instruction: 'Observe pollinators from a safe distance <script>malicious()</script>',
      estimatedMinutes: 5,
      category: 'Observation'
    };

    const parsed = QuestZodSchema.parse(dirtyQuest);
    expect(parsed.title).not.toContain('<script>');
    expect(parsed.title).not.toContain('</script>');
    expect(parsed.instruction).not.toContain('<script>');
  });

  it('parses JSON safely from markdown code fences', () => {
    const markdownOutput = `Here is your adventure:
\`\`\`json
{
  "title": "Quiet Canopy Observation",
  "description": "Notice tall mature oak and pine crowns.",
  "durationMinutes": 10,
  "difficulty": "easy",
  "environment": "forest",
  "quests": [
    {
      "title": "Look Upwards",
      "instruction": "Scan the canopy shyness channels.",
      "estimatedMinutes": 5,
      "category": "Mindfulness"
    },
    {
      "title": "Listen to Creaking Branches",
      "instruction": "Listen for wood creaking under wind.",
      "estimatedMinutes": 5,
      "category": "Acoustic"
    }
  ],
  "reflectionPrompt": "How did looking up change your awareness?",
  "safetyNotice": "Watch your step on roots."
}
\`\`\`
Enjoy your walk outdoors!`;

    const parsed = parseJSONFromText(markdownOutput) as { title: string };
    expect(parsed).toBeDefined();
    expect(parsed.title).toBe('Quiet Canopy Observation');
  });
});
