import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline } = useApp();

  if (isOnline) return null;

  return (
    <aside 
      aria-label="Offline Mode Notice"
      className="bg-forest-900 text-ivory-100 border-b border-forest-700/60 px-4 py-2.5 text-xs md:text-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-forest-800 text-sunlight-400">
            <WifiOff className="w-3.5 h-3.5" />
          </span>
          <span className="font-medium">
            <span className="font-semibold text-sunlight-300">Offline Mode Active.</span> Saved adventures, active quests, and nature journal remain 100% accessible locally.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-sage-300 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-400" />
          <span>Local storage active</span>
        </div>
      </div>
    </aside>
  );
};
