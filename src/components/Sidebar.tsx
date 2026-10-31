'use client';

import React from 'react';
import {
  Home,
  Sun,
  Star,
  Infinity as InfinityIcon,
  Compass,
  BrainCircuit,
  History,
  Search,
  Plus,
  Moon,
  SlidersHorizontal,
  ChevronDown,
  Tag,
  CheckCircle2,
  FolderKanban,
  Lightbulb,
} from 'lucide-react';
import { ViewType, MemoryEntry } from '../types/memory';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  entries: MemoryEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSettings: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userName?: string;
  userEmail?: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  currentView,
  onSelectView,
  entries,
  searchQuery,
  onSearchChange,
  onOpenSettings,
  isDark,
  onToggleTheme,
  userName = 'Nicholas Benson',
  userEmail = 'nb.nicholasbenson@outlook.com',
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  // Counts
  const todayDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const myDayCount = entries.filter((e) => e.dateString === todayDateStr || e.dateString.includes('Oct 31')).length;
  const importantCount = entries.filter((e) => e.isImportant).length;
  const allCount = entries.length;

  // Tag lists
  const customCategories = [
    { id: 'decision', label: 'Decisions', icon: CheckCircle2 },
    { id: 'project', label: 'Projects', icon: FolderKanban },
    { id: 'code', label: 'To build & Code', icon: Tag },
    { id: 'reflection', label: 'Reflections & Ideas', icon: Lightbulb },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 shrink-0 glass-panel border-r border-border-subtle flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Home & App Guide Header Button */}
        <button
          type="button"
          onClick={() => {
            onSelectView('home');
            onCloseMobile();
          }}
          className={`w-full p-3.5 border-b border-border-subtle flex items-center justify-between text-left transition-colors group ${
            currentView === 'home'
              ? 'bg-primary-blue/10'
              : 'hover:bg-surface-low'
          }`}
          title="Home & App Overview"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* App Icon / Home */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform overflow-hidden ${
                currentView === 'home'
                  ? 'ring-2 ring-primary-blue shadow-sm scale-105'
                  : 'group-hover:scale-105'
              }`}
            >
              <img
                src="/mindmoments-logo.svg"
                alt="MindMoments"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h2
                className={`text-xs font-bold truncate leading-tight ${
                  currentView === 'home' ? 'text-primary-blue' : 'text-on-surface'
                }`}
              >
                MindMoments
              </h2>
              <p className="text-[10px] text-on-surface-muted truncate">
                Home &amp; App Overview
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
              currentView === 'home'
                ? 'bg-primary-blue text-white'
                : 'bg-surface-low text-on-surface-muted group-hover:text-on-surface'
            }`}
          >
            Home
          </span>
        </button>

        {/* Search Bar */}
        <div className="p-3 border-b border-border-subtle">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-low border border-border-subtle text-xs">
            <Search className="w-3.5 h-3.5 text-on-surface-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search moments..."
              className="w-full bg-transparent border-0 text-on-surface placeholder:text-on-surface-muted/60 focus:ring-0 p-0 text-xs outline-none"
            />
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto custom-scroll p-2 space-y-1">
          {/* My Day */}
          <button
            type="button"
            onClick={() => {
              onSelectView('myday');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'myday'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4 shrink-0" />
              <span>My Day</span>
            </div>
            {myDayCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                currentView === 'myday' ? 'bg-white/20 text-white' : 'text-on-surface-muted'
              }`}>
                {myDayCount}
              </span>
            )}
          </button>

          {/* Important */}
          <button
            type="button"
            onClick={() => {
              onSelectView('important');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'important'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 shrink-0" />
              <span>Important</span>
            </div>
            {importantCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                currentView === 'important' ? 'bg-white/20 text-white' : 'text-on-surface-muted'
              }`}>
                {importantCount}
              </span>
            )}
          </button>

          {/* All Moments */}
          <button
            type="button"
            onClick={() => {
              onSelectView('all');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'all'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <InfinityIcon className="w-4 h-4 shrink-0" />
              <span>All Moments</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              currentView === 'all' ? 'bg-white/20 text-white' : 'text-on-surface-muted'
            }`}>
              {allCount}
            </span>
          </button>

          {/* Separator */}
          <div className="my-2 border-t border-border-subtle" />

          {/* Intelligence Modules */}
          <div className="px-3 py-1 text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">
            Gemma Intelligence
          </div>

          {/* Occurrence Forecast */}
          <button
            type="button"
            onClick={() => {
              onSelectView('forecast');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'forecast'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Occurrence Forecast</span>
            </div>
          </button>

          {/* AI Mind Reflection */}
          <button
            type="button"
            onClick={() => {
              onSelectView('aimind');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'aimind'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-4 h-4 shrink-0" />
              <span>AI Mind (Grounded)</span>
            </div>
          </button>

          {/* Weekly Recap */}
          <button
            type="button"
            onClick={() => {
              onSelectView('recap');
              onCloseMobile();
            }}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentView === 'recap'
                ? 'bg-primary-blue text-white font-semibold shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 shrink-0" />
              <span>Weekly Retrospective</span>
            </div>
          </button>

          {/* Separator */}
          <div className="my-2 border-t border-border-subtle" />

          {/* Custom Category Tag Lists */}
          <div className="px-3 py-1 text-[10px] font-bold text-on-surface-muted uppercase tracking-wider">
            Categories
          </div>

          {customCategories.map((cat) => {
            const Icon = cat.icon;
            const count = entries.filter((e) => e.tags.includes(cat.id)).length;
            const isActive = currentView === `tag:${cat.id}`;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectView(`tag:${cat.id}`);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-blue text-white font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </div>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'text-on-surface-muted'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: Theme Toggle & Settings */}
        <div className="p-3 border-t border-border-subtle flex items-center justify-between bg-surface">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleTheme}
              className="btn-press p-2 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-low transition-colors"
              title={isDark ? 'Switch to White Mode' : 'Switch to Black Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={onOpenSettings}
              className="btn-press p-2 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-low transition-colors"
              title="Gemma Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[10px] text-on-surface-muted font-medium">
            MindMoments v2.0
          </span>
        </div>
      </aside>
    </>
  );
}

