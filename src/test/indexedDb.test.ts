import { describe, it, expect, beforeEach } from 'vitest';
import { dbService } from '../services/db/indexedDb';
import type { JournalEntry, ActiveAdventureSession } from '../services/db/types';
import type { Adventure } from '../services/ai/types';

describe('IndexedDB Persistence Layer', () => {
  beforeEach(async () => {
    await dbService.wipeAllData();
  });

  it('saves and retrieves application settings correctly', async () => {
    const initial = await dbService.getSettings();
    expect(initial.gemmaModel).toBe('gemma2:2b');

    await dbService.saveSettings({
      gemmaModel: 'gemma2:9b',
      hasCompletedOnboarding: true
    });

    const updated = await dbService.getSettings();
    expect(updated.gemmaModel).toBe('gemma2:9b');
    expect(updated.hasCompletedOnboarding).toBe(true);
  });

  it('persists and restores an active adventure session across reloads', async () => {
    const mockAdventure: Adventure = {
      id: 'adv-test-1',
      title: 'Pine Forest Path',
      description: 'A test adventure',
      durationMinutes: 15,
      difficulty: 'easy',
      environment: 'forest',
      quests: [
        {
          id: 'q1',
          title: 'Observe Bark',
          instruction: 'Touch pine bark gently.',
          estimatedMinutes: 5,
          category: 'Observation'
        }
      ],
      reflectionPrompt: 'Reflection',
      safetyNotice: 'Notice',
      generatedBy: 'rule-based',
      createdAt: new Date().toISOString()
    };

    const session: ActiveAdventureSession = {
      adventure: mockAdventure,
      currentQuestIndex: 0,
      completedQuestIds: [],
      skippedQuestIds: [],
      questNotes: {},
      questPhotos: {},
      startedAt: new Date().toISOString(),
      elapsedSeconds: 42,
      isPaused: false,
      isScreenLightMode: false,
      isCompleted: false
    };

    await dbService.saveActiveSession(session);
    const restored = await dbService.getActiveSession();

    expect(restored).not.toBeNull();
    expect(restored?.adventure.id).toBe('adv-test-1');
    expect(restored?.elapsedSeconds).toBe(42);

    // Clear session
    await dbService.saveActiveSession(null);
    const cleared = await dbService.getActiveSession();
    expect(cleared).toBeNull();
  });

  it('performs CRUD operations on Nature Journal entries', async () => {
    const entry: JournalEntry = {
      id: 'entry-1',
      adventureTitle: 'Wildflower Stroll',
      date: '2026-10-11',
      completedQuests: [
        { title: 'Five Shades of Green', category: 'Observation' },
        { title: 'Listen to Birds', category: 'Acoustics' }
      ],
      personalNotes: 'Saw a cedar waxwing resting on a birch tree.',
      outdoorMinutes: 15,
      environment: 'park',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create
    await dbService.saveJournalEntry(entry);
    let list = await dbService.getJournalEntries();
    expect(list).toHaveLength(1);
    expect(list[0].personalNotes).toContain('cedar waxwing');

    // Update
    entry.personalNotes = 'Updated reflection: also heard a chickadee.';
    await dbService.saveJournalEntry(entry);
    list = await dbService.getJournalEntries();
    expect(list[0].personalNotes).toContain('chickadee');

    // Delete
    await dbService.deleteJournalEntry('entry-1');
    list = await dbService.getJournalEntries();
    expect(list).toHaveLength(0);
  });

  it('updates stats and achievements accurately upon recording an adventure', async () => {
    const mockAdv: Adventure = {
      id: 'adv-finish',
      title: 'Finished Walk',
      description: 'Completed Walk',
      durationMinutes: 10,
      difficulty: 'easy',
      environment: 'garden',
      quests: [
        {
          id: 'q1',
          title: 'Observe Pollinators',
          instruction: 'Watch bumblebees.',
          estimatedMinutes: 5,
          category: 'Botanical Observation'
        }
      ],
      reflectionPrompt: 'Prompt',
      safetyNotice: 'Safety',
      generatedBy: 'rule-based',
      createdAt: new Date().toISOString()
    };

    await dbService.recordAdventureCompletion(mockAdv, 1, 10);

    const stats = await dbService.getStats();
    expect(stats.totalAdventuresCompleted).toBe(1);
    expect(stats.totalQuestsCompleted).toBe(1);
    expect(stats.totalOutdoorMinutes).toBe(10);

    const achievements = await dbService.getAchievements();
    const firstSteps = achievements.find(a => a.id === 'first-steps');
    expect(firstSteps).toBeDefined();
    expect(firstSteps?.isUnlocked).toBe(true);
  });

  it('exports and validates JSON import without data corruption', async () => {
    // Add sample entry
    const entry: JournalEntry = {
      id: 'entry-export-test',
      adventureTitle: 'Export Walk',
      date: '2026-10-11',
      completedQuests: [{ title: 'Noticing', category: 'Mindfulness' }],
      personalNotes: 'Test note for JSON export.',
      outdoorMinutes: 20,
      environment: 'urban',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await dbService.saveJournalEntry(entry);

    // Export
    const exportedJSON = await dbService.exportAllData();
    expect(exportedJSON).toContain('WildQuest AI');
    expect(exportedJSON).toContain('Test note for JSON export.');

    // Clear DB
    await dbService.wipeAllData();
    expect(await dbService.getJournalEntries()).toHaveLength(0);

    // Import
    const importResult = await dbService.importData(exportedJSON);
    expect(importResult.success).toBe(true);
    expect(importResult.count).toBeGreaterThan(0);

    const restoredEntries = await dbService.getJournalEntries();
    expect(restoredEntries).toHaveLength(1);
    expect(restoredEntries[0].personalNotes).toBe('Test note for JSON export.');
  });
});
