import { z } from 'zod';
import type { Adventure } from './types';

// Strict sanitization for user display
function sanitizeString(val: string): string {
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim();
}

export const QuestZodSchema = z.object({
  id: z.string().default(() => `quest-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
  title: z.string().min(3).max(120).transform(sanitizeString),
  instruction: z.string().min(10).max(500).transform(sanitizeString),
  estimatedMinutes: z.number().int().min(1).max(60).default(5),
  category: z.string().min(2).max(50).transform(sanitizeString).default('Observation'),
  reflectionPrompt: z.string().max(250).transform(sanitizeString).optional(),
  safetyTip: z.string().max(250).transform(sanitizeString).optional()
});

export const AdventureZodSchema = z.object({
  id: z.string().default(() => `adv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`),
  title: z.string().min(3).max(140).transform(sanitizeString),
  description: z.string().min(10).max(600).transform(sanitizeString),
  durationMinutes: z.number().int().min(3).max(120),
  difficulty: z.enum(['easy', 'explorer', 'advanced']).default('easy'),
  environment: z.enum(['garden', 'urban', 'park', 'forest', 'waterfront']).default('park'),
  quests: z.array(QuestZodSchema).min(2).max(6),
  reflectionPrompt: z.string().min(5).max(300).transform(sanitizeString),
  safetyNotice: z.string().min(5).max(400).transform(sanitizeString).default('Stay aware of your surroundings, respect wildlife from a distance, and never trespass.'),
  generatedBy: z.enum(['gemma', 'rule-based', 'mock']).default('gemma'),
  modelIdentifier: z.string().optional(),
  createdAt: z.string().default(() => new Date().toISOString())
});

export type ValidatedAdventure = z.infer<typeof AdventureZodSchema>;

export function validateAdventure(data: unknown): { success: true; data: Adventure } | { success: false; error: string } {
  try {
    const validated = AdventureZodSchema.parse(data);
    return { success: true, data: validated as Adventure };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const issueDetails = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      return { success: false, error: `Validation error: ${issueDetails}` };
    }
    return { success: false, error: String(err) };
  }
}

// Extraction helper that strips markdown code fences from AI output
export function parseJSONFromText(text: string): unknown {
  // Strip ```json ... ``` or ``` ... ```
  let clean = text.trim();
  const jsonMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    clean = jsonMatch[1].trim();
  } else {
    // If there's extra text before the first '{' or after the last '}'
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }
  }
  return JSON.parse(clean);
}
