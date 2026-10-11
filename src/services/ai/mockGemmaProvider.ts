import type { IAIProvider, AIProviderStatus, UserPreferences, Adventure } from './types';
import { validateAdventure } from './schema';

export class MockGemmaProvider implements IAIProvider {
  public readonly name = 'Mock Gemma Provider (Test Runner)';
  private shouldFail = false;
  private failWithInvalidJson = false;
  private latencyMs = 50;

  constructor(options?: { shouldFail?: boolean; failWithInvalidJson?: boolean; latencyMs?: number }) {
    if (options?.shouldFail !== undefined) this.shouldFail = options.shouldFail;
    if (options?.failWithInvalidJson !== undefined) this.failWithInvalidJson = options.failWithInvalidJson;
    if (options?.latencyMs !== undefined) this.latencyMs = options.latencyMs;
  }

  setShouldFail(val: boolean) {
    this.shouldFail = val;
  }

  setFailWithInvalidJson(val: boolean) {
    this.failWithInvalidJson = val;
  }

  async checkStatus(): Promise<AIProviderStatus> {
    return {
      isAvailable: !this.shouldFail,
      runtime: 'ollama',
      modelName: 'gemma2:2b (mocked)',
      detectedModels: ['gemma2:2b', 'gemma2:9b'],
      endpoint: 'http://localhost:11434',
      latencyMs: this.latencyMs,
      errorMessage: this.shouldFail ? 'Simulated runtime connection failure' : undefined,
      lastChecked: new Date().toISOString()
    };
  }

  async generateAdventure(preferences: UserPreferences): Promise<Adventure> {
    await new Promise(r => setTimeout(r, this.latencyMs));

    if (this.shouldFail) {
      throw new Error('Connection refused to local Ollama instance (mocked)');
    }

    if (this.failWithInvalidJson) {
      throw new Error('AI generated JSON failed schema validation: title is missing, quests is empty');
    }

    const questCount = preferences.durationMinutes >= 30 ? 4 : 3;
    const estMinutes = Math.floor(preferences.durationMinutes / questCount);

    const mockAdventure = {
      id: `adv-mock-${Date.now()}`,
      title: `${preferences.environment.charAt(0).toUpperCase() + preferences.environment.slice(1)} Discovery Walk`,
      description: `A guided outdoor quest powered by local Gemma 2B exploring ${preferences.interests.join(' and ')} in your local ${preferences.environment}.`,
      durationMinutes: preferences.durationMinutes,
      difficulty: preferences.difficulty,
      environment: preferences.environment,
      quests: Array.from({ length: questCount }, (_, idx) => ({
        id: `mock-q-${idx + 1}`,
        title: `Observation Step ${idx + 1}: Notice Nature's Geometry`,
        instruction: `Take ${estMinutes} minutes to find an intriguing natural pattern in your surroundings. Look at branch junctions or rock striations without disturbing them.`,
        estimatedMinutes: estMinutes,
        category: 'Sensory Observation',
        reflectionPrompt: 'How did pausing to look closely affect your train of thought?',
        safetyTip: 'Stay on established trails and be aware of loose ground.'
      })),
      reflectionPrompt: 'What was the most grounding sensory impression you experienced today?',
      safetyNotice: 'Respect all living creatures and never disturb natural habitats or private property.',
      generatedBy: 'gemma' as const,
      modelIdentifier: 'gemma2:2b-simulated',
      createdAt: new Date().toISOString()
    };

    const validated = validateAdventure(mockAdventure);
    if (!validated.success) {
      throw new Error(validated.error);
    }
    return validated.data;
  }
}
