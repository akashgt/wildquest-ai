import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdventureProvider } from './context/AdventureContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { LandingView } from './components/landing/LandingView';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { DashboardView } from './components/dashboard/DashboardView';
import { JournalView } from './components/journal/JournalView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { SettingsView } from './components/settings/SettingsView';
import { AdventureActiveMode } from './components/adventure/AdventureActiveMode';

const MainAppContent: React.FC = () => {
  const { currentView, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center p-2 shadow-soft animate-pulse">
          <img src="/icons/leaf-logo.svg" alt="WildQuest emblem" className="w-full h-full object-contain" />
        </div>
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-forest-700">
          WildQuest AI · Loading Nature Space...
        </div>
      </div>
    );
  }

  if (currentView === 'landing') {
    return (
      <>
        <OfflineBanner />
        <LandingView />
      </>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <>
        <OfflineBanner />
        <OnboardingWizard />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-forest-900">
      <OfflineBanner />
      <Navbar />

      <main className="flex-1 pb-16 md:pb-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'journal' && <JournalView />}
        {currentView === 'achievements' && <AchievementsView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      <Footer />

      {/* Signature Distraction-Free Adventure Mode Fullscreen Active Overlay */}
      <AdventureActiveMode />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AdventureProvider>
        <MainAppContent />
      </AdventureProvider>
    </AppProvider>
  );
};

export default App;
