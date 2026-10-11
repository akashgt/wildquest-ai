import React from 'react';
import { Heart, Compass, Shield, Github } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-auto border-t border-sage-200/60 bg-ivory-100/60 py-10 px-4 sm:px-6 mb-16 md:mb-0 text-sm text-forest-800">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
          <div className="flex items-center gap-2 font-display font-bold text-base text-forest-900">
            <Compass className="w-4 h-4 text-forest-600" />
            <span>WildQuest AI</span>
            <span className="text-xs font-normal text-forest-600">· Touch Grass Edition</span>
          </div>
          <p className="text-xs text-forest-700/80 max-w-sm">
            Explore more. Scroll less. Designed for Hacktoberfest 2026’s Touch Grass open-source AI challenge.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-forest-700">
          <button 
            onClick={() => setCurrentView('settings')}
            className="hover:text-forest-950 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-forest-600" />
            <span>100% On-Device Privacy</span>
          </button>
          <span>·</span>
          <span>Open-Weight Google Gemma 2B</span>
          <span>·</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-forest-950 transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open Source</span>
          </a>
        </div>

        <div className="text-xs text-forest-600 flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-terracotta-500 fill-terracotta-500" />
          <span>for mindful exploration</span>
        </div>
      </div>
    </footer>
  );
};
