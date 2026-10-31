import { get, set, del } from 'idb-keyval';
import { MemoryEntry, AppSettings, OccurrenceForecast, WeeklyRecap } from '../types/memory';
import { INITIAL_DEMO_MEMORIES } from './seedData';

export const IDB_KEYS = {
  MEMORIES: 'mindmoments_idb_entries',
  SETTINGS: 'mindmoments_idb_settings',
  FORECAST: 'mindmoments_idb_forecast',
  RECAP: 'mindmoments_idb_recap',
  CHAT: 'mindmoments_idb_chat',
};

// In-memory memory cache for synchronous immediate rendering
let memoryCache: MemoryEntry[] = INITIAL_DEMO_MEMORIES;
let settingsCache: AppSettings = {
  useLocalOllama: false,
  ollamaEndpoint: 'http://localhost:11434',
};

/**
 * Initializes and migrates from legacy localStorage to IndexedDB
 */
export async function initIndexedDB(): Promise<{ moments: MemoryEntry[]; settings: AppSettings }> {
  if (typeof window === 'undefined') {
    return { moments: memoryCache, settings: settingsCache };
  }

  try {
    // 1. Try reading moments from IndexedDB
    const idbMoments = await get<MemoryEntry[]>(IDB_KEYS.MEMORIES);
    if (idbMoments && Array.isArray(idbMoments) && idbMoments.length > 0) {
      memoryCache = idbMoments;
    } else {
      // Check legacy localStorage for migration
      const legacy = window.localStorage.getItem('mindmoments_entries_v2');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            memoryCache = parsed;
          }
        } catch {
          // ignore
        }
      }
      // Save to IndexedDB
      await set(IDB_KEYS.MEMORIES, memoryCache);
    }

    // 2. Try reading settings from IndexedDB
    const idbSettings = await get<AppSettings>(IDB_KEYS.SETTINGS);
    if (idbSettings) {
      settingsCache = {
        ...settingsCache,
        ...idbSettings,
      };
    } else {
      const legacySettings = window.localStorage.getItem('mindmoments_settings_v2');
      if (legacySettings) {
        try {
          const parsed = JSON.parse(legacySettings);
          settingsCache = { ...settingsCache, ...parsed };
        } catch {
          // ignore
        }
      }
      await set(IDB_KEYS.SETTINGS, settingsCache);
    }
  } catch (err) {
    console.warn('[MindMoments IndexedDB Error]:', err);
  }

  return { moments: memoryCache, settings: settingsCache };
}

/**
 * Get moments synchronously from memory cache
 */
export function getStoredMoments(): MemoryEntry[] {
  return memoryCache;
}

/**
 * Save new moment into IndexedDB and cache
 */
export function saveMoment(entry: Omit<MemoryEntry, 'id' | 'timestamp' | 'dateString' | 'timeString'>): MemoryEntry {
  const now = new Date();
  const newEntry: MemoryEntry = {
    id: `mem-${Date.now()}`,
    timestamp: now.toISOString(),
    dateString: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeString: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    content: entry.content.trim(),
    mood: entry.mood,
    tags: entry.tags,
    isImportant: entry.isImportant || false,
  };

  const updated = [newEntry, ...memoryCache];
  memoryCache = updated;

  // Persist asynchronously to IndexedDB
  if (typeof window !== 'undefined') {
    set(IDB_KEYS.MEMORIES, updated).catch((e) => console.error('[IDB Save Error]:', e));
  }

  return newEntry;
}

/**
 * Toggle important status in IndexedDB
 */
export function toggleImportant(id: string): MemoryEntry[] {
  const updated = memoryCache.map((m) =>
    m.id === id ? { ...m, isImportant: !m.isImportant } : m
  );
  memoryCache = updated;

  if (typeof window !== 'undefined') {
    set(IDB_KEYS.MEMORIES, updated).catch((e) => console.error('[IDB Toggle Error]:', e));
  }

  return updated;
}

/**
 * Delete moment from IndexedDB
 */
export function deleteMoment(id: string): MemoryEntry[] {
  const updated = memoryCache.filter((m) => m.id !== id);
  memoryCache = updated;

  if (typeof window !== 'undefined') {
    set(IDB_KEYS.MEMORIES, updated).catch((e) => console.error('[IDB Delete Error]:', e));
  }

  return updated;
}

/**
 * Update an existing moment in IndexedDB
 */
export function updateMomentInIDB(updatedEntry: MemoryEntry): MemoryEntry[] {
  const updated = memoryCache.map((m) => (m.id === updatedEntry.id ? updatedEntry : m));
  memoryCache = updated;

  if (typeof window !== 'undefined') {
    set(IDB_KEYS.MEMORIES, updated).catch((e) => console.error('[IDB Update Error]:', e));
  }

  return updated;
}

/**
 * Seed initial sample memories into IndexedDB
 */
export function seedSampleMoments(): MemoryEntry[] {
  memoryCache = INITIAL_DEMO_MEMORIES;

  if (typeof window !== 'undefined') {
    set(IDB_KEYS.MEMORIES, INITIAL_DEMO_MEMORIES).catch((e) => console.error('[IDB Seed Error]:', e));
  }

  return INITIAL_DEMO_MEMORIES;
}

/**
 * Get settings synchronously from memory cache
 */
export function getStoredSettings(): AppSettings {
  return settingsCache;
}

/**
 * Save settings to IndexedDB
 */
export function saveStoredSettings(settings: AppSettings): void {
  settingsCache = settings;
  if (typeof window !== 'undefined') {
    set(IDB_KEYS.SETTINGS, settings).catch((e) => console.error('[IDB Settings Error]:', e));
  }
}

/**
 * Forecast in IndexedDB
 */
export async function getForecastFromIDB(): Promise<OccurrenceForecast | null> {
  try {
    return (await get<OccurrenceForecast>(IDB_KEYS.FORECAST)) || null;
  } catch {
    return null;
  }
}

export function saveStoredForecast(forecast: OccurrenceForecast): void {
  if (typeof window !== 'undefined') {
    set(IDB_KEYS.FORECAST, forecast).catch((e) => console.error('[IDB Forecast Error]:', e));
  }
}

/**
 * Recap in IndexedDB
 */
export async function getRecapFromIDB(): Promise<WeeklyRecap | null> {
  try {
    return (await get<WeeklyRecap>(IDB_KEYS.RECAP)) || null;
  } catch {
    return null;
  }
}

export function saveStoredRecap(recap: WeeklyRecap): void {
  if (typeof window !== 'undefined') {
    set(IDB_KEYS.RECAP, recap).catch((e) => console.error('[IDB Recap Error]:', e));
  }
}

export function getStoredForecast(): OccurrenceForecast | null {
  return null;
}

export function getStoredRecap(): WeeklyRecap | null {
  return null;
}
