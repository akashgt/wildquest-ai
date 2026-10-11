import type { UserPreferences, GenerationResult, AIProviderStatus, IAIProvider } from './types';
import { GemmaProvider } from './gemmaProvider';
import { RuleBasedProvider } from './ruleBasedProvider';
import { MockGemmaProvider } from './mockGemmaProvider';

export class AIManager {
  private gemmaProvider: GemmaProvider;
  private ruleBasedProvider: RuleBasedProvider;
  private mockProvider?: MockGemmaProvider;
  private useMockInTests = false;

  constructor() {
    this.gemmaProvider = new GemmaProvider();
    this.ruleBasedProvider = new RuleBasedProvider();
  }

  public getGemmaProvider(): GemmaProvider {
    return this.gemmaProvider;
  }

  public getRuleBasedProvider(): RuleBasedProvider {
    return this.ruleBasedProvider;
  }

  public enableMockMode(mock: MockGemmaProvider) {
    this.mockProvider = mock;
    this.useMockInTests = true;
  }

  public disableMockMode() {
    this.useMockInTests = false;
  }

  /**
   * Check status of local Gemma and report truthful status
   */
  async checkGemmaStatus(): Promise<AIProviderStatus> {
    if (this.useMockInTests && this.mockProvider) {
      return this.mockProvider.checkStatus();
    }
    return this.gemmaProvider.checkStatus();
  }

  /**
   * Generate an adventure. If forceProvider is specified, use that.
   * Otherwise try local Gemma first; if unavailable or failing, transparently fall back
   * to the rule-based engine while explicitly reporting what happened.
   */
  async generate(
    preferences: UserPreferences, 
    forceProvider?: 'gemma' | 'rule-based'
  ): Promise<GenerationResult> {
    const startTime = performance.now();

    // If explicitly requested rule-based
    if (forceProvider === 'rule-based') {
      const adv = await this.ruleBasedProvider.generateAdventure(preferences);
      const durationMs = Math.round(performance.now() - startTime);
      return {
        adventure: adv,
        providerUsed: 'rule-based',
        modelName: 'Curated Naturalist Engine',
        durationMs,
        fallbackTriggered: false
      };
    }

    // Try Gemma (or Mock if enabled)
    const activeAiProvider: IAIProvider = (this.useMockInTests && this.mockProvider)
      ? this.mockProvider
      : this.gemmaProvider;

    try {
      // First check status
      const status = await activeAiProvider.checkStatus();
      if (!status.isAvailable) {
        throw new Error(status.errorMessage || 'Local Gemma runtime is not reachable');
      }

      const adv = await activeAiProvider.generateAdventure(preferences);
      const durationMs = Math.round(performance.now() - startTime);

      return {
        adventure: adv,
        providerUsed: this.useMockInTests ? 'mock' : 'gemma',
        modelName: status.modelName,
        durationMs,
        fallbackTriggered: false
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      // Transparent, labeled fallback
      const adv = await this.ruleBasedProvider.generateAdventure(preferences);
      const durationMs = Math.round(performance.now() - startTime);

      return {
        adventure: adv,
        providerUsed: 'rule-based',
        modelName: 'Curated Naturalist Engine (Fallback)',
        durationMs,
        fallbackTriggered: true,
        fallbackReason: errorMsg
      };
    }
  }
}

// Global singleton instance
export const aiManager = new AIManager();
