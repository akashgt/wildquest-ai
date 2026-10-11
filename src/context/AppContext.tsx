import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserPreferences, AIProviderStatus } from '../services/ai/types';
import type { AppSettings, UserStats, Achievement } from '../services/db/types';
import { dbService, DEFAULT_SETTINGS, INITIAL_ACHIEVEMENTS } from '../services/db/indexedDb';
import { aiManager } from '../services/ai/aiManager';

export type AppView = 
  | 'landing' 
  | 'onboarding' 
  | 'dashboard' 
  | 'journal' 
  | 'achievements' 
  | 'settings';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  preferences: UserPreferences;
  updatePreferences: (newPref: Partial<UserPreferences>) => Promise<void>;
  aiStatus: AIProviderStatus;
  refreshAiStatus: () => Promise<void>;
  isOnline: boolean;
  stats: UserStats;
  achievements: Achievement[];
  refreshStatsAndAchievements: () => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [aiStatus, setAiStatus] = useState<AIProviderStatus>({
    isAvailable: false,
    runtime: 'unavailable',
    modelName: 'gemma2:2b',
    detectedModels: [],
    endpoint: 'http://localhost:11434',
    lastChecked: new Date().toISOString()
  });
  const [stats, setStats] = useState<UserStats>({
    totalAdventuresCompleted: 0,
    totalQuestsCompleted: 0,
    totalOutdoorMinutes: 0,
    totalJournalNotes: 0,
    uniqueDaysExplored: []
  });
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  const refreshAiStatus = useCallback(async () => {
    try {
      const status = await aiManager.checkGemmaStatus();
      setAiStatus(status);
    } catch {
      setAiStatus(prev => ({
        ...prev,
        isAvailable: false,
        errorMessage: 'Check failed'
      }));
    }
  }, []);

  const refreshStatsAndAchievements = useCallback(async () => {
    try {
      const userStats = await dbService.getStats();
      const userAch = await dbService.getAchievements();
      setStats(userStats);
      setAchievements(userAch);
    } catch (err) {
      console.error('Failed to load stats/achievements:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const loadedSettings = await dbService.getSettings();
        setSettings(loadedSettings);

        // Check if there is an active session
        const activeSession = await dbService.getActiveSession();

        if (activeSession && !activeSession.isCompleted) {
          // If there's an ongoing adventure, go to dashboard where active adventure is shown
          setCurrentView('dashboard');
        } else if (loadedSettings.hasCompletedOnboarding) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('landing');
        }

        // Apply accessibility settings
        if (loadedSettings.reducedMotion) {
          document.documentElement.classList.add('reduce-motion');
        }
        if (loadedSettings.highContrast) {
          document.documentElement.classList.add('high-contrast');
        }

        await refreshStatsAndAchievements();
        await refreshAiStatus();
      } catch (err) {
        console.error('Database initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();

    // Listen to network changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshAiStatus, refreshStatsAndAchievements]);

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await dbService.saveSettings(newSettings);
    setSettings(updated);

    if (newSettings.gemmaEndpoint) {
      aiManager.getGemmaProvider().setEndpoint(newSettings.gemmaEndpoint);
    }
    if (newSettings.gemmaModel) {
      aiManager.getGemmaProvider().setModelName(newSettings.gemmaModel);
    }

    if (newSettings.reducedMotion !== undefined) {
      if (newSettings.reducedMotion) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    }

    if (newSettings.highContrast !== undefined) {
      if (newSettings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }

    await refreshAiStatus();
  };

  const updatePreferences = async (newPref: Partial<UserPreferences>) => {
    const updatedPref = { ...settings.preferences, ...newPref };
    await updateSettings({ preferences: updatedPref });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        settings,
        updateSettings,
        preferences: settings.preferences,
        updatePreferences,
        aiStatus,
        refreshAiStatus,
        isOnline,
        stats,
        achievements,
        refreshStatsAndAchievements,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
