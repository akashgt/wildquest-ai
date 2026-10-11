export type DifficultyLevel = 'easy' | 'explorer' | 'advanced';

export type EnvironmentType = 
  | 'garden' 
  | 'urban' 
  | 'park' 
  | 'forest' 
  | 'waterfront';

export type InterestType = 
  | 'birds' 
  | 'wildlife' 
  | 'plants' 
  | 'flowers' 
  | 'trees' 
  | 'photography' 
  | 'mindfulness' 
  | 'patterns' 
  | 'seasonal';

export interface UserPreferences {
  interests: InterestType[];
  durationMinutes: number; // 5, 10, 20, 30, 60
  difficulty: DifficultyLevel;
  environment: EnvironmentType;
  accessible: boolean;
  quiet: boolean;
  familyFriendly: boolean;
  noPhotography: boolean;
}

export interface Quest {
  id: string;
  title: string;
  instruction: string;
  estimatedMinutes: number;
  category: string;
  reflectionPrompt?: string;
  safetyTip?: string;
}

export interface Adventure {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  environment: EnvironmentType;
  quests: Quest[];
  reflectionPrompt: string;
  safetyNotice: string;
  generatedBy: 'gemma' | 'rule-based' | 'mock';
  modelIdentifier?: string;
  createdAt: string;
}

export interface AIProviderStatus {
  isAvailable: boolean;
  runtime: 'ollama' | 'rule-based' | 'unavailable';
  modelName: string;
  detectedModels: string[];
  endpoint: string;
  latencyMs?: number;
  errorMessage?: string;
  lastChecked: string;
}

export interface GenerationResult {
  adventure: Adventure;
  providerUsed: 'gemma' | 'rule-based' | 'mock';
  modelName: string;
  durationMs: number;
  fallbackTriggered: boolean;
  fallbackReason?: string;
}

export interface IAIProvider {
  name: string;
  checkStatus(): Promise<AIProviderStatus>;
  generateAdventure(preferences: UserPreferences): Promise<Adventure>;
}
