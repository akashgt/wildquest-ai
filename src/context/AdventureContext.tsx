import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Adventure, Quest } from '../services/ai/types';
import type { ActiveAdventureSession, JournalEntry } from '../services/db/types';
import { dbService } from '../services/db/indexedDb';
import { agentTracer } from '../services/telemetry/agentTracer';

interface AdventureContextType {
  activeSession: ActiveAdventureSession | null;
  currentQuest: Quest | null;
  currentQuestIndex: number;
  totalQuests: number;
  isAdventureActive: boolean;
  isPaused: boolean;
  isScreenLightMode: boolean;
  elapsedSeconds: number;
  startAdventure: (adventure: Adventure) => Promise<void>;
  completeCurrentQuest: (note?: string, photoUrl?: string) => Promise<{ isFinished: boolean }>;
  skipCurrentQuest: () => Promise<{ isFinished: boolean }>;
  togglePause: () => void;
  toggleScreenLightMode: () => void;
  exitAdventure: () => Promise<void>;
  finishAdventure: () => Promise<JournalEntry>;
}

const AdventureContext = createContext<AdventureContextType | null>(null);

export const AdventureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSession, setActiveSession] = useState<ActiveAdventureSession | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load active session from IndexedDB on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const saved = await dbService.getActiveSession();
        if (saved && !saved.isCompleted) {
          setActiveSession(saved);
          setElapsedSeconds(saved.elapsedSeconds);
        }
      } catch (err) {
        console.error('Failed to restore active adventure session:', err);
      }
    }
    restoreSession();
  }, []);

  // Timer effect
  useEffect(() => {
    if (activeSession && !activeSession.isPaused && !activeSession.isCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 1;
          // Periodically sync elapsed time to DB every 5 seconds
          if (next % 5 === 0 && activeSession) {
            dbService.saveActiveSession({
              ...activeSession,
              elapsedSeconds: next
            });
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [activeSession]);

  const startAdventure = useCallback(async (adventure: Adventure) => {
    const session: ActiveAdventureSession = {
      adventure,
      currentQuestIndex: 0,
      completedQuestIds: [],
      skippedQuestIds: [],
      questNotes: {},
      questPhotos: {},
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0,
      isPaused: false,
      isScreenLightMode: false,
      isCompleted: false
    };

    await dbService.saveActiveSession(session);
    setActiveSession(session);
    setElapsedSeconds(0);

    agentTracer.logTrace({
      action: 'generate_quest',
      provider: adventure.generatedBy,
      modelName: adventure.modelIdentifier || 'rule-based',
      success: true,
      metadata: { adventureId: adventure.id, questCount: adventure.quests.length }
    });
  }, []);

  const togglePause = useCallback(() => {
    if (!activeSession) return;
    const updated: ActiveAdventureSession = {
      ...activeSession,
      isPaused: !activeSession.isPaused,
      elapsedSeconds
    };
    setActiveSession(updated);
    dbService.saveActiveSession(updated);
  }, [activeSession, elapsedSeconds]);

  const toggleScreenLightMode = useCallback(() => {
    if (!activeSession) return;
    const updated: ActiveAdventureSession = {
      ...activeSession,
      isScreenLightMode: !activeSession.isScreenLightMode,
      elapsedSeconds
    };
    setActiveSession(updated);
    dbService.saveActiveSession(updated);
  }, [activeSession, elapsedSeconds]);

  const finishAdventure = useCallback(async (): Promise<JournalEntry> => {
    if (!activeSession) {
      throw new Error('No active adventure to finish');
    }

    const { adventure, completedQuestIds, questNotes, questPhotos } = activeSession;
    const minutesSpent = Math.max(1, Math.round(elapsedSeconds / 60));

    // Compile completed quests summary
    const completedQuestsInfo = adventure.quests
      .filter(q => completedQuestIds.includes(q.id))
      .map(q => ({
        title: q.title,
        category: q.category
      }));

    // Aggregate reflections into personal notes
    const reflections = Object.entries(questNotes)
      .map(([qId, note]) => {
        const quest = adventure.quests.find(q => q.id === qId);
        return quest ? `• ${quest.title}: ${note}` : `• ${note}`;
      })
      .join('\n\n');

    // First photo if any
    const firstPhoto = Object.values(questPhotos).find(p => !!p);

    const journalEntry: JournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adventureId: adventure.id,
      adventureTitle: adventure.title,
      date: new Date().toISOString().split('T')[0],
      completedQuests: completedQuestsInfo,
      personalNotes: reflections || undefined,
      photoUrl: firstPhoto,
      outdoorMinutes: minutesSpent,
      environment: adventure.environment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Journal
    await dbService.saveJournalEntry(journalEntry);

    // Record stats and achievements
    await dbService.recordAdventureCompletion(adventure, completedQuestIds.length, minutesSpent);

    // Clear active session
    await dbService.saveActiveSession(null);
    setActiveSession(null);

    agentTracer.logTrace({
      action: 'adventure_completed',
      provider: adventure.generatedBy,
      modelName: adventure.modelIdentifier || 'rule-based',
      durationMs: elapsedSeconds * 1000,
      success: true,
      metadata: {
        completedQuests: completedQuestIds.length,
        totalQuests: adventure.quests.length,
        minutesSpent
      }
    });

    return journalEntry;
  }, [activeSession, elapsedSeconds]);

  const completeCurrentQuest = useCallback(async (note?: string, photoUrl?: string) => {
    if (!activeSession) return { isFinished: true };

    const currentQuest = activeSession.adventure.quests[activeSession.currentQuestIndex];
    if (!currentQuest) return { isFinished: true };

    const completedQuestIds = [...activeSession.completedQuestIds, currentQuest.id];
    const questNotes = { ...activeSession.questNotes };
    const questPhotos = { ...activeSession.questPhotos };

    if (note && note.trim()) {
      questNotes[currentQuest.id] = note.trim();
    }
    if (photoUrl) {
      questPhotos[currentQuest.id] = photoUrl;
    }

    const nextIndex = activeSession.currentQuestIndex + 1;
    const isFinished = nextIndex >= activeSession.adventure.quests.length;

    const updated: ActiveAdventureSession = {
      ...activeSession,
      currentQuestIndex: nextIndex,
      completedQuestIds,
      questNotes,
      questPhotos,
      elapsedSeconds,
      isCompleted: isFinished
    };

    setActiveSession(updated);
    await dbService.saveActiveSession(updated);

    return { isFinished };
  }, [activeSession, elapsedSeconds]);

  const skipCurrentQuest = useCallback(async () => {
    if (!activeSession) return { isFinished: true };

    const currentQuest = activeSession.adventure.quests[activeSession.currentQuestIndex];
    if (!currentQuest) return { isFinished: true };

    const skippedQuestIds = [...activeSession.skippedQuestIds, currentQuest.id];
    const nextIndex = activeSession.currentQuestIndex + 1;
    const isFinished = nextIndex >= activeSession.adventure.quests.length;

    const updated: ActiveAdventureSession = {
      ...activeSession,
      currentQuestIndex: nextIndex,
      skippedQuestIds,
      elapsedSeconds,
      isCompleted: isFinished
    };

    setActiveSession(updated);
    await dbService.saveActiveSession(updated);

    return { isFinished };
  }, [activeSession, elapsedSeconds]);

  const exitAdventure = useCallback(async () => {
    await dbService.saveActiveSession(null);
    setActiveSession(null);
    setElapsedSeconds(0);
  }, []);

  const currentQuest = activeSession && activeSession.adventure.quests[activeSession.currentQuestIndex]
    ? activeSession.adventure.quests[activeSession.currentQuestIndex]
    : null;

  return (
    <AdventureContext.Provider
      value={{
        activeSession,
        currentQuest,
        currentQuestIndex: activeSession?.currentQuestIndex ?? 0,
        totalQuests: activeSession?.adventure.quests.length ?? 0,
        isAdventureActive: !!activeSession && !activeSession.isCompleted,
        isPaused: activeSession?.isPaused ?? false,
        isScreenLightMode: activeSession?.isScreenLightMode ?? false,
        elapsedSeconds,
        startAdventure,
        completeCurrentQuest,
        skipCurrentQuest,
        togglePause,
        toggleScreenLightMode,
        exitAdventure,
        finishAdventure
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

export const useAdventure = (): AdventureContextType => {
  const context = useContext(AdventureContext);
  if (!context) {
    throw new Error('useAdventure must be used within an AdventureProvider');
  }
  return context;
};
