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

  return (
    <div className="min-h-screen flex flex-col relative text-ivory-100 selection:bg-sunlight-400 selection:text-forest-950">
      {/* Global Photorealistic Forest Background throughout the entire application */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-forest-bg.webp`} 
          alt="" 
          className="w-full h-full object-cover object-center"
        />
        {/* Global Ambient Dark Forest Gradient Overlay: Keeps forest canopy and sunbeams visible while preserving readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/80 via-forest-950/65 to-forest-950/85" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen flex-1">
        <OfflineBanner />

        {isLoading ? (
          <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center p-2 shadow-soft animate-pulse">
              <img src={`${import.meta.env.BASE_URL}icons/leaf-logo.svg`} alt="WildQuest emblem" className="w-full h-full object-contain" />
            </div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-ivory-100">
              WildQuest AI · Loading Nature Space...
            </div>
          </div>
        ) : currentView === 'landing' ? (
          <LandingView />
        ) : currentView === 'onboarding' ? (
          <OnboardingWizard />
        ) : (
          <>
            <Navbar />
            <main className="flex-1 pb-16 md:pb-6">
              {currentView === 'dashboard' && <DashboardView />}
              {currentView === 'journal' && <JournalView />}
              {currentView === 'achievements' && <AchievementsView />}
              {currentView === 'settings' && <SettingsView />}
            </main>
            <Footer />
          </>
        )}

        {/* Signature Distraction-Free Adventure Mode Fullscreen Active Overlay */}
        <AdventureActiveMode />
      </div>
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
