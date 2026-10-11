import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  Sun, 
  Moon, 
  X, 
  Clock, 
  ShieldAlert, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useAdventure } from '../../context/AdventureContext';
import { useApp } from '../../context/AppContext';
import { QuestCompletionModal } from './QuestCompletionModal';

export const AdventureActiveMode: React.FC = () => {
  const { 
    activeSession, 
    currentQuest, 
    currentQuestIndex, 
    totalQuests,
    isAdventureActive,
    isPaused,
    isScreenLightMode,
    elapsedSeconds,
    completeCurrentQuest,
    skipCurrentQuest,
    togglePause,
    toggleScreenLightMode,
    exitAdventure,
    finishAdventure
  } = useAdventure();

  const { setCurrentView } = useApp();

  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showFinishedCelebration, setShowFinishedCelebration] = useState(false);

  if (!isAdventureActive || !activeSession || !currentQuest) {
    return null;
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((currentQuestIndex) / totalQuests) * 100);
  const isFinalStep = currentQuestIndex === totalQuests - 1;

  const handleCompleteCurrent = async (note?: string, photoUrl?: string) => {
    setIsCompletionModalOpen(false);
    const result = await completeCurrentQuest(note, photoUrl);
    if (result.isFinished) {
      // Finished all quests!
      await finishAdventure();
      setShowFinishedCelebration(true);
    }
  };

  const handleSkipCurrent = async () => {
    const result = await skipCurrentQuest();
    if (result.isFinished) {
      await finishAdventure();
      setShowFinishedCelebration(true);
    }
  };

  return (
    <>
      {/* Full-screen distraction-free overlay */}
      <section 
        aria-label="Active Outdoor Adventure"
        className={`fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto transition-colors duration-300 ${
          isScreenLightMode
            ? 'screen-light-mode'
            : 'bg-[#FAF8F5] text-forest-900'
        }`}
      >
        {/* Top Header Controls */}
        <header className="p-4 sm:p-6 flex items-center justify-between border-b border-forest-600/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowExitConfirm(true)}
              className={`p-2 rounded-2xl transition-colors ${
                isScreenLightMode 
                  ? 'text-ivory-300 hover:bg-forest-800' 
                  : 'text-forest-700 hover:bg-forest-100'
              }`}
              title="Exit adventure"
              aria-label="Exit adventure"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-forest-600">
                Step {currentQuestIndex + 1} of {totalQuests}
              </div>
              <h1 className={`text-sm sm:text-base font-bold font-display truncate max-w-xs sm:max-w-md ${
                isScreenLightMode ? 'text-ivory-100' : 'text-forest-900'
              }`}>
                {activeSession.adventure.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Screen-light mode toggle */}
            <button
              onClick={toggleScreenLightMode}
              className={`p-2 rounded-2xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                isScreenLightMode
                  ? 'bg-forest-800 text-sunlight-300 border-forest-700'
                  : 'bg-ivory-100 text-forest-700 border-sage-200 hover:bg-sage-100'
              }`}
              title="Toggle Screen-Light Mode (Dark, low-glare outdoor mode)"
              aria-label="Toggle Screen-Light Mode"
            >
              {isScreenLightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="hidden sm:inline">Screen-Light</span>
            </button>

            {/* Timer widget with pause toggle */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border font-mono text-xs sm:text-sm font-bold ${
              isScreenLightMode 
                ? 'bg-forest-800 border-forest-700 text-sunlight-300' 
                : 'bg-ivory-100 border-sage-200 text-forest-900'
            }`}>
              <Clock className="w-3.5 h-3.5 text-forest-600" />
              <span>{formatTime(elapsedSeconds)}</span>
              <button
                onClick={togglePause}
                className="ml-1 p-1 hover:opacity-75 focus:outline-none"
                title={isPaused ? 'Resume timer' : 'Pause timer'}
                aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Progress bar across top */}
        <div className="w-full px-4 sm:px-6 py-2">
          <ProgressBar progress={progressPercent} color="forest" />
        </div>

        {/* Main Quest Content — Large, Readable, Calming */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-8 sm:py-12 max-w-3xl mx-auto w-full text-center">
          {/* Signature Required Quote Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunlight-200/80 text-forest-950 font-semibold text-xs sm:text-sm shadow-soft-sm animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-forest-800" />
            <span>You're ready. Look up and explore.</span>
          </div>

          {/* Quest Category & Step number */}
          <div className="mb-3">
            <Badge variant="sage" size="md">
              {currentQuest.category}
            </Badge>
          </div>

          {/* Quest Title */}
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight mb-6 leading-tight ${
            isScreenLightMode ? 'text-ivory-50' : 'text-forest-950'
          }`}>
            {currentQuest.title}
          </h2>

          {/* Large Readable Real-World Instruction */}
          <div className={`text-base sm:text-xl md:text-2xl font-normal leading-relaxed max-w-2xl mb-8 ${
            isScreenLightMode ? 'text-sage-100' : 'text-forest-800'
          }`}>
            {currentQuest.instruction}
          </div>

          {/* Mindful Lock Phone Outdoor Encouragement */}
          <div className={`p-4 rounded-3xl border max-w-md w-full flex items-center justify-center gap-3 text-xs sm:text-sm font-medium mb-4 ${
            isScreenLightMode 
              ? 'bg-forest-900 border-forest-800 text-sage-200' 
              : 'bg-sage-100/70 border-sage-200 text-forest-800'
          }`}>
            <Lock className="w-4 h-4 text-sunlight-500 shrink-0" />
            <span>Put your phone in your pocket & take your time.</span>
          </div>

          {currentQuest.safetyTip && (
            <div className={`text-xs flex items-center gap-1.5 max-w-md text-center ${
              isScreenLightMode ? 'text-sage-300' : 'text-forest-600'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>{currentQuest.safetyTip}</span>
            </div>
          )}
        </main>

        {/* Bottom Controls Bar */}
        <footer className={`p-4 sm:p-6 border-t ${
          isScreenLightMode ? 'border-forest-800 bg-forest-900/90' : 'border-sage-200 bg-ivory-50/90'
        } backdrop-blur-md`}>
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="md"
              onClick={handleSkipCurrent}
              icon={<SkipForward className="w-4 h-4" />}
            >
              Skip Step
            </Button>

            <Button
              variant="sunlight"
              size="lg"
              className="flex-1 text-base shadow-soft-md"
              onClick={() => setIsCompletionModalOpen(true)}
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              Mark Completed
            </Button>
          </div>
        </footer>
      </section>

      {/* Quest Reflection & Completion Modal */}
      <QuestCompletionModal
        isOpen={isCompletionModalOpen}
        quest={currentQuest}
        stepNumber={currentQuestIndex + 1}
        totalSteps={totalQuests}
        isFinalQuest={isFinalStep}
        onComplete={handleCompleteCurrent}
        onClose={() => setIsCompletionModalOpen(false)}
      />

      {/* Exit Adventure Confirmation Modal */}
      {showExitConfirm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory-50 rounded-3xl p-6 max-w-sm w-full border border-sage-200 shadow-soft-lg space-y-4">
            <h3 className="text-lg font-bold font-display text-forest-900">
              Pause or End Adventure?
            </h3>
            <p className="text-xs text-forest-700 leading-relaxed">
              Your active progress is saved automatically in your browser. You can resume anytime from the dashboard, or end it now.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExitConfirm(false)}
              >
                Keep Exploring
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={async () => {
                  setShowExitConfirm(false);
                  await exitAdventure();
                }}
              >
                End Adventure
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Finished Adventure Celebration View */}
      {showFinishedCelebration && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-ivory-50 rounded-4xl p-8 max-w-md w-full border border-sage-200 shadow-soft-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-forest-700 text-sunlight-400 mx-auto flex items-center justify-center shadow-soft">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <Badge variant="sunlight" size="sm" className="mb-2">Adventure Completed</Badge>
              <h3 className="text-2xl font-bold font-display text-forest-900">
                Welcome Back, Explorer!
              </h3>
              <p className="text-xs sm:text-sm text-forest-700 mt-2 leading-relaxed">
                You took time to unplug, notice the details of the living world, and connect with nature. Your observation entry has been saved to your nature journal.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setShowFinishedCelebration(false);
                  setCurrentView('journal');
                }}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                View in Nature Journal
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
