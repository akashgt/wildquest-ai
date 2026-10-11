import type { IAIProvider, AIProviderStatus, UserPreferences, Adventure } from './types';
import { validateAdventure, parseJSONFromText } from './schema';

export interface GemmaProviderConfig {
  endpoint: string;
  modelName: string;
  timeoutMs: number;
}

export class GemmaProvider implements IAIProvider {
  public readonly name = 'Google Gemma (Local Open-Weight)';
  private endpoint: string;
  private modelName: string;
  private timeoutMs: number;

  constructor(config?: Partial<GemmaProviderConfig>) {
    this.endpoint = (config?.endpoint || import.meta.env.VITE_GEMMA_ENDPOINT || 'http://localhost:11434').replace(/\/+$/, '');
    this.modelName = config?.modelName || import.meta.env.VITE_GEMMA_MODEL || 'gemma2:2b';
    this.timeoutMs = config?.timeoutMs || Number(import.meta.env.VITE_GEMMA_TIMEOUT_MS) || 30000;
  }

  public setEndpoint(endpoint: string) {
    this.endpoint = endpoint.replace(/\/+$/, '');
  }

  public setModelName(modelName: string) {
    this.modelName = modelName;
  }

  public getEndpoint(): string {
    return this.endpoint;
  }

  public getModelName(): string {
    return this.modelName;
  }

  async checkStatus(): Promise<AIProviderStatus> {
    const startTime = performance.now();
    const status: AIProviderStatus = {
      isAvailable: false,
      runtime: 'unavailable',
      modelName: this.modelName,
      detectedModels: [],
      endpoint: this.endpoint,
      lastChecked: new Date().toISOString()
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      // Check Ollama tags endpoint
      const response = await fetch(`${this.endpoint}/api/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const latency = Math.round(performance.now() - startTime);
      status.latencyMs = latency;

      if (!response.ok) {
        status.errorMessage = `Ollama server responded with status HTTP ${response.status}`;
        return status;
      }

      const data = await response.json() as { models?: Array<{ name: string }> };
      const modelList = Array.isArray(data.models) ? data.models.map(m => m.name) : [];
      status.detectedModels = modelList;
      status.runtime = 'ollama';

      // Verify whether the specified Gemma model or any Gemma model is installed
      const exactMatch = modelList.some(m => m === this.modelName || m.startsWith(`${this.modelName}:`));
      const gemmaMatch = modelList.find(m => m.toLowerCase().includes('gemma'));

      if (exactMatch) {
        status.isAvailable = true;
      } else if (gemmaMatch) {
        // Fallback to detected Gemma model
        status.isAvailable = true;
        status.modelName = gemmaMatch;
        this.modelName = gemmaMatch;
      } else {
        status.isAvailable = false;
        status.errorMessage = `Ollama is running, but Gemma model (${this.modelName}) is not pulled yet. Available models: ${modelList.join(', ') || 'none'}. Run: 'ollama run ${this.modelName}'`;
      }

      return status;
    } catch (err: unknown) {
      status.latencyMs = Math.round(performance.now() - startTime);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          status.errorMessage = `Connection timed out connecting to ${this.endpoint}. Ensure Ollama is active.`;
        } else {
          status.errorMessage = `Cannot reach Ollama at ${this.endpoint}: ${err.message}. If CORS blocks connection, launch Ollama with OLLAMA_ORIGINS="*"`;
        }
      } else {
        status.errorMessage = `Network failure communicating with ${this.endpoint}`;
      }
      return status;
    }
  }

  async generateAdventure(preferences: UserPreferences): Promise<Adventure> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const prompt = this.buildPrompt(preferences);

    try {
      const response = await fetch(`${this.endpoint}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: 'You are WildQuest AI, a nature exploration companion. You generate safe, sensory, outdoor observation quests that get people away from screens into the real natural world. Always output pure valid JSON matching the requested schema. Never output markdown commentary.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: false,
          format: 'json',
          options: {
            temperature: 0.7,
            top_p: 0.9
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gemma inference failed with HTTP status ${response.status}: ${response.statusText}`);
      }

      const resJson = await response.json() as { message?: { content?: string }; response?: string };
      const rawContent = resJson.message?.content || resJson.response;

      if (!rawContent || typeof rawContent !== 'string') {
        throw new Error('Gemma inference returned empty text response');
      }

      const parsed = parseJSONFromText(rawContent);
      const validation = validateAdventure(parsed);

      if (!validation.success) {
        throw new Error(`AI generated JSON failed schema validation: ${validation.error}`);
      }

      const adventure = validation.data;
      adventure.generatedBy = 'gemma';
      adventure.modelIdentifier = this.modelName;

      return adventure;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          throw new Error(`Gemma inference timed out after ${this.timeoutMs / 1000}s. Your hardware may be overloaded or model is too large.`);
        }
        throw err;
      }
      throw new Error(`Unexpected error during Gemma quest generation: ${String(err)}`);
    }
  }

  private buildPrompt(pref: UserPreferences): string {
    const questCount = pref.durationMinutes >= 45 ? 5 : pref.durationMinutes >= 20 ? 4 : 3;

    return `Generate a personalized outdoor nature adventure.

Parameters:
- Duration: ${pref.durationMinutes} minutes total
- Difficulty: ${pref.difficulty}
- Environment: ${pref.environment}
- Interests: ${pref.interests.join(', ')}
- Accessibility Required: ${pref.accessible ? 'Yes (flat paths, no steep inclines, reachable observation)' : 'No'}
- Quiet Activity: ${pref.quiet ? 'Yes (solo or silent contemplation)' : 'No'}
- Family Friendly: ${pref.familyFriendly ? 'Yes (engaging for all ages)' : 'No'}
- No Photography Quests: ${pref.noPhotography ? 'Yes (do not instruct user to take photos)' : 'No'}

CRITICAL SAFETY RULES:
1. NEVER instruct eating or tasting any wild plant, flower, berry, or mushroom.
2. NEVER instruct touching unfamiliar wildlife or disturbing nests/habitats.
3. NEVER instruct trespassing onto private property.
4. NEVER instruct climbing dangerous cliffs, trees, or structures.
5. NEVER instruct looking at phones while walking across roads or near traffic.
6. Favor gentle observation, listening, smelling safe foliage, texture noticing, and mindfulness.

Output MUST be a single valid JSON object with EXACTLY this structure:
{
  "title": "string (e.g. Whispering Pines Sensory Walk)",
  "description": "string (inspiring 2-3 sentence overview)",
  "durationMinutes": ${pref.durationMinutes},
  "difficulty": "${pref.difficulty}",
  "environment": "${pref.environment}",
  "quests": [
    {
      "id": "q1",
      "title": "string (concise active quest title)",
      "instruction": "string (clear, specific 2-3 sentence real-world action)",
      "estimatedMinutes": ${Math.round(pref.durationMinutes / questCount)},
      "category": "string (e.g. Botanical Observation, Acoustic Listening, Mindfulness)",
      "reflectionPrompt": "string (short question to think about after)",
      "safetyTip": "string (gentle reminder to stay safe and respectful)"
    }
  ],
  "reflectionPrompt": "string (overall closing question)",
  "safetyNotice": "string (overall safety reminder)"
}
Include exactly ${questCount} quests in the "quests" array. Return only the JSON object.`;
  }
}
