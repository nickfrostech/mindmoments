'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Sun,
  Moon,
  BookOpen,
  Compass,
  BrainCircuit,
  History,
} from 'lucide-react';
import { ActiveTab } from '../types/memory';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onSeedDemo: () => void;
  onOpenSettings: () => void;
  isSeeding?: boolean;
}

export function Header({
  activeTab,
  onSelectTab,
  onSeedDemo,
  onOpenSettings,
  isSeeding = false,
}: HeaderProps) {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('mindmoments_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mindmoments_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mindmoments_theme', 'light');
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const desktopTabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'forecast', label: 'Occurrence Forecast', icon: Compass },
    { id: 'aimind', label: 'AI Mind', icon: BrainCircuit },
    { id: 'recap', label: 'Weekly Recap', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-cyan/15 dark:bg-primary-cyan/20 border border-primary-cyan/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-cyan" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-on-surface leading-none">
                MindMoments
              </h1>
              <span className="text-[10px] uppercase font-semibold text-primary-cyan px-1.5 py-0.2 bg-primary-cyan/10 rounded border border-primary-cyan/20">
                Gemma 2
              </span>
            </div>
            <span className="text-[11px] text-on-surface-muted hidden sm:inline-block">
              {todayFormatted} • Memory-Grounded Reflection
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-low p-1 rounded-xl border border-border-subtle">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`btn-press flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-surface text-primary-cyan shadow-sm font-semibold border border-border-subtle'
                    : 'text-on-surface-muted hover:text-on-surface hover:bg-surface/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-press p-2 rounded-lg border border-border-subtle bg-surface hover:bg-surface-low text-on-surface-muted hover:text-on-surface transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Seed Demo Button */}
          <button
            onClick={onSeedDemo}
            disabled={isSeeding}
            type="button"
            className="btn-press px-3 py-1.5 rounded-lg border border-primary-cyan/30 bg-primary-cyan/10 hover:bg-primary-cyan/20 text-primary-cyan text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Inject 14 days of realistic life memories"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSeeding ? 'Seeding...' : 'Seed Demo Life'}</span>
            <span className="sm:hidden">{isSeeding ? '...' : 'Seed'}</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            type="button"
            className="btn-press p-2 rounded-lg border border-border-subtle bg-surface hover:bg-surface-low text-on-surface-muted hover:text-on-surface transition-colors"
            title="Configure Gemma API Key & Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
