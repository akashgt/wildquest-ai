import type { IAIProvider, AIProviderStatus, UserPreferences, Adventure, Quest, InterestType } from './types';
import { validateAdventure } from './schema';

interface QuestTemplate {
  title: string;
  instruction: string;
  category: string;
  interests: InterestType[];
  reflectionPrompt: string;
  safetyTip: string;
  accessible: boolean;
  quiet: boolean;
  noPhoto: boolean;
}

const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    title: 'Find Three Distinct Leaf Shapes',
    instruction: 'Walk slowly and find 3 different leaf silhouettes (e.g. serrated, heart-shaped, lanceolate, or lobed). Examine them closely without picking or breaking them.',
    category: 'Botanical Observation',
    interests: ['plants', 'trees', 'patterns'],
    reflectionPrompt: 'Which leaf structure felt the most resilient or intricate?',
    safetyTip: 'Observe leaves directly on the branch; avoid touching unknown shiny vines like poison ivy.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Two Minutes of Bird Song',
    instruction: 'Find a safe place to pause. Close your eyes or soften your gaze. Listen for 2 full minutes. Count how many distinct bird calls or directions you can distinguish.',
    category: 'Acoustic Mindfulness',
    interests: ['birds', 'wildlife', 'mindfulness'],
    reflectionPrompt: 'Did you notice any patterns of call-and-response between the birds?',
    safetyTip: 'Stand safely clear of pathways, cyclists, or active vehicular roads.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Five Shades of Green',
    instruction: 'Look across your immediate surroundings. Discover 5 clearly distinct shades of green—from pale moss to deep pine, lime sprouts to olive underleaves.',
    category: 'Color & Contrast',
    interests: ['plants', 'photography', 'mindfulness', 'seasonal'],
    reflectionPrompt: 'Which shade of green was the deepest, and what plant was wearing it?',
    safetyTip: 'Stay on established walking paths while scanning the vegetation.',
    accessible: true,
    quiet: true,
    noPhoto: false
  },
  {
    title: 'Bark & Woodgrain Fingerprint',
    instruction: 'Approach a mature tree. Examine the texture of its bark closely. Notice whether it is deeply furrowed, smooth, scaly, or peeling. Observe any lichens or moss living on its north face.',
    category: 'Texture Study',
    interests: ['trees', 'patterns', 'mindfulness'],
    reflectionPrompt: 'What stories of weather and seasons does the tree bark convey?',
    safetyTip: 'Be mindful of rough edges and avoid disturbing small insects in bark crevices.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Pollinator Flight Path',
    instruction: 'Locate flowering plants or sunlit patches. Observe bees, butterflies, or hoverflies from a respectful distance of at least two feet. Follow one pollinator for 60 seconds.',
    category: 'Wildlife Ethology',
    interests: ['wildlife', 'flowers', 'mindfulness'],
    reflectionPrompt: 'How direct was the pollinator’s journey from one bloom to the next?',
    safetyTip: 'Keep a calm, respectful distance. Never swat or corner stinging insects.',
    accessible: true,
    quiet: true,
    noPhoto: false
  },
  {
    title: 'Natural Geometric Patterns',
    instruction: 'Search for spirals, branch branching angles, fractal vein networks, or pebble mosaics in the soil. Observe how nature balances symmetry and variation.',
    category: 'Pattern Discovery',
    interests: ['patterns', 'photography', 'mindfulness'],
    reflectionPrompt: 'Where did you find the most surprising geometric repetition?',
    safetyTip: 'Never move retaining stones or disrupt fragile soil beds.',
    accessible: true,
    quiet: true,
    noPhoto: false
  },
  {
    title: 'Canopy Horizon Gaze',
    instruction: 'Look straight up into the treetops where branches meet the sky. Observe "crown shyness"—the gap channels that trees often leave between their crowns.',
    category: 'Skyline Meditation',
    interests: ['trees', 'mindfulness', 'photography'],
    reflectionPrompt: 'How did shifting your gaze upward change your sense of scale?',
    safetyTip: 'Step to the side of paths to avoid stopping in the flow of foot or bicycle traffic.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Seasonal Micro-Signs',
    instruction: 'Inspect the tips of branches, seed pods on the ground, or dried grasses. Notice what this season is preparing for or letting go of right now.',
    category: 'Seasonal Awareness',
    interests: ['seasonal', 'plants', 'flowers'],
    reflectionPrompt: 'What subtle transition did you catch in action today?',
    safetyTip: 'Leave seed pods and fallen foliage where they lie as habitat.',
    accessible: true,
    quiet: false,
    noPhoto: true
  },
  {
    title: 'Wind & Shadow Dance',
    instruction: 'Observe shadows cast by leaves and grasses on the ground or a wall. Watch how gusts of breeze change the rhythm and silhouette of the shadows.',
    category: 'Mindful Observation',
    interests: ['mindfulness', 'photography', 'patterns'],
    reflectionPrompt: 'How did the tempo of the wind feel compared to your own breathing pace?',
    safetyTip: 'Remain stationary while focusing on moving shadows.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Water Surface Ripples',
    instruction: 'If near water, watch the surface tension, ripples, or currents for 90 seconds. Notice how reflections distort and reform in continuous rhythm.',
    category: 'Aquatic Mindfulness',
    interests: ['mindfulness', 'photography', 'wildlife'],
    reflectionPrompt: 'What calm feeling did watching continuous ripples bring?',
    safetyTip: 'Remain securely on boardwalks or stable bank edges; never step on slippery rocks.',
    accessible: true,
    quiet: true,
    noPhoto: true
  },
  {
    title: 'Wild Urban Survivors',
    instruction: 'Look at sidewalk edges, masonry cracks, or tree pits. Spot a tenacious plant thriving in an urban crevice without human care.',
    category: 'Urban Ecology',
    interests: ['plants', 'patterns', 'seasonal'],
    reflectionPrompt: 'What adaptation allows this plant to thrive in pavement?',
    safetyTip: 'Keep aware of sidewalk foot traffic and never step into vehicular streets.',
    accessible: true,
    quiet: false,
    noPhoto: true
  },
  {
    title: 'Gentle Scents of the Earth',
    instruction: 'Inhale deeply near damp soil, pine needles, or crushed clover. Notice the scent of petrichor or organic humus without picking vegetation.',
    category: 'Sensory Exploration',
    interests: ['mindfulness', 'plants', 'trees'],
    reflectionPrompt: 'What memory or atmosphere does the outdoor scent evoke?',
    safetyTip: 'Do not inhale closely over unknown or irritating fungal spores.',
    accessible: true,
    quiet: true,
    noPhoto: true
  }
];

export class RuleBasedProvider implements IAIProvider {
  public readonly name = 'Rule-based Nature Engine (Offline)';

  async checkStatus(): Promise<AIProviderStatus> {
    return {
      isAvailable: true,
      runtime: 'rule-based',
      modelName: 'Curated Naturalist Engine',
      detectedModels: ['Curated Naturalist Engine v1.0'],
      endpoint: 'local://client-storage',
      latencyMs: 1,
      lastChecked: new Date().toISOString()
    };
  }

  async generateAdventure(preferences: UserPreferences): Promise<Adventure> {
    // Determine quest count based on duration
    let questCount = 3;
    if (preferences.durationMinutes >= 30) {
      questCount = 4;
    }
    if (preferences.durationMinutes >= 60) {
      questCount = 5;
    }

    // Filter templates matching user preferences
    let matched = QUEST_TEMPLATES.filter(tpl => {
      // Accessible filter
      if (preferences.accessible && !tpl.accessible) return false;
      // Quiet filter
      if (preferences.quiet && !tpl.quiet) return false;
      // No photo filter
      if (preferences.noPhotography && !tpl.noPhoto) return false;

      // Interest matches
      const hasInterest = tpl.interests.some(i => preferences.interests.includes(i));
      return hasInterest;
    });

    // Fallback if filters are too strict
    if (matched.length < questCount) {
      matched = QUEST_TEMPLATES.slice();
    }

    // Shuffle and pick unique templates
    const shuffled = [...matched].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questCount);

    const estMinutesPerQuest = Math.max(2, Math.floor(preferences.durationMinutes / questCount));

    const quests: Quest[] = selected.map((tpl, idx) => ({
      id: `quest-${Date.now()}-${idx}`,
      title: tpl.title,
      instruction: tpl.instruction,
      estimatedMinutes: estMinutesPerQuest,
      category: tpl.category,
      reflectionPrompt: tpl.reflectionPrompt,
      safetyTip: tpl.safetyTip
    }));

    // Dynamic environmental title
    const envLabels: Record<string, string> = {
      garden: 'Backyard Sanctuary',
      urban: 'Urban Greenways',
      park: 'Neighborhood Park',
      forest: 'Deep Woods',
      waterfront: 'Shoreline Commons'
    };
    const envLabel = envLabels[preferences.environment] || 'Outdoor Trail';

    const diffLabels: Record<string, string> = {
      easy: 'Gentle Stroll',
      explorer: 'Curious Wander',
      advanced: 'Deep Observation'
    };
    const diffLabel = diffLabels[preferences.difficulty] || 'Exploration';

    const rawAdventure = {
      id: `adv-${Date.now()}`,
      title: `${envLabel} ${diffLabel}`,
      description: `A ${preferences.durationMinutes}-minute mindful exploration through your ${preferences.environment} surroundings, designed to awaken your senses and ground your attention in the living world.`,
      durationMinutes: preferences.durationMinutes,
      difficulty: preferences.difficulty,
      environment: preferences.environment,
      quests,
      reflectionPrompt: 'When you stopped looking at screens today, what was the first natural detail that caught your eye?',
      safetyNotice: 'Stay alert to your footing, keep a respectful distance from wildlife, and stay on public or permitted grounds.',
      generatedBy: 'rule-based' as const,
      modelIdentifier: 'RuleBased-Naturalist-v1',
      createdAt: new Date().toISOString()
    };

    const validated = validateAdventure(rawAdventure);
    if (!validated.success) {
      throw new Error(`Fallback validation error: ${validated.error}`);
    }

    return validated.data;
  }
}
