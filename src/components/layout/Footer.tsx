import React from 'react';
import { Heart, Compass, Shield, Github } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="mt-auto border-t border-forest-800/80 bg-forest-950/85 backdrop-blur-md py-10 px-4 sm:px-6 mb-16 md:mb-0 text-sm text-sage-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
          <div className="flex items-center gap-2 font-display font-bold text-base text-ivory-50">
            <Compass className="w-4 h-4 text-sunlight-400" />
            <span>WildQuest AI</span>
            <span className="text-xs font-normal text-sage-300">· Touch Grass Edition</span>
          </div>
          <p className="text-xs text-sage-300/80 max-w-sm">
            Explore more. Scroll less. Designed for Hacktoberfest 2026’s Touch Grass open-source AI challenge.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-sage-300">
          <button 
            onClick={() => setCurrentView('settings')}
            className="hover:text-ivory-50 transition-colors flex items-center gap-1"
          >
            <Shield className="w-3.5 h-3.5 text-sunlight-400" />
            <span>100% On-Device Privacy</span>
          </button>
          <span>·</span>
          <span>Open-Weight Google Gemma 2B</span>
          <span>·</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ivory-50 transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open Source</span>
          </a>
        </div>

        <div className="text-xs text-sage-400 flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-terracotta-400 fill-terracotta-400" />
          <span>for mindful exploration</span>
        </div>
      </div>
    </footer>
  );
};
