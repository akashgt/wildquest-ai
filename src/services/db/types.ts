import type { Adventure, UserPreferences } from '../ai/types';

export interface JournalEntry {
  id: string;
  adventureId?: string;
  adventureTitle: string;
  date: string; // YYYY-MM-DD
  completedQuests: Array<{
    title: string;
    category: string;
  }>;
  personalNotes?: string;
  photoUrl?: string; // local base64 or blob URL
  outdoorMinutes: number;
  environment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveAdventureSession {
  adventure: Adventure;
  currentQuestIndex: number;
  completedQuestIds: string[];
  skippedQuestIds: string[];
  questNotes: Record<string, string>;
  questPhotos: Record<string, string>;
  startedAt: string;
  elapsedSeconds: number;
  isPaused: boolean;
  isScreenLightMode: boolean;
  isCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserStats {
  totalAdventuresCompleted: number;
  totalQuestsCompleted: number;
  totalOutdoorMinutes: number;
  totalJournalNotes: number;
  uniqueDaysExplored: string[]; // List of YYYY-MM-DD
  lastExploredDate?: string;
}

export interface AppSettings {
  preferences: UserPreferences;
  gemmaEndpoint: string;
  gemmaModel: string;
  timeoutMs: number;
  reducedMotion: boolean;
  highContrast: boolean;
  hasCompletedOnboarding: boolean;
}
