import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    aiStatus, 
    refreshAiStatus, 
    isOnline
  } = useApp();

  const [endpointInput, setEndpointInput] = useState<string>(settings.gemmaEndpoint);
  const [modelInput, setModelInput] = useState<string>(settings.gemmaModel);
  const [isTestingAi, setIsTestingAi] = useState<boolean>(false);
  const [aiTestFeedback, setAiTestFeedback] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setIsTestingAi(true);
    setAiTestFeedback(null);
    try {
      await updateSettings({
        gemmaEndpoint: endpointInput,
        gemmaModel: modelInput
      });
      await refreshAiStatus();
      setAiTestFeedback('Connection checked.');
    } catch (err: unknown) {
      setAiTestFeedback(`Test failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsTestingAi(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sage-200/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-600 font-mono">
            System & Privacy
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
          <span className="text-xs text-forest-700">Open Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-forest-900 tracking-tight">
          Settings & Local AI
        </h1>
        <p className="text-sm text-forest-700/90 mt-0.5">
          Configure local open-weight inference, verify offline readiness, and inspect privacy guarantees.
        </p>
      </div>

      {/* 1. Local AI Gemma Configuration */}
      <Card variant="default" className="p-6 sm:p-7 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6 text-forest-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-forest-900">
                Google Gemma Local AI Setup
              </h2>
              <p className="text-xs text-forest-700">
                Run true open-weight LLM inference locally on your device with no API costs or tracking.
              </p>
            </div>
          </div>

          <Badge variant={aiStatus.isAvailable ? 'forest' : 'sage'} size="md">
            {aiStatus.isAvailable ? 'Gemma Connected' : 'Rule-Based Fallback'}
          </Badge>
        </div>

        {/* Current status info */}
        <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
          aiStatus.isAvailable 
            ? 'bg-forest-50/80 border-forest-200 text-forest-800'
            : 'bg-sage-100/70 border-sage-200 text-forest-800'
        }`}>
          <div className="flex items-center justify-between font-semibold">
            <span>Runtime: {aiStatus.runtime.toUpperCase()}</span>
            <span>Latency: {aiStatus.latencyMs ?? 0}ms</span>
          </div>
          {aiStatus.errorMessage && (
            <div className="text-forest-700 bg-ivory-100/70 p-2.5 rounded-xl border border-sage-200 font-mono text-[11px] leading-relaxed">
              {aiStatus.errorMessage}
            </div>
          )}
          {aiStatus.detectedModels.length > 0 && (
            <div className="text-[11px]">
              Detected local models: <span className="font-mono font-bold">{aiStatus.detectedModels.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Endpoint and model inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1.5 font-mono">
              Ollama Endpoint URL
            </label>
            <input
              type="text"
              value={endpointInput}
              onChange={e => setEndpointInput(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-sage-200 bg-ivory-100/80 text-xs sm:text-sm font-mono text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-1.5 font-mono">
              Gemma Model Tag
            </label>
            <input
              type="text"
              value={modelInput}
              onChange={e => setModelInput(e.target.value)}
              placeholder="gemma2:2b"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-sage-200 bg-ivory-100/80 text-xs sm:text-sm font-mono text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {aiTestFeedback && (
            <span className="text-xs text-forest-700 italic">
              {aiTestFeedback}
            </span>
          )}
          <div className="ml-auto">
            <Button
              variant="primary"
              size="sm"
              onClick={handleTestConnection}
              isLoading={isTestingAi}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Test Connection
            </Button>
          </div>
        </div>

        {/* Step-by-Step Setup Guide */}
        <div className="pt-4 border-t border-sage-200/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800 font-mono">
            How to run Gemma locally on your computer
          </h3>

          <div className="space-y-2 text-xs text-forest-700">
            <p>1. Install Ollama from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="underline font-semibold text-forest-800">ollama.com</a>.</p>
            
            <p>2. In your terminal, pull and run Google's Gemma 2B model:</p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-900 text-ivory-50 font-mono text-xs">
              <code>ollama run gemma2:2b</code>
              <button
                onClick={() => copyToClipboard('ollama run gemma2:2b', 'pull')}
                className="p-1 hover:text-sunlight-400"
                title="Copy command"
              >
                {copiedCmd === 'pull' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p>3. If accessing from your phone over the local WiFi network, launch Ollama with CORS permissions:</p>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest-900 text-ivory-50 font-mono text-xs">
              <code>OLLAMA_ORIGINS="*" ollama serve</code>
              <button
                onClick={() => copyToClipboard('OLLAMA_ORIGINS="*" ollama serve', 'serve')}
                className="p-1 hover:text-sunlight-400"
                title="Copy command"
              >
                {copiedCmd === 'serve' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-[11px] text-forest-600 italic">
              <strong>Hardware note:</strong> Gemma 2B needs ~2.5 GB of RAM/VRAM. Gemma 9B requires ~8 GB of RAM. Most modern laptops and workstations run Gemma 2B effortlessly.
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Accessibility Options */}
      <Card variant="default" className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-forest-900">
              Display & Accessibility
            </h2>
            <p className="text-xs text-forest-700">
              Adapt the user interface for comfort and sensory preferences.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-sage-200 bg-ivory-100/60 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-forest-900">Reduced Motion</div>
              <div className="text-xs text-forest-600">Disables micro-animations, transitions, and pulsing indicators.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={e => updateSettings({ reducedMotion: e.target.checked })}
              className="w-5 h-5 accent-forest-700 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-2xl border border-sage-200 bg-ivory-100/60 cursor-pointer">
            <div>
              <div className="text-sm font-semibold text-forest-900">High Contrast Mode</div>
              <div className="text-xs text-forest-600">Heightens text borders and color contrast for bright outdoor sunlight.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={e => updateSettings({ highContrast: e.target.checked })}
              className="w-5 h-5 accent-forest-700 rounded cursor-pointer"
            />
          </label>
        </div>
      </Card>

      {/* 3. Privacy & Offline PWA Status */}
      <Card variant="default" className="p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-forest-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-forest-900">
              100% On-Device Privacy Promise
            </h2>
            <p className="text-xs text-forest-700">
              No remote servers, no user accounts, no analytics tracking your locations.
            </p>
          </div>
        </div>

        <div className="text-xs text-forest-700 space-y-2 leading-relaxed">
          <p>
            • <strong>No Location or GPS Spying:</strong> WildQuest never asks for GPS access. You choose your environment type manually.
          </p>
          <p>
            • <strong>Local Nature Journal:</strong> Your notes and photographs are stored only inside your browser’s IndexedDB database. They never upload to a cloud server.
          </p>
          <p>
            • <strong>True Offline PWA:</strong> Application static assets and cached schemas are managed by a service worker. You can explore deep in the woods completely offline.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-forest-600 border-t border-sage-200/60">
          <span>Network Connection: {isOnline ? 'Online' : 'Offline'}</span>
          <span>Storage Engine: IndexedDB</span>
        </div>
      </Card>

      {/* 4. Model Attribution & Software Licenses */}
      <Card variant="default" className="p-6 sm:p-7 space-y-4">
        <h2 className="text-lg font-bold font-display text-forest-900">
          Licensing & Model Attribution
        </h2>
        <div className="text-xs text-forest-700 space-y-2 leading-relaxed">
          <p>
            <strong>Application Code:</strong> WildQuest AI is free and open-source software released under the <span className="font-semibold text-forest-900">Apache 2.0 License</span>.
          </p>
          <p>
            <strong>Core AI Model:</strong> Generative quests are powered by <span className="font-semibold text-forest-900">Google Gemma</span>, an open-weight family of models built by Google DeepMind. Gemma weights are governed by the separate <a href="https://ai.google.dev/gemma/terms" target="_blank" rel="noreferrer" className="underline text-forest-800">Gemma Terms of Use</a>.
          </p>
        </div>
      </Card>
    </div>
  );
};
