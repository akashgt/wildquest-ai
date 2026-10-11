import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Footprints, 
  Clock, 
  Award, 
  BookOpen, 
  Plus, 
  Cpu, 
  CheckCircle2, 
  Trees, 
  Play
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { useAdventure } from '../../context/AdventureContext';
import { AdventureGeneratorModal } from '../adventure/AdventureGeneratorModal';
import { dbService } from '../../services/db/indexedDb';
import type { JournalEntry } from '../../services/db/types';

export const DashboardView: React.FC = () => {
  const { preferences, stats, aiStatus, setCurrentView } = useApp();
  const { isAdventureActive, activeSession } = useAdventure();
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const entries = await dbService.getJournalEntries();
        setRecentEntries(entries.slice(0, 3));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    loadData();
  }, [stats]);

  // Personalized dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Weekly activity days visualization based on real uniqueDaysExplored
  const getWeeklyDays = () => {
    const days = [];
    const today = new Date();
    // Show last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const isExplored = stats.uniqueDaysExplored.includes(iso);
      const isToday = i === 0;
      days.push({ dayName, iso, isExplored, isToday });
    }
    return days;
  };

  const weeklyDays = getWeeklyDays();

  // Featured sample adventure based on current environment and interests
  const featuredTitle = `${preferences.environment.charAt(0).toUpperCase() + preferences.environment.slice(1)} Sensory Path`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Active adventure resuming banner if currently ongoing */}
      {isAdventureActive && activeSession && (
        <aside 
          aria-label="Active adventure in progress"
          className="bg-forest-800 text-ivory-50 rounded-3xl p-5 sm:p-6 border border-forest-700 shadow-soft-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-nature-pulse"
        >
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-forest-700 text-sunlight-400 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="text-xs font-mono font-semibold text-sunlight-300 uppercase tracking-wider">
                Adventure in Progress · Step {activeSession.currentQuestIndex + 1} of {activeSession.adventure.quests.length}
              </div>
              <h2 className="text-lg font-bold font-display text-ivory-50">
                {activeSession.adventure.title}
              </h2>
            </div>
          </div>
          <Button
            variant="sunlight"
            size="md"
            className="w-full sm:w-auto shrink-0"
            icon={<Play className="w-4 h-4 fill-forest-950" />}
            onClick={() => {
              // Adventure mode overlay will handle this
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Resume Adventure
          </Button>
        </aside>
      )}

      {/* Greeting Header & Primary Action */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-forest-700/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-sunlight-400 font-mono">
              Nature Awaits Outside
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-sunlight-400" />
            <span className="text-xs text-sage-200">
              {preferences.environment} · {preferences.durationMinutes}m window
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-ivory-50 tracking-tight drop-shadow-sm">
            {getGreeting()}, Explorer.
          </h1>
          <p className="text-sm text-sage-200/90 mt-1 max-w-xl">
            Step away from screens and notice the living world right outside your door.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            className="shadow-soft-md"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setIsGeneratorOpen(true)}
          >
            Create an Adventure
          </Button>
        </div>
      </section>

      {/* Real Stats Overview & Weekly Activity Visualization */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Real Metrics Card */}
        <Card variant="default" className="p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-forest-700/80 uppercase tracking-wider font-mono mb-3">
              Recorded Activity
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-forest-900">
                  {stats.totalOutdoorMinutes}
                </div>
                <div className="text-xs font-medium text-forest-600 flex items-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5" /> Outdoor Minutes
                </div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-forest-900">
                  {stats.totalQuestsCompleted}
                </div>
                <div className="text-xs font-medium text-forest-600 flex items-center gap-1 mt-1">
                  <Footprints className="w-3.5 h-3.5" /> Quests Finished
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-sage-200/60 text-xs text-forest-700 flex justify-between items-center">
            <span>{stats.totalAdventuresCompleted} total adventures</span>
            <button 
              onClick={() => setCurrentView('achievements')}
              className="font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-forest-600" />
              Badges
            </button>
          </div>
        </Card>

        {/* Weekly Activity Visualization */}
        <Card variant="default" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-forest-700/80 uppercase tracking-wider font-mono">
                Past 7 Days
              </span>
              <span className="text-xs text-forest-600 font-medium">
                {stats.uniqueDaysExplored.length} days explored
              </span>
            </div>
            <div className="flex items-center justify-between gap-1.5 py-3">
              {weeklyDays.map((d, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                      d.isExplored 
                        ? 'bg-forest-700 text-sunlight-300 shadow-soft-sm' 
                        : 'bg-sage-100 text-forest-600/60 border border-sage-200/60'
                    } ${d.isToday ? 'ring-2 ring-forest-600 ring-offset-2' : ''}`}
                    title={`${d.iso}: ${d.isExplored ? 'Explored' : 'No recorded activity'}`}
                  >
                    {d.isExplored ? <CheckCircle2 className="w-4 h-4 text-sunlight-400" /> : d.dayName}
                  </div>
                  <span className={`text-[10px] font-medium ${d.isToday ? 'font-bold text-forest-900' : 'text-forest-600'}`}>
                    {d.dayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-forest-600 leading-snug">
            Every minute outdoors counts. No guilt-based streaks—just mindful steps.
          </div>
        </Card>

        {/* Local AI Availability Indicator (Honest & Truthful) */}
        <Card variant="default" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-forest-700/80 uppercase tracking-wider font-mono">
                AI Engine Status
              </span>
              <button
                onClick={() => setCurrentView('settings')}
                className="text-xs font-medium text-forest-700 hover:text-forest-900 underline"
              >
                Configure
              </button>
            </div>

            {aiStatus.isAvailable ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-forest-800 font-semibold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Google Gemma (Local Edge)</span>
                </div>
                <p className="text-xs text-forest-700">
                  Model: <span className="font-mono font-bold text-forest-900">{aiStatus.modelName}</span>
                </p>
                <div className="text-[11px] text-forest-600">
                  Running entirely locally via Ollama. Zero network requests during generation.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-forest-800 font-semibold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Curated Naturalist Engine</span>
                </div>
                <p className="text-xs text-forest-700">
                  Status: <span className="font-semibold text-forest-900">Rule-based Fallback Active</span>
                </p>
                <div className="text-[11px] text-forest-600">
                  Ollama local Gemma model is not reachable. Using deterministic offline quests.
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-sage-200/60 flex items-center justify-between text-xs text-forest-700">
            <span className="flex items-center gap-1 font-mono">
              <Cpu className="w-3.5 h-3.5 text-forest-600" />
              {aiStatus.isAvailable ? `${aiStatus.latencyMs ?? 0}ms ping` : 'Offline Ready'}
            </span>
            <button
              onClick={() => setCurrentView('settings')}
              className="text-xs font-semibold text-forest-800 hover:text-forest-950"
            >
              Setup Gemma &rarr;
            </button>
          </div>
        </Card>
      </section>

      {/* Featured Adventure & Recommended Micro-Quests */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Adventure Card */}
        <div className="lg:col-span-2">
          <Card variant="forest" className="p-6 sm:p-8 h-full flex flex-col justify-between shadow-soft-md relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Badge variant="sunlight" size="sm">
                  Featured Adventure
                </Badge>
                <span className="text-xs font-mono text-sage-200">
                  {preferences.durationMinutes} Minutes · {preferences.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-ivory-50 mb-3">
                {featuredTitle}
              </h2>
              <p className="text-sm text-sage-200 max-w-xl leading-relaxed mb-6">
                A personalized outdoor journey through your local {preferences.environment}. Designed to sharpen your senses, awaken botanical curiosity, and immerse you in natural rhythms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-forest-900/60 border border-forest-700/60 p-3 rounded-2xl">
                  <div className="text-[11px] text-sage-300 font-mono">Step 1</div>
                  <div className="text-xs font-semibold text-ivory-100 mt-0.5">Leaf & Bark Noticing</div>
                </div>
                <div className="bg-forest-900/60 border border-forest-700/60 p-3 rounded-2xl">
                  <div className="text-[11px] text-sage-300 font-mono">Step 2</div>
                  <div className="text-xs font-semibold text-ivory-100 mt-0.5">Two Minutes of Bird Song</div>
                </div>
                <div className="bg-forest-900/60 border border-forest-700/60 p-3 rounded-2xl">
                  <div className="text-[11px] text-sage-300 font-mono">Step 3</div>
                  <div className="text-xs font-semibold text-ivory-100 mt-0.5">Five Shades of Green</div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest-700/60">
              <div className="text-xs text-sage-300 flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-sunlight-400" />
                <span>Zero screen interaction during observation</span>
              </div>
              <Button
                variant="sunlight"
                size="md"
                onClick={() => setIsGeneratorOpen(true)}
                icon={<Play className="w-4 h-4 fill-forest-950" />}
              >
                Start This Adventure
              </Button>
            </div>
          </Card>
        </div>

        {/* Nature Journal Preview Widget */}
        <div className="flex flex-col">
          <Card variant="default" className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-display text-lg text-forest-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-forest-600" />
                  Nature Journal
                </h3>
                <button
                  onClick={() => setCurrentView('journal')}
                  className="text-xs font-semibold text-forest-700 hover:text-forest-900"
                >
                  View All &rarr;
                </button>
              </div>

              {recentEntries.length === 0 ? (
                <div className="py-8 text-center text-forest-600">
                  <BookOpen className="w-8 h-8 text-sage-300 mx-auto mb-2" />
                  <p className="text-xs font-medium">No journal observations yet.</p>
                  <p className="text-[11px] text-forest-600/80 mt-1 max-w-xs mx-auto">
                    Complete your first outdoor adventure to record personal reflections and optional photos.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentEntries.map(entry => (
                    <div 
                      key={entry.id}
                      onClick={() => setCurrentView('journal')}
                      className="p-3 rounded-2xl bg-ivory-100/70 border border-sage-200/80 hover:border-forest-600/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px] text-forest-600 mb-1 font-mono">
                        <span>{entry.date}</span>
                        <span>{entry.outdoorMinutes}m outdoors</span>
                      </div>
                      <div className="text-xs font-bold text-forest-900 truncate">
                        {entry.adventureTitle}
                      </div>
                      {entry.personalNotes && (
                        <p className="text-xs text-forest-700 mt-1 line-clamp-2 italic">
                          "{entry.personalNotes}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              onClick={() => setCurrentView('journal')}
            >
              Open Full Nature Journal
            </Button>
          </Card>
        </div>
      </section>

      {/* Generator Modal */}
      <AdventureGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
      />
    </div>
  );
};
