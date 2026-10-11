import React, { useState } from 'react';
import { 
  Compass, 
  WifiOff, 
  Cpu, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  Leaf
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const LandingView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);

  const pillars = [
    {
      icon: Sparkles,
      title: 'Personalized Outdoor Quests',
      description: 'AI-tailored micro-adventures matching your immediate surroundings, free time (5 to 60 mins), and interests—from bird acoustics to botanical patterns.',
      badge: 'Context-Aware'
    },
    {
      icon: WifiOff,
      title: 'Full Offline Access',
      description: 'Works seamlessly deep on the trail or in poor-signal parks. Saved quests, journal entries, and progress remain 100% functional without internet.',
      badge: 'Offline-First'
    },
    {
      icon: Cpu,
      title: 'Local Open-Weight Gemma AI',
      description: 'Powered by Google’s open-weight Gemma model via Ollama. True edge inference running locally on your hardware with no closed commercial API lock-in.',
      badge: 'Open Innovation'
    },
    {
      icon: ShieldCheck,
      title: 'Private & Distraction-Free',
      description: 'Zero account required, no GPS tracking, no ads, and no addictive notifications. Your reflections and photos never leave your device.',
      badge: 'Private by Design'
    }
  ];

  const sampleQuests = [
    { title: 'Find 3 Distinct Leaf Shapes', time: '5 min', tag: 'Botany' },
    { title: '2 Minutes of Bird Song Listening', time: '2 min', tag: 'Acoustics' },
    { title: 'Discover 5 Different Shades of Green', time: '8 min', tag: 'Observation' },
    { title: 'Notice Seasonal Shifts on a Branch', time: '5 min', tag: 'Mindfulness' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Brand Bar */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 flex items-center justify-center p-1.5 shadow-soft">
            <img src="/icons/leaf-logo.svg" alt="WildQuest emblem" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-forest-900">
              Wild<span className="text-forest-600">Quest</span>
            </span>
            <span className="ml-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full">
              AI
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHowItWorksModal(true)}
            icon={<HelpCircle className="w-4 h-4" />}
          >
            Philosophy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCurrentView('onboarding')}
          >
            Explore Now
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <Badge 
            variant="sunlight" 
            size="md" 
            icon={<Leaf className="w-3.5 h-3.5 text-forest-800" />} 
            className="mb-6 shadow-soft-sm"
          >
            Hacktoberfest 2026 · "Touch Grass" AI Challenge
          </Badge>

          {/* Required Exact Heading and Subtitle */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display text-forest-900 tracking-tight leading-[1.12] mb-6">
            Your next adventure is closer than you think.
          </h1>

          <p className="text-lg sm:text-xl text-forest-700/90 font-normal leading-relaxed max-w-2xl mb-10">
            Discover the extraordinary in the ordinary with your personal AI nature companion.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-4 shadow-soft-md"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              onClick={() => setCurrentView('onboarding')}
            >
              Start Exploring
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-4"
              icon={<Compass className="w-5 h-5" />}
              onClick={() => setShowHowItWorksModal(true)}
            >
              See How It Works
            </Button>
          </div>

          {/* Value Highlights Pill Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-forest-800/80 mb-20 bg-sage-100/70 py-3 px-6 rounded-3xl border border-sage-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
              Explore More, Scroll Less
            </span>
            <span className="text-sage-300">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
              No Account Required
            </span>
            <span className="text-sage-300">·</span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-forest-600" />
              100% Offline & Private
            </span>
          </div>
        </div>

        {/* Feature Pillars Grid */}
        <section aria-labelledby="pillars-heading" className="mb-24">
          <h2 id="pillars-heading" className="sr-only">Core Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={idx} 
                  variant="default" 
                  className="p-7 hover:border-forest-600/40 hover:shadow-soft-md transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center group-hover:bg-forest-700 group-hover:text-ivory-50 transition-colors shadow-soft-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="sage" size="sm">
                      {item.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold font-display text-forest-900 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-forest-700 leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Example Quests Teaser */}
        <section className="bg-forest-850 rounded-4xl p-8 sm:p-12 text-ivory-50 shadow-soft-lg mb-20 relative overflow-hidden">
          {/* Subtle background nature motif */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Leaf className="w-96 h-96 text-ivory-50" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <Badge variant="sunlight" size="sm" className="mb-4">
              Real Observation Quests
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-4 text-ivory-50">
              Not another chatbot. An invitation to look up.
            </h2>
            <p className="text-sage-200 text-base leading-relaxed mb-8">
              Instead of keeping your eyes glued to screens, WildQuest generates a gentle, full-screen prompt, then asks you to put your phone in your pocket and pay attention to the trees, sky, wind, and soil.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {sampleQuests.map((q, idx) => (
                <div 
                  key={idx} 
                  className="bg-forest-800/80 border border-forest-700/60 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-forest-700 flex items-center justify-center text-sunlight-400 shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ivory-100">{q.title}</div>
                      <div className="text-[11px] text-sage-300">{q.tag}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-sunlight-400 shrink-0 ml-2">
                    {q.time}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="sunlight"
              size="md"
              onClick={() => setCurrentView('onboarding')}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Create Your First Quest
            </Button>
          </div>
        </section>
      </main>

      {/* How it works modal */}
      <Modal
        isOpen={showHowItWorksModal}
        onClose={() => setShowHowItWorksModal(false)}
        title="How WildQuest AI Works"
        maxWidth="lg"
      >
        <div className="space-y-6 text-forest-850 text-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              1
            </div>
            <div>
              <h4 className="font-bold text-base text-forest-900 mb-1">Set Your Outdoor Context</h4>
              <p className="text-forest-700 leading-relaxed">
                Choose your environment (garden, park, urban sidewalk, or trail) and your time window (5 to 60 minutes). No GPS permission needed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              2
            </div>
            <div>
              <h4 className="font-bold text-base text-forest-900 mb-1">Local Gemma AI Generates Your Adventure</h4>
              <p className="text-forest-700 leading-relaxed">
                Google’s Gemma 2B model crafts a structured outdoor adventure with sensory quests. If the local runtime is offline, our built-in naturalist engine instantly provides reliable quests.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              3
            </div>
            <div>
              <h4 className="font-bold text-base text-forest-900 mb-1">Lock Your Phone and Explore</h4>
              <p className="text-forest-700 leading-relaxed">
                Adventure Mode presents one quest at a time in large, readable type. We actively instruct you to pocket your phone and observe nature with your own eyes and ears.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 font-bold font-display text-lg">
              4
            </div>
            <div>
              <h4 className="font-bold text-base text-forest-900 mb-1">Reflect in Your Private Journal</h4>
              <p className="text-forest-700 leading-relaxed">
                When you finish, jot down a short note or save an optional photo. Everything stays encrypted and stored right inside your browser's IndexedDB.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-sage-200 flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowHowItWorksModal(false);
                setCurrentView('onboarding');
              }}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
