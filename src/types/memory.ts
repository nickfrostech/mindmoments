export type MoodType = 'focused' | 'fatigued' | 'breakthrough' | 'uncertain';

export interface MoodConfig {
  id: MoodType;
  label: string;
  iconName: 'target' | 'moon' | 'zap' | 'help-circle';
  badgeClass: string;
  borderClass: string;
  bgClass: string;
}

export const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  focused: {
    id: 'focused',
    label: 'Focused',
    iconName: 'target',
    badgeClass: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
    borderClass: 'border-blue-500/30',
    bgClass: 'bg-blue-500/10',
  },
  fatigued: {
    id: 'fatigued',
    label: 'Fatigued',
    iconName: 'moon',
    badgeClass: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10',
  },
  breakthrough: {
    id: 'breakthrough',
    label: 'Breakthrough',
    iconName: 'zap',
    badgeClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10',
  },
  uncertain: {
    id: 'uncertain',
    label: 'Uncertain',
    iconName: 'help-circle',
    badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/20',
    borderClass: 'border-slate-500/30',
    bgClass: 'bg-slate-500/10',
  },
};

export interface MemoryEntry {
  id: string;
  timestamp: string; // ISO 8601 string
  dateString: string; // e.g. "Oct 31, 2026"
  timeString: string; // e.g. "9:42 AM"
  content: string;
  mood: MoodType;
  tags: string[];
  isImportant?: boolean;
}

export interface CitedMoment {
  id: string;
  date: string;
  snippet: string;
  tags: string[];
  mood: MoodType;
}

export interface AIInsight {
  id: string;
  query: string;
  answer: string;
  citedMoments: CitedMoment[];
  observedFacts: string[];
  possibleInterpretation: string;
  createdAt: string;
}

export interface OccurrenceForecast {
  date: string;
  peakFocusWindow: string;
  patternAlert: string;
  morningScore: number;
  afternoonScore: number;
  eveningScore: number;
  suggestedAction: string;
  basedOnEntriesCount: number;
}

export interface WeeklyRecap {
  period: string;
  keyDecisions: string[];
  breakthroughs: string[];
  energyRhythmAnalysis: string;
  unresolvedThreads: string[];
  totalEntriesCount: number;
}

export interface AppSettings {
  groqApiKey?: string;
  geminiApiKey?: string;
  useLocalOllama?: boolean;
  ollamaEndpoint?: string;
  userName?: string;
  userEmail?: string;
  theme?: 'light' | 'dark';
}

export type ViewType =
  | 'myday'
  | 'important'
  | 'all'
  | 'forecast'
  | 'aimind'
  | 'recap'
  | string; // for custom tag/list views

export type ActiveTab = 'timeline' | 'forecast' | 'aimind' | 'recap';
