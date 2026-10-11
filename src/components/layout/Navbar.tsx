import React from 'react';
import { Compass, BookOpen, Award, Settings, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, aiStatus } = useApp();

  const navItems = [
    { view: 'dashboard', label: 'Explore', icon: Compass },
    { view: 'journal', label: 'Journal', icon: BookOpen },
    { view: 'achievements', label: 'Badges', icon: Award },
    { view: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <>
      {/* Top Navbar for desktop and tablet */}
      <header className="sticky top-0 z-40 bg-ivory-50/90 backdrop-blur-md border-b border-sage-200/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Wordmark */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
            aria-label="WildQuest AI Home"
          >
            <div className="w-9 h-9 rounded-2xl bg-forest-700 flex items-center justify-center p-1 shadow-soft-sm group-hover:bg-forest-800 transition-colors">
              <img src="/icons/leaf-logo.svg" alt="WildQuest emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-forest-900 group-hover:text-forest-700 transition-colors">
                Wild<span className="text-forest-600">Quest</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded bg-forest-100 text-forest-800 font-semibold">
                AI
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 bg-sage-100/60 p-1 rounded-2xl border border-sage-200/70" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-forest-700 text-ivory-50 shadow-soft-sm'
                      : 'text-forest-800 hover:text-forest-950 hover:bg-sage-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* AI Status Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('settings')}
              className="focus:outline-none rounded-full"
              title={aiStatus.isAvailable ? `Gemma local model active (${aiStatus.modelName})` : 'Using offline rule-based naturalist engine. Click to configure Gemma.'}
            >
              {aiStatus.isAvailable ? (
                <Badge variant="forest" size="sm" icon={<Sparkles className="w-3 h-3 text-forest-600" />}>
                  <span className="hidden xs:inline">Gemma Local</span>
                  <span className="inline xs:hidden">Gemma</span>
                </Badge>
              ) : (
                <Badge variant="sage" size="sm" icon={<AlertCircle className="w-3 h-3 text-sage-600" />}>
                  <span className="hidden xs:inline">Rule-based Fallback</span>
                  <span className="inline xs:hidden">Fallback</span>
                </Badge>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile (Thumb-friendly) */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory-50/95 backdrop-blur-md border-t border-sage-200 px-3 py-2 pb-safe flex justify-around items-center shadow-soft-lg"
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-forest-700 font-semibold'
                  : 'text-forest-600/70 hover:text-forest-900'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-forest-100 text-forest-800' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
