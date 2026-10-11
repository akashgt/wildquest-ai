import React, { useState } from 'react';
import { 
  Sparkles, 
  Compass, 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  Play,
  RotateCcw,
  Cpu,
  Layers
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import { useAdventure } from '../../context/AdventureContext';
import { aiManager } from '../../services/ai/aiManager';
import type { Adventure, DifficultyLevel, EnvironmentType, UserPreferences } from '../../services/ai/types';

interface AdventureGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdventureGeneratorModal: React.FC<AdventureGeneratorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { preferences, aiStatus } = useApp();
  const { startAdventure } = useAdventure();

  const [durationMinutes, setDurationMinutes] = useState<number>(preferences.durationMinutes);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(preferences.difficulty);
  const [environment, setEnvironment] = useState<EnvironmentType>(preferences.environment);
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'gemma' | 'rule-based'>('auto');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAdventure, setGeneratedAdventure] = useState<Adventure | null>(null);
  const [generationMeta, setGenerationMeta] = useState<{
    provider: string;
    modelName: string;
    durationMs: number;
    fallbackTriggered: boolean;
    fallbackReason?: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const natureQuotes = [
    'Noticing small patterns in bark grounds your nervous system.',
    'Bird calls carry micro-information about local air movements.',
    'Trees leave channels between their crowns called crown shyness.',
    'Five minutes in green spaces measurably reduces cortisol levels.'
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedAdventure(null);
    setGenerationMeta(null);

    const quoteTimer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % natureQuotes.length);
    }, 2800);

    try {
      const targetPrefs: UserPreferences = {
        ...preferences,
        durationMinutes,
        difficulty,
        environment
      };

      const forceParam = selectedProvider === 'rule-based' 
        ? 'rule-based' 
        : selectedProvider === 'gemma' 
        ? 'gemma' 
        : undefined;

      const result = await aiManager.generate(targetPrefs, forceParam);

      setGeneratedAdventure(result.adventure);
      setGenerationMeta({
        provider: result.providerUsed,
        modelName: result.modelName,
        durationMs: result.durationMs,
        fallbackTriggered: result.fallbackTriggered,
        fallbackReason: result.fallbackReason
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    } finally {
      clearInterval(quoteTimer);
      setIsGenerating(false);
    }
  };

  const handleStartAdventure = async () => {
    if (!generatedAdventure) return;
    await startAdventure(generatedAdventure);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create an Outdoor Adventure"
      maxWidth="lg"
    >
      {!generatedAdventure && !isGenerating && (
        <div className="space-y-6">
          {/* Surroundings selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
              Surroundings
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['garden', 'urban', 'park', 'forest', 'waterfront'] as EnvironmentType[]).map(env => (
                <button
                  key={env}
                  type="button"
                  onClick={() => setEnvironment(env)}
                  className={`p-2.5 rounded-2xl border text-xs font-medium capitalize text-left transition-all ${
                    environment === env
                      ? 'bg-forest-700 text-ivory-50 border-forest-800 shadow-soft-sm'
                      : 'bg-ivory-100 text-forest-850 border-sage-200 hover:border-forest-600/50'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
                Duration (Minutes)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 10, 20, 30, 60].map(dur => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`py-2 rounded-xl border text-xs font-bold font-display transition-all ${
                      durationMinutes === dur
                        ? 'bg-forest-700 text-sunlight-300 border-forest-800'
                        : 'bg-ivory-100 text-forest-800 border-sage-200'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-2">
                Intensity
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['easy', 'explorer', 'advanced'] as DifficultyLevel[]).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-1 rounded-xl border text-xs font-medium capitalize text-center truncate transition-all ${
                      difficulty === diff
                        ? 'bg-forest-700 text-ivory-50 border-forest-800'
                        : 'bg-ivory-100 text-forest-800 border-sage-200'
                    }`}
                  >
                    {diff === 'explorer' ? 'Explorer' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Engine Choice */}
          <div className="p-3.5 rounded-2xl bg-sage-100/70 border border-sage-200 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-forest-900 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-forest-600" />
                Inference Provider
              </span>
              {aiStatus.isAvailable ? (
                <Badge variant="forest" size="sm">Ollama Gemma Ready</Badge>
              ) : (
                <Badge variant="sage" size="sm">Rule-Based Active</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setSelectedProvider('gemma')}
                className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all ${
                  selectedProvider === 'gemma'
                    ? 'bg-forest-700 text-ivory-50 border-forest-800'
                    : 'bg-ivory-50 text-forest-800 border-sage-200'
                }`}
              >
                <div className="font-semibold">Local Gemma 2B</div>
                <div className={selectedProvider === 'gemma' ? 'text-sage-200' : 'text-forest-600'}>
                  Edge LLM via Ollama
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('rule-based')}
                className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all ${
                  selectedProvider === 'rule-based'
                    ? 'bg-forest-700 text-ivory-50 border-forest-800'
                    : 'bg-ivory-50 text-forest-800 border-sage-200'
                }`}
              >
                <div className="font-semibold">Naturalist Engine</div>
                <div className={selectedProvider === 'rule-based' ? 'text-sage-200' : 'text-forest-600'}>
                  100% Offline Rule-based
                </div>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-terracotta-100/80 border border-terracotta-300 text-xs text-terracotta-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleGenerate}
              icon={<Sparkles className="w-4 h-4 text-sunlight-400" />}
            >
              Generate Adventure
            </Button>
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-3xl bg-forest-100 border-2 border-forest-600/30 flex items-center justify-center animate-spin">
              <Compass className="w-8 h-8 text-forest-700" />
            </div>
          </div>
          <h4 className="text-lg font-bold font-display text-forest-900">
            Crafting Your Nature Adventure...
          </h4>
          <p className="text-xs text-forest-600 italic max-w-sm transition-all duration-300">
            "{natureQuotes[quoteIndex]}"
          </p>
          <span className="text-[11px] font-mono text-forest-500">
            Validating structured JSON against safety guidelines
          </span>
        </div>
      )}

      {/* Generated Adventure Preview */}
      {generatedAdventure && !isGenerating && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Metadata & Provenance Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-sage-100/80 rounded-2xl border border-sage-200 text-xs">
            <div className="flex items-center gap-2">
              {generationMeta?.fallbackTriggered ? (
                <Badge variant="sage" size="sm" icon={<Layers className="w-3 h-3 text-sage-600" />}>
                  Naturalist Engine (Fallback)
                </Badge>
              ) : (
                <Badge variant="forest" size="sm" icon={<Sparkles className="w-3 h-3 text-forest-600" />}>
                  {generationMeta?.provider === 'gemma' ? `Local Gemma (${generationMeta?.modelName})` : 'Naturalist Engine'}
                </Badge>
              )}
              <span className="text-forest-600 font-mono text-[11px]">
                {generationMeta?.durationMs}ms
              </span>
            </div>

            {generationMeta?.fallbackTriggered && (
              <span className="text-[11px] text-forest-700 italic">
                Local model offline: rule-based fallback activated safely.
              </span>
            )}
          </div>

          {/* Adventure Details */}
          <div>
            <h3 className="text-2xl font-bold font-display text-forest-900 mb-1.5">
              {generatedAdventure.title}
            </h3>
            <p className="text-sm text-forest-700 leading-relaxed mb-4">
              {generatedAdventure.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-forest-600 font-medium mb-4">
              <span className="flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-forest-600" />
                {generatedAdventure.durationMinutes} min
              </span>
              <span>·</span>
              <span className="capitalize">{generatedAdventure.environment}</span>
              <span>·</span>
              <span className="capitalize">{generatedAdventure.difficulty}</span>
              <span>·</span>
              <span>{generatedAdventure.quests.length} Quests</span>
            </div>
          </div>

          {/* Quests preview list */}
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {generatedAdventure.quests.map((q, idx) => (
              <div 
                key={q.id || idx}
                className="p-3.5 rounded-2xl bg-ivory-100/80 border border-sage-200/90 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-forest-900 mb-1">
                  <span>Step {idx + 1}: {q.title}</span>
                  <span className="font-mono text-forest-600 font-normal">{q.estimatedMinutes}m</span>
                </div>
                <p className="text-forest-700 leading-relaxed">
                  {q.instruction}
                </p>
                {q.safetyTip && (
                  <div className="text-[11px] text-forest-600/80 mt-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-sage-600 shrink-0" />
                    <span>{q.safetyTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Safety Notice Banner */}
          <div className="p-3 bg-sage-200/40 rounded-2xl border border-sage-300/50 flex items-start gap-2 text-xs text-forest-800">
            <ShieldAlert className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
            <div className="leading-snug">{generatedAdventure.safetyNotice}</div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-sage-200/60">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerate}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Regenerate
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="sunlight"
                size="md"
                onClick={handleStartAdventure}
                icon={<Play className="w-4 h-4 fill-forest-950" />}
              >
                Start Adventure Mode
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
