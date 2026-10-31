'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  Lightbulb,
  Star,
  Trash2,
  ChevronRight,
  BrainCircuit,
  Sparkles,
} from 'lucide-react';
import { WomanYoga, EmptyMessage } from '@esvigy/react';
import { toast } from 'sonner';

import { Sidebar } from '../components/Sidebar';
import { BottomInputBar } from '../components/BottomInputBar';
import { MoodIcon } from '../components/MoodIcon';
import { OccurrenceForecastCard } from '../components/OccurrenceForecastCard';
import { AIMindChat } from '../components/AIMindChat';
import { WeeklyRecapCard } from '../components/WeeklyRecapCard';
import { SettingsModal } from '../components/SettingsModal';
import { MomentDetailDrawer } from '../components/MomentDetailDrawer';

import {
  ViewType,
  MemoryEntry,
  MoodType,
  AppSettings,
  MOOD_CONFIGS,
} from '../types/memory';
import {
  getStoredMoments,
  saveMoment,
  deleteMoment,
  toggleImportant,
  seedSampleMoments,
  getStoredSettings,
  saveStoredSettings,
  initIndexedDB,
  updateMomentInIDB,
} from '../lib/storage';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>('myday');
  const [moments, setMoments] = useState<MemoryEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ useLocalOllama: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoment, setSelectedMoment] = useState<MemoryEntry | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [todayStr, setTodayStr] = useState('Oct 31, 2026');
  const [todayFormatted, setTodayFormatted] = useState('Saturday, 31 October');

  // Load IndexedDB storage & detect theme on mount
  useEffect(() => {
    const now = new Date();
    setTodayStr(
      now.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );
    try {
      setTodayFormatted(format(now, 'EEEE, d MMMM'));
    } catch {
      // fallback
    }

    initIndexedDB().then(({ moments: idbMoments, settings: idbSettings }) => {
      setMoments(idbMoments);
      setSettings(idbSettings);

      const themeChoice = idbSettings.theme || localStorage.getItem('mindmoments_theme') || 'dark';
      if (themeChoice === 'light') {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    });

    setIsMounted(true);
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeStr = nextDark ? 'dark' : 'light';
    if (nextDark) {
      document.documentElement.classList.add('dark');
      toast.info('Switched to Dark mode (Black & Blue)');
    } else {
      document.documentElement.classList.remove('dark');
      toast.info('Switched to Clean White mode');
    }
    localStorage.setItem('mindmoments_theme', themeStr);
    const updatedSettings = { ...settings, theme: themeStr as 'light' | 'dark' };
    setSettings(updatedSettings);
    saveStoredSettings(updatedSettings);
  };

  const handleSaveMoment = (content: string, mood: MoodType, tags: string[]) => {
    const created = saveMoment({ content, mood, tags });
    setMoments((prev) => [created, ...prev]);
  };

  const handleDeleteMoment = (id: string) => {
    const updated = deleteMoment(id);
    setMoments(updated);
    if (selectedMoment?.id === id) {
      setSelectedMoment(null);
    }
  };

  const handleToggleImportant = (id: string) => {
    const updated = toggleImportant(id);
    setMoments(updated);
    if (selectedMoment?.id === id) {
      const target = updated.find((m) => m.id === id);
      if (target) setSelectedMoment(target);
    }
  };

  const handleUpdateMoment = (updatedEntry: MemoryEntry) => {
    const nextList = updateMomentInIDB(updatedEntry);
    setMoments(nextList);
    setSelectedMoment(updatedEntry);
  };

  const handleSeedDemo = () => {
    const seeded = seedSampleMoments();
    setMoments(seeded);
    toast.success('Seeded 14-day sample life diary');
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    saveStoredSettings(newSettings);
    setSettings(newSettings);
    toast.success('Settings updated');
  };

  // Filter moments according to currentView and searchQuery
  const filteredMoments = useMemo(() => {
    let result = moments;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          m.dateString.toLowerCase().includes(q)
      );
    }

    // View filter
    if (currentView === 'myday') {
      return result.filter(
        (m) => m.dateString === todayStr || m.dateString.includes('Oct 31')
      );
    }

    if (currentView === 'important') {
      return result.filter((m) => m.isImportant);
    }

    if (currentView === 'all') {
      return result;
    }

    if (currentView.startsWith('tag:')) {
      const tagId = currentView.replace('tag:', '');
      return result.filter((m) => m.tags.includes(tagId));
    }

    return result;
  }, [moments, currentView, searchQuery, todayStr]);

  // Dynamic header text & subtitle
  const headerMeta = useMemo(() => {
    switch (currentView) {
      case 'myday':
        return {
          title: 'My Day',
          subtitle: todayFormatted,
          emptyTitle: 'Focus on your day',
          emptySubtitle: 'Get things done with My Day, a list that refreshes every day.',
          buttonText: 'Add moment to My Day',
        };
      case 'important':
        return {
          title: 'Important',
          subtitle: 'Starred memories and high-leverage insights',
          emptyTitle: 'No important moments yet',
          emptySubtitle: 'Star moments in your timeline to quickly surface your highest priorities.',
          buttonText: 'View All Moments',
        };
      case 'all':
        return {
          title: 'All Moments',
          subtitle: `${filteredMoments.length} logged thoughts, decisions & breakthroughs`,
          emptyTitle: 'No moments recorded',
          emptySubtitle: 'Your private diary timeline is currently empty. Start logging or seed demo data.',
          buttonText: 'Seed 14-Day Life Demo',
        };
      case 'forecast':
        return {
          title: 'Occurrence Forecast',
          subtitle: 'Gemma 2 predictive cognitive rhythm & fatigue anticipation',
          emptyTitle: '',
          emptySubtitle: '',
          buttonText: '',
        };
      case 'aimind':
        return {
          title: 'AI Mind',
          subtitle: 'Conversational reflection grounded in your memories',
          emptyTitle: '',
          emptySubtitle: '',
          buttonText: '',
        };
      case 'recap':
        return {
          title: 'Weekly Retrospective',
          subtitle: 'Longitudinal analysis of decisions, energy, and breakthroughs',
          emptyTitle: '',
          emptySubtitle: '',
          buttonText: '',
        };
      default:
        if (currentView.startsWith('tag:')) {
          const tag = currentView.replace('tag:', '');
          return {
            title: `#${tag}`,
            subtitle: `Moments categorized under ${tag}`,
            emptyTitle: `No moments tagged with #${tag}`,
            emptySubtitle: 'Add moments with this tag to organize your thoughts.',
            buttonText: `Add #${tag} moment`,
          };
        }
        return {
          title: 'MindMoments',
          subtitle: todayFormatted,
          emptyTitle: 'Focus on your day',
          emptySubtitle: 'Start logging your moments.',
          buttonText: 'Add moment',
        };
    }
  }, [currentView, filteredMoments.length, todayFormatted]);

  const isListView =
    currentView === 'myday' ||
    currentView === 'important' ||
    currentView === 'all' ||
    currentView.startsWith('tag:');

  // Active AI Provider label
  const activeModelLabel = useMemo(() => {
    if (settings.useLocalOllama) return 'Ollama (gemma2:2b)';
    if (settings.groqApiKey) return 'GPT-OSS 120B (Groq)';
    if (settings.geminiApiKey) return 'Gemma 4 31B (Google)';
    return 'Simulated Engine';
  }, [settings]);

  if (!isMounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-primary-blue text-xs font-semibold">
        Loading MindMoments...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-background text-on-surface">
      {/* 1. Left Sidebar Navigation (Microsoft To Do style with Glass effect) */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedMoment(null);
        }}
        entries={moments}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Top Header Bar (Glassy) */}
        <header className="px-6 py-4 border-b border-border-subtle flex items-center justify-between shrink-0 glass-panel">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsOpenMobileSidebar(true)}
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-on-surface md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Dynamic View Title & Localized Date */}
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight truncate">
                {headerMeta.title}
              </h1>
              <p className="text-xs text-on-surface-muted truncate">
                {headerMeta.subtitle}
              </p>
            </div>
          </div>

          {/* Right Header Action Icons & Live AI status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live AI Indicator */}
            <div
              onClick={() => setIsSettingsOpen(true)}
              className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-low border border-border-subtle text-[11px] font-medium text-on-surface hover:border-primary-blue/40 transition-colors"
              title="Click to view AI Model settings"
            >
              <span className={`w-2 h-2 rounded-full ${settings.groqApiKey || settings.geminiApiKey || settings.useLocalOllama ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden sm:inline">
                {activeModelLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSeedDemo}
              className="p-2 rounded-xl text-on-surface-muted hover:text-primary-blue hover:bg-surface-low active:scale-95 transition-all"
              title="Seed 14-Day Life Demo Data"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stage Content Area (Static overflow-hidden for AI Mind chat, scrollable for lists & cards) */}
        <div
          className={`flex-1 flex flex-col relative min-h-0 ${
            currentView === 'aimind'
              ? 'overflow-hidden p-3 sm:p-5'
              : 'overflow-y-auto custom-scroll p-4 sm:p-6 lg:p-8'
          }`}
        >
          {/* A. Occurrence Forecast View */}
          {currentView === 'forecast' && (
            <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-200">
              <OccurrenceForecastCard entries={moments} settings={settings} />
            </div>
          )}

          {/* B. AI Mind Conversational Chat View (Static window, only chat area scrolls) */}
          {currentView === 'aimind' && (
            <div className="w-full h-full flex-1 flex flex-col min-h-0 animate-in fade-in duration-200">
              <AIMindChat entries={moments} settings={settings} />
            </div>
          )}

          {/* C. Weekly Retrospective View */}
          {currentView === 'recap' && (
            <div className="max-w-4xl mx-auto w-full pb-12 animate-in fade-in duration-200">
              <WeeklyRecapCard entries={moments} settings={settings} />
            </div>
          )}

          {/* D. Moment List Views (My Day, Important, All, Tags) */}
          {isListView && (
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col pb-24">
              {filteredMoments.length === 0 ? (
                /* Esvigy Illustration Directly on Screen (Zero borders around illustration) */
                <div className="my-auto py-12 flex flex-col items-center justify-center text-center space-y-4">
                  {currentView === 'myday' ? (
                    <WomanYoga
                      color="#3B82F6"
                      secondaryColor={isDark ? '#27272A' : '#E2E8F0'}
                      className="w-56 h-56 mx-auto drop-shadow-sm"
                    />
                  ) : (
                    <EmptyMessage
                      color="#3B82F6"
                      secondaryColor={isDark ? '#27272A' : '#E2E8F0'}
                      className="w-56 h-56 mx-auto drop-shadow-sm"
                    />
                  )}

                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="text-base font-bold text-on-surface">
                      {headerMeta.emptyTitle}
                    </h3>
                    <p className="text-xs text-on-surface-muted leading-relaxed">
                      {headerMeta.emptySubtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (headerMeta.buttonText === 'Seed 14-Day Life Demo') {
                        handleSeedDemo();
                      } else if (headerMeta.buttonText === 'View All Moments') {
                        setCurrentView('all');
                      } else {
                        const input = document.querySelector('input[placeholder*="Add a moment"]') as HTMLInputElement;
                        if (input) input.focus();
                      }
                    }}
                    className="btn-press btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold shadow-sm active:scale-97"
                  >
                    {headerMeta.buttonText}
                  </button>
                </div>
              ) : (
                /* Simplified, Uncluttered, Touch-Accessible Moment Rows */
                <div className="space-y-2">
                  <AnimatePresence>
                    {filteredMoments.map((entry) => {
                      const moodConfig = MOOD_CONFIGS[entry.mood] || MOOD_CONFIGS.focused;
                      const isSelected = selectedMoment?.id === entry.id;

                      return (
                        <motion.div
                          key={entry.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.12 }}
                          onClick={() => setSelectedMoment(entry)}
                          className={`rounded-card px-4 py-3 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-surface border-primary-blue shadow-sm'
                              : 'hover:bg-surface/90'
                          }`}
                        >
                          {/* Left: State / Mood Icon */}
                          <div className="shrink-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center border ${moodConfig.badgeClass}`}
                              title={moodConfig.label}
                            >
                              <MoodIcon mood={entry.mood} className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Middle: Clean Content Text (No metadata clutter) */}
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm text-on-surface leading-snug line-clamp-2">
                              {entry.content}
                            </p>
                            {entry.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] text-on-surface-muted">
                                  #{entry.tags[0]}
                                </span>
                                {entry.tags.length > 1 && (
                                  <span className="text-[10px] text-on-surface-muted/60">
                                    +{entry.tags.length - 1}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right: Touch-Accessible Actions (Always visible, NOT hover-only!) */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Star Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleImportant(entry.id);
                                toast.success(
                                  entry.isImportant
                                    ? 'Unmarked from Important'
                                    : 'Marked as Important'
                                );
                              }}
                              className={`p-2 rounded-lg transition-transform active:scale-90 ${
                                entry.isImportant
                                  ? 'text-amber-500'
                                  : 'text-on-surface-muted/40 hover:text-on-surface-muted'
                              }`}
                              title={entry.isImportant ? 'Unmark important' : 'Mark important'}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  entry.isImportant ? 'fill-amber-500' : ''
                                }`}
                              />
                            </button>

                            {/* Touch-Friendly Delete Icon */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMoment(entry.id);
                                toast.success('Moment deleted');
                              }}
                              className="p-2 rounded-lg text-on-surface-muted/40 hover:text-red-500 active:scale-90 transition-colors"
                              title="Delete moment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <ChevronRight className="w-4 h-4 text-on-surface-muted/30 ml-0.5" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Bottom Floating Input Bar (Glassy effect) */}
        {isListView && (
          <BottomInputBar
            onSave={handleSaveMoment}
            defaultTag={currentView.startsWith('tag:') ? currentView.replace('tag:', '') : undefined}
          />
        )}
      </div>

      {/* 4. Right Interactive Detail Drawer (Glassy effect) */}
      {selectedMoment && (
        <MomentDetailDrawer
          moment={selectedMoment}
          isOpen={Boolean(selectedMoment)}
          onClose={() => setSelectedMoment(null)}
          onUpdate={handleUpdateMoment}
          onDelete={handleDeleteMoment}
          onToggleImportant={handleToggleImportant}
        />
      )}

      {/* 5. Gemma 2 Inference Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
