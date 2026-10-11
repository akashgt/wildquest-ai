import { describe, it, expect } from 'vitest';
import { RuleBasedProvider } from '../services/ai/ruleBasedProvider';
import { MockGemmaProvider } from '../services/ai/mockGemmaProvider';
import { AIManager } from '../services/ai/aiManager';
import type { UserPreferences } from '../services/ai/types';

describe('AI Provider Architecture & Fallback Mechanics', () => {
  const samplePreferences: UserPreferences = {
    interests: ['birds', 'plants', 'mindfulness'],
    durationMinutes: 20,
    difficulty: 'easy',
    environment: 'park',
    accessible: true,
    quiet: true,
    familyFriendly: false,
    noPhotography: true
  };

  it('RuleBasedProvider generates a valid, safe adventure matching preferences completely offline', async () => {
    const provider = new RuleBasedProvider();
    const status = await provider.checkStatus();
    expect(status.isAvailable).toBe(true);
    expect(status.runtime).toBe('rule-based');

    const adventure = await provider.generateAdventure(samplePreferences);
    expect(adventure.title).toBeDefined();
    expect(adventure.quests.length).toBeGreaterThanOrEqual(2);
    expect(adventure.generatedBy).toBe('rule-based');
    expect(adventure.safetyNotice).toBeDefined();

    // Verify critical safety: no quests instructing to eat wild plants or touch wildlife
    for (const q of adventure.quests) {
      expect(q.instruction.toLowerCase()).not.toContain('eat');
      expect(q.instruction.toLowerCase()).not.toContain('taste');
      expect(q.instruction.toLowerCase()).not.toContain('touch wildlife');
      expect(q.instruction.toLowerCase()).not.toContain('trespass');
    }
  });

  it('MockGemmaProvider successfully simulates local Gemma inference', async () => {
    const mock = new MockGemmaProvider();
    const status = await mock.checkStatus();
    expect(status.isAvailable).toBe(true);

    const adventure = await mock.generateAdventure(samplePreferences);
    expect(adventure.generatedBy).toBe('gemma');
    expect(adventure.quests.length).toBeGreaterThanOrEqual(3);
  });

  it('MockGemmaProvider throws expected error when runtime is disconnected', async () => {
    const mock = new MockGemmaProvider({ shouldFail: true });
    const status = await mock.checkStatus();
    expect(status.isAvailable).toBe(false);

    await expect(mock.generateAdventure(samplePreferences)).rejects.toThrow('Connection refused');
  });

  it('AIManager triggers transparent, explicitly-labeled fallback when Gemma is offline', async () => {
    const manager = new AIManager();
    const failingMock = new MockGemmaProvider({ shouldFail: true });
    manager.enableMockMode(failingMock);

    // Call generate without forcing provider
    const result = await manager.generate(samplePreferences);

    // Should not crash, should return a valid adventure from the fallback
    expect(result.adventure).toBeDefined();
    expect(result.providerUsed).toBe('rule-based');
    expect(result.fallbackTriggered).toBe(true);
    expect(result.fallbackReason).toBeDefined();
    expect(result.modelName).toContain('Fallback');
  });

  it('AIManager uses Gemma successfully when local runtime is available', async () => {
    const manager = new AIManager();
    const workingMock = new MockGemmaProvider({ shouldFail: false });
    manager.enableMockMode(workingMock);

    const result = await manager.generate(samplePreferences);
    expect(result.adventure).toBeDefined();
    expect(result.fallbackTriggered).toBe(false);
    expect(result.providerUsed).toBe('mock');
  });
});
