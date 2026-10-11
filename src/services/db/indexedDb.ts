import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Adventure, UserPreferences } from '../ai/types';
import type { 
  JournalEntry, 
  ActiveAdventureSession, 
  Achievement, 
  UserStats, 
  AppSettings 
} from './types';

export const DEFAULT_PREFERENCES: UserPreferences = {
  interests: ['plants', 'trees', 'birds', 'mindfulness'],
  durationMinutes: 15,
  difficulty: 'easy',
  environment: 'park',
  accessible: false,
  quiet: false,
  familyFriendly: false,
  noPhotography: false
};

export const DEFAULT_SETTINGS: AppSettings = {
  preferences: DEFAULT_PREFERENCES,
  gemmaEndpoint: 'http://localhost:11434',
  gemmaModel: 'gemma2:2b',
  timeoutMs: 30000,
  reducedMotion: false,
  highContrast: false,
  hasCompletedOnboarding: false
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first outdoor nature adventure.',
    iconName: 'Footprints',
    currentValue: 0,
    targetValue: 1,
    isUnlocked: false
  },
  {
    id: 'curious-eyes',
    title: 'Curious Eyes',
    description: 'Complete 5 sensory observation quests in nature.',
    iconName: 'Eye',
    currentValue: 0,
    targetValue: 5,
    isUnlocked: false
  },
  {
    id: 'slow-down',
    title: 'Slow Down',
    description: 'Complete a dedicated mindfulness or quiet acoustic quest.',
    iconName: 'HeartHandshake',
    currentValue: 0,
    targetValue: 1,
    isUnlocked: false
  },
  {
    id: 'weekend-explorer',
    title: 'Weekend Explorer',
    description: 'Explore the outdoors on 3 separate calendar days.',
    iconName: 'CalendarCheck',
    currentValue: 0,
    targetValue: 3,
    isUnlocked: false
  },
  {
    id: 'nature-noticer',
    title: 'Nature Noticer',
    description: 'Record 5 journal reflections or observations from your adventures.',
    iconName: 'BookOpen',
    currentValue: 0,
    targetValue: 5,
    isUnlocked: false
  }
];

interface WildQuestDB extends DBSchema {
  adventures: {
    key: string;
    value: Adventure;
    indexes: { 'by-date': string };
  };
  journal: {
    key: string;
    value: JournalEntry;
    indexes: { 'by-date': string; 'by-adventure': string };
  };
  activeSession: {
    key: string;
    value: { id: string; session: ActiveAdventureSession };
  };
  settings: {
    key: string;
    value: { key: string; value: unknown };
  };
  stats: {
    key: string;
    value: UserStats & { id: string };
  };
  achievements: {
    key: string;
    value: Achievement;
  };
}

const DB_NAME = 'wildquest_ai_db';
const DB_VERSION = 1;

class DatabaseService {
  private dbPromise: Promise<IDBPDatabase<WildQuestDB>> | null = null;

  private async getDB(): Promise<IDBPDatabase<WildQuestDB>> {
    if (!this.dbPromise) {
      this.dbPromise = openDB<WildQuestDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Adventures store
          if (!db.objectStoreNames.contains('adventures')) {
            const advStore = db.createObjectStore('adventures', { keyPath: 'id' });
            advStore.createIndex('by-date', 'createdAt');
          }
          // Journal store
          if (!db.objectStoreNames.contains('journal')) {
            const journalStore = db.createObjectStore('journal', { keyPath: 'id' });
            journalStore.createIndex('by-date', 'date');
            journalStore.createIndex('by-adventure', 'adventureId');
          }
          // Active session store (single item: 'current')
          if (!db.objectStoreNames.contains('activeSession')) {
            db.createObjectStore('activeSession', { keyPath: 'id' });
          }
          // Settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'key' });
          }
          // Stats store
          if (!db.objectStoreNames.contains('stats')) {
            db.createObjectStore('stats', { keyPath: 'id' });
          }
          // Achievements store
          if (!db.objectStoreNames.contains('achievements')) {
            db.createObjectStore('achievements', { keyPath: 'id' });
          }
        }
      });
    }
    return this.dbPromise;
  }

  // --- Settings ---
  async getSettings(): Promise<AppSettings> {
    const db = await this.getDB();
    const row = await db.get('settings', 'app_settings');
    if (row && row.value) {
      return { ...DEFAULT_SETTINGS, ...(row.value as Partial<AppSettings>) };
    }
    return DEFAULT_SETTINGS;
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    const db = await this.getDB();
    await db.put('settings', { key: 'app_settings', value: updated });
    return updated;
  }

  // --- Adventures ---
  async saveAdventure(adventure: Adventure): Promise<void> {
    const db = await this.getDB();
    await db.put('adventures', adventure);
  }

  async getAdventures(): Promise<Adventure[]> {
    const db = await this.getDB();
    const list = await db.getAll('adventures');
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAdventureById(id: string): Promise<Adventure | undefined> {
    const db = await this.getDB();
    return db.get('adventures', id);
  }

  async deleteAdventure(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('adventures', id);
  }

  // --- Active Adventure Session ---
  async saveActiveSession(session: ActiveAdventureSession | null): Promise<void> {
    const db = await this.getDB();
    if (!session) {
      await db.delete('activeSession', 'current');
    } else {
      await db.put('activeSession', { id: 'current', session });
    }
  }

  async getActiveSession(): Promise<ActiveAdventureSession | null> {
    const db = await this.getDB();
    const record = await db.get('activeSession', 'current');
    return record ? record.session : null;
  }

  // --- Nature Journal ---
  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    const db = await this.getDB();
    await db.put('journal', entry);
    await this.updateStatsAndAchievements();
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    const db = await this.getDB();
    const list = await db.getAll('journal');
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getJournalEntryById(id: string): Promise<JournalEntry | undefined> {
    const db = await this.getDB();
    return db.get('journal', id);
  }

  async deleteJournalEntry(id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('journal', id);
    await this.updateStatsAndAchievements();
  }

  // --- Stats and Achievements ---
  async getStats(): Promise<UserStats> {
    const db = await this.getDB();
    const row = await db.get('stats', 'user_stats');
    if (row) {
      return {
        totalAdventuresCompleted: row.totalAdventuresCompleted || 0,
        totalQuestsCompleted: row.totalQuestsCompleted || 0,
        totalOutdoorMinutes: row.totalOutdoorMinutes || 0,
        totalJournalNotes: row.totalJournalNotes || 0,
        uniqueDaysExplored: row.uniqueDaysExplored || [],
        lastExploredDate: row.lastExploredDate
      };
    }
    return {
      totalAdventuresCompleted: 0,
      totalQuestsCompleted: 0,
      totalOutdoorMinutes: 0,
      totalJournalNotes: 0,
      uniqueDaysExplored: []
    };
  }

  async recordAdventureCompletion(
    adventure: Adventure, 
    completedQuestCount: number, 
    minutesSpent: number
  ): Promise<void> {
    const db = await this.getDB();
    const today = new Date().toISOString().split('T')[0];
    const stats = await this.getStats();

    const uniqueDays = new Set(stats.uniqueDaysExplored);
    uniqueDays.add(today);

    const updatedStats: UserStats & { id: string } = {
      id: 'user_stats',
      totalAdventuresCompleted: stats.totalAdventuresCompleted + 1,
      totalQuestsCompleted: stats.totalQuestsCompleted + completedQuestCount,
      totalOutdoorMinutes: stats.totalOutdoorMinutes + minutesSpent,
      totalJournalNotes: stats.totalJournalNotes,
      uniqueDaysExplored: Array.from(uniqueDays),
      lastExploredDate: today
    };

    await db.put('stats', updatedStats);
    await this.saveAdventure(adventure);
    await this.updateStatsAndAchievements();
  }

  async getAchievements(): Promise<Achievement[]> {
    const db = await this.getDB();
    const list = await db.getAll('achievements');
    if (list.length === 0) {
      // Initialize default achievements
      const tx = db.transaction('achievements', 'readwrite');
      for (const ach of INITIAL_ACHIEVEMENTS) {
        await tx.store.put(ach);
      }
      await tx.done;
      return INITIAL_ACHIEVEMENTS;
    }
    return list;
  }

  async updateStatsAndAchievements(): Promise<Achievement[]> {
    const db = await this.getDB();
    const stats = await this.getStats();
    const entries = await this.getJournalEntries();
    const adventures = await this.getAdventures();

    // Calculate real metrics
    const totalJournalNotes = entries.filter(e => !!e.personalNotes && e.personalNotes.trim().length > 0).length;
    stats.totalJournalNotes = totalJournalNotes;
    await db.put('stats', { ...stats, id: 'user_stats' });

    let observationCount = 0;
    let mindfulnessCount = 0;

    for (const entry of entries) {
      for (const q of entry.completedQuests) {
        const cat = q.category.toLowerCase();
        if (cat.includes('observ') || cat.includes('texture') || cat.includes('color') || cat.includes('botanical') || cat.includes('pattern')) {
          observationCount++;
        }
        if (cat.includes('mindful') || cat.includes('acoustic') || cat.includes('listening') || cat.includes('calm') || cat.includes('sensory')) {
          mindfulnessCount++;
        }
      }
    }

    const currentAchList = await this.getAchievements();
    const nowIso = new Date().toISOString();

    const updatedAch = currentAchList.map(ach => {
      let currentVal = ach.currentValue;
      if (ach.id === 'first-steps') {
        currentVal = Math.max(stats.totalAdventuresCompleted, adventures.length);
      } else if (ach.id === 'curious-eyes') {
        currentVal = Math.max(observationCount, stats.totalQuestsCompleted);
      } else if (ach.id === 'slow-down') {
        currentVal = mindfulnessCount;
      } else if (ach.id === 'weekend-explorer') {
        currentVal = stats.uniqueDaysExplored.length;
      } else if (ach.id === 'nature-noticer') {
        currentVal = totalJournalNotes;
      }

      const isUnlocked = currentVal >= ach.targetValue;
      return {
        ...ach,
        currentValue: Math.min(currentVal, ach.targetValue),
        isUnlocked,
        unlockedAt: isUnlocked && !ach.isUnlocked ? nowIso : ach.unlockedAt
      };
    });

    const tx = db.transaction('achievements', 'readwrite');
    for (const a of updatedAch) {
      await tx.store.put(a);
    }
    await tx.done;

    return updatedAch;
  }

  // --- Export and Import JSON ---
  async exportAllData(): Promise<string> {
    const settings = await this.getSettings();
    const adventures = await this.getAdventures();
    const journal = await this.getJournalEntries();
    const stats = await this.getStats();
    const achievements = await this.getAchievements();

    const exportPayload = {
      app: 'WildQuest AI',
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      data: {
        settings,
        adventures,
        journal,
        stats,
        achievements
      }
    };

    return JSON.stringify(exportPayload, null, 2);
  }

  async importData(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const parsed = JSON.parse(jsonString) as {
        app?: string;
        exportVersion?: number;
        data?: {
          settings?: AppSettings;
          adventures?: Adventure[];
          journal?: JournalEntry[];
          stats?: UserStats;
        };
      };

      if (!parsed || parsed.app !== 'WildQuest AI' || !parsed.data) {
        return { success: false, count: 0, error: 'Invalid file format. File is not a valid WildQuest AI export.' };
      }

      const db = await this.getDB();
      let importedCount = 0;

      if (Array.isArray(parsed.data.adventures)) {
        for (const adv of parsed.data.adventures) {
          if (adv && adv.id && adv.title && Array.isArray(adv.quests)) {
            await db.put('adventures', adv);
            importedCount++;
          }
        }
      }

      if (Array.isArray(parsed.data.journal)) {
        for (const entry of parsed.data.journal) {
          if (entry && entry.id && entry.adventureTitle && entry.date) {
            await db.put('journal', entry);
            importedCount++;
          }
        }
      }

      if (parsed.data.settings) {
        await this.saveSettings(parsed.data.settings);
      }

      await this.updateStatsAndAchievements();
      return { success: true, count: importedCount };
    } catch (err: unknown) {
      return { 
        success: false, 
        count: 0, 
        error: `JSON import parsing error: ${err instanceof Error ? err.message : String(err)}` 
      };
    }
  }

  // --- Wipe all data ---
  async wipeAllData(): Promise<void> {
    const db = await this.getDB();
    await db.clear('adventures');
    await db.clear('journal');
    await db.clear('activeSession');
    await db.clear('settings');
    await db.clear('stats');
    await db.clear('achievements');
  }
}

export const dbService = new DatabaseService();
