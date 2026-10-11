import React, { useState } from 'react';
import { 
  Bird, 
  Trees, 
  Flower2, 
  Camera, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Accessibility,
  Volume2,
  Users,
  EyeOff,
  Compass,
  Footprints,
  Eye,
  GraduationCap
} from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';
import type { InterestType, DifficultyLevel, EnvironmentType, UserPreferences } from '../../services/ai/types';

export const OnboardingWizard: React.FC = () => {
  const { preferences, updateSettings, setCurrentView } = useApp();
  const [step, setStep] = useState<number>(1); // 1: Interests, 2: Environment & Time, 3: Difficulty & Options

  const [selectedInterests, setSelectedInterests] = useState<InterestType[]>(preferences.interests);
  const [selectedDuration, setSelectedDuration] = useState<number>(preferences.durationMinutes);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(preferences.difficulty);
  const [selectedEnvironment, setSelectedEnvironment] = useState<EnvironmentType>(preferences.environment);
  const [accessible, setAccessible] = useState<boolean>(preferences.accessible);
  const [quiet, setQuiet] = useState<boolean>(preferences.quiet);
  const [familyFriendly, setFamilyFriendly] = useState<boolean>(preferences.familyFriendly);
  const [noPhotography, setNoPhotography] = useState<boolean>(preferences.noPhotography);

  const interestOptions: Array<{ id: InterestType; label: string; icon: React.ReactNode }> = [
    { id: 'birds', label: 'Birds & Songs', icon: <Bird className="w-4 h-4" /> },
    { id: 'wildlife', label: 'Wildlife & Insects', icon: <Footprints className="w-4 h-4" /> },
    { id: 'plants', label: 'Wild Plants', icon: <Trees className="w-4 h-4" /> },
    { id: 'flowers', label: 'Wildflowers', icon: <Flower2 className="w-4 h-4" /> },
    { id: 'trees', label: 'Trees & Canopy', icon: <Trees className="w-4 h-4" /> },
    { id: 'photography', label: 'Nature Photography', icon: <Camera className="w-4 h-4" /> },
    { id: 'mindfulness', label: 'Mindfulness & Senses', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'patterns', label: 'Natural Patterns', icon: <Eye className="w-4 h-4" /> },
    { id: 'seasonal', label: 'Seasonal Shifts', icon: <Compass className="w-4 h-4" /> },
  ];

  const durationOptions = [5, 10, 20, 30, 60];

  const environmentOptions: Array<{ id: EnvironmentType; label: string; description: string }> = [
    { id: 'garden', label: 'Garden / Yard', description: 'Immediate outdoor backyard, patio, or courtyard' },
    { id: 'urban', label: 'Urban Neighborhood', description: 'City streets, sidewalks, planters, and pocket parks' },
    { id: 'park', label: 'City or County Park', description: 'Mowed lawns, mature trees, and walking paths' },
    { id: 'forest', label: 'Forest Trail', description: 'Wooded trail, unpaved nature paths, and deep canopies' },
    { id: 'waterfront', label: 'Waterfront / Shore', description: 'Rivers, lakes, beaches, or retention ponds' },
  ];

  const difficultyOptions: Array<{ id: DifficultyLevel; label: string; description: string; icon: React.ReactNode }> = [
    { id: 'easy', label: 'Easy', description: 'Gentle, casual noticing without strenuous requirements', icon: <Footprints className="w-4 h-4" /> },
    { id: 'explorer', label: 'Curious Explorer', description: 'Moderate sensory quests searching for subtler patterns', icon: <Eye className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced Observer', description: 'Deep naturalist focus, detailed bark/feather/leaf study', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  const toggleInterest = (id: InterestType) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleFinishOnboarding = async () => {
    const updatedPref: UserPreferences = {
      interests: selectedInterests.length > 0 ? selectedInterests : ['plants', 'mindfulness'],
      durationMinutes: selectedDuration,
      difficulty: selectedDifficulty,
      environment: selectedEnvironment,
      accessible,
      quiet,
      familyFriendly,
      noPhotography
    };

    await updateSettings({
      preferences: updatedPref,
      hasCompletedOnboarding: true
    });

    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : setCurrentView('landing')}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sage-200 hover:text-ivory-50 transition-colors bg-forest-900/60 px-3 py-1.5 rounded-xl border border-forest-700/60 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 text-sunlight-400" />
            <span>{step === 1 ? 'Back to Intro' : 'Previous Step'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step 
                    ? 'w-8 bg-sunlight-400' 
                    : i < step 
                    ? 'w-2 bg-sage-400' 
                    : 'w-2 bg-forest-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <Card variant="default" className="p-6 sm:p-8 animate-in fade-in duration-200">
            <Badge variant="sunlight" size="sm" className="mb-3">Step 1 of 3</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-forest-900 mb-2">
              What sparks your curiosity outdoors?
            </h2>
            <p className="text-sm text-forest-700 mb-6">
              Pick one or more natural elements you enjoy noticing. We'll tailor your quests accordingly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {interestOptions.map(opt => {
                const isSelected = selectedInterests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleInterest(opt.id)}
                    className={`flex items-center gap-2.5 p-3.5 rounded-2xl border text-sm font-medium transition-all text-left ${
                      isSelected
                        ? 'bg-forest-700 text-ivory-50 border-forest-800 shadow-soft-sm'
                        : 'bg-ivory-100/80 text-forest-850 border-sage-200 hover:border-forest-600/50 hover:bg-sage-100/50'
                    }`}
                  >
                    <span className={`p-1.5 rounded-xl ${isSelected ? 'bg-forest-800 text-sunlight-400' : 'bg-sage-200/60 text-forest-700'}`}>
                      {opt.icon}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                disabled={selectedInterests.length === 0}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Environment & Duration */}
        {step === 2 && (
          <Card variant="default" className="p-6 sm:p-8 animate-in fade-in duration-200">
            <Badge variant="sunlight" size="sm" className="mb-3">Step 2 of 3</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-forest-900 mb-2">
              Where & for how long will you explore?
            </h2>
            <p className="text-sm text-forest-700 mb-6">
              No GPS required. Tell us your current surroundings and available time.
            </p>

            {/* Environment selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
                Your Immediate Surroundings
              </label>
              <div className="space-y-2.5">
                {environmentOptions.map(env => {
                  const isSelected = selectedEnvironment === env.id;
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => setSelectedEnvironment(env.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-forest-700 text-ivory-50 border-forest-800 shadow-soft-sm'
                          : 'bg-ivory-100/80 text-forest-900 border-sage-200 hover:border-forest-600/50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm">{env.label}</div>
                        <div className={`text-xs ${isSelected ? 'text-sage-200' : 'text-forest-600'}`}>
                          {env.description}
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-sunlight-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration selection */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
                Available Time (Minutes)
              </label>
              <div className="grid grid-cols-5 gap-2">
                {durationOptions.map(dur => {
                  const isSelected = selectedDuration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-3 px-2 rounded-2xl border text-center font-display font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-forest-700 text-sunlight-300 border-forest-800 shadow-soft-sm'
                          : 'bg-ivory-100 text-forest-850 border-sage-200 hover:border-forest-600/50'
                      }`}
                    >
                      {dur}m
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(3)}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Difficulty & Accessibility Preferences */}
        {step === 3 && (
          <Card variant="default" className="p-6 sm:p-8 animate-in fade-in duration-200">
            <Badge variant="sunlight" size="sm" className="mb-3">Step 3 of 3</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-forest-900 mb-2">
              Difficulty & Accessibility
            </h2>
            <p className="text-sm text-forest-700 mb-6">
              Tailor the intensity and physical accessibility of your quests.
            </p>

            {/* Difficulty choices */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
                Observation Intensity
              </label>
              <div className="space-y-2.5">
                {difficultyOptions.map(diff => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-forest-700 text-ivory-50 border-forest-800 shadow-soft-sm'
                          : 'bg-ivory-100/80 text-forest-900 border-sage-200 hover:border-forest-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-xl ${isSelected ? 'bg-forest-800 text-sunlight-400' : 'bg-sage-200 text-forest-700'}`}>
                          {diff.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-sm">{diff.label}</div>
                          <div className={`text-xs ${isSelected ? 'text-sage-200' : 'text-forest-600'}`}>
                            {diff.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-sunlight-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional preferences checkboxes */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-forest-800 mb-3">
                Optional Considerations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-sage-200 bg-ivory-100/50 cursor-pointer hover:bg-sage-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={accessible}
                    onChange={e => setAccessible(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500 accent-forest-700"
                  />
                  <div className="text-xs font-medium text-forest-850 flex items-center gap-1.5">
                    <Accessibility className="w-3.5 h-3.5 text-forest-600" />
                    Accessible / Flat Paths
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-sage-200 bg-ivory-100/50 cursor-pointer hover:bg-sage-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiet}
                    onChange={e => setQuiet(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500 accent-forest-700"
                  />
                  <div className="text-xs font-medium text-forest-850 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-forest-600" />
                    Quiet / Contemplative
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-sage-200 bg-ivory-100/50 cursor-pointer hover:bg-sage-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={familyFriendly}
                    onChange={e => setFamilyFriendly(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500 accent-forest-700"
                  />
                  <div className="text-xs font-medium text-forest-850 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-forest-600" />
                    Family-Friendly
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-sage-200 bg-ivory-100/50 cursor-pointer hover:bg-sage-100/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={noPhotography}
                    onChange={e => setNoPhotography(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 focus:ring-forest-500 accent-forest-700"
                  />
                  <div className="text-xs font-medium text-forest-850 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-forest-600" />
                    No-Photography Quests
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleFinishOnboarding}
                icon={<Check className="w-4 h-4" />}
                iconPosition="right"
              >
                Save & Start Exploring
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
