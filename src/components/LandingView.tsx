'use client';

import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Target,
  Brain,
  History,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
  Tag,
  Lock,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { ViewType } from '../types/memory';

interface LandingViewProps {
  onSelectView: (view: ViewType) => void;
  entriesCount: number;
}

export function LandingView({ onSelectView, entriesCount }: LandingViewProps) {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-16 animate-in fade-in duration-200">
      {/* 1. Hero Overview Section */}
      <section className="glass-card p-6 sm:p-10 rounded-2xl relative overflow-hidden border border-border-subtle shadow-sm space-y-6">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-low border border-border-subtle text-xs font-semibold text-primary-blue">
            <Compass className="w-3.5 h-3.5" />
            <span>Personal Cognitive Diary &amp; Memory Reflection</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            Remember every breakthrough. Understand your focus.
          </h1>

          <p className="text-sm sm:text-base text-on-surface-muted leading-relaxed">
            MindMoments is your private space to record daily thoughts, capture critical decisions,
            and understand your energy rhythms. Instead of static notes that get forgotten, MindMoments
            actively synthesizes your entries to highlight your focus patterns and peak cognitive hours.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onSelectView('myday')}
              className="btn-press btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Open My Day</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectView('aimind')}
              className="btn-press glass-card px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:border-primary-blue/50 flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary-blue" />
              <span>Ask AI Mind</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('forecast')}
              className="btn-press glass-card px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface hover:border-primary-blue/50 flex items-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-primary-blue" />
              <span>Occurrence Forecast</span>
            </button>
          </div>
        </div>

        {/* Live Status Chip */}
        <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between text-xs text-on-surface-muted gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              <strong>{entriesCount} moments</strong> currently stored locally in your private IndexedDB
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-on-surface">
            <Lock className="w-3.5 h-3.5 text-primary-blue" />
            <span>100% Offline &amp; Private</span>
          </div>
        </div>
      </section>

      {/* 2. What the App Does & How It Helps You */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            How MindMoments Works For You
          </h2>
          <p className="text-xs text-on-surface-muted">
            Designed for engineers, builders, and deep thinkers who want clarity on where their energy goes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Feature 1 */}
          <div className="glass-card p-5 rounded-2xl space-y-3 border border-border-subtle">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Capture Thoughts in Seconds</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Log architectural decisions, breakthroughs, or mental fatigue on the fly. Tag each moment with cognitive states like Focused, Breakthrough, or Uncertain.
            </p>
            <button
              type="button"
              onClick={() => onSelectView('myday')}
              className="text-xs font-semibold text-primary-blue flex items-center gap-1 hover:underline pt-1"
            >
              <span>Try logging a moment</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="glass-card p-5 rounded-2xl space-y-3 border border-border-subtle">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Anticipate Your Energy</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              The Occurrence Forecast correlates sleep and late-night work with afternoon fatigue. It alerts you when to schedule deep coding versus lighter tasks.
            </p>
            <button
              type="button"
              onClick={() => onSelectView('forecast')}
              className="text-xs font-semibold text-primary-blue flex items-center gap-1 hover:underline pt-1"
            >
              <span>View your forecast</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Feature 3 */}
          <div className="glass-card p-5 rounded-2xl space-y-3 border border-border-subtle">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Converse with Your Past</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Ask your AI Mind questions like &quot;What decisions did I make about our storage engine?&quot; or &quot;Why did I feel drained last Thursday?&quot;
            </p>
            <button
              type="button"
              onClick={() => onSelectView('aimind')}
              className="text-xs font-semibold text-primary-blue flex items-center gap-1 hover:underline pt-1"
            >
              <span>Chat with memories</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Three-Step Workflow */}
      <section className="glass-card p-6 sm:p-8 rounded-2xl border border-border-subtle space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-on-surface tracking-tight">
            Simple 3-Step Daily Routine
          </h2>
          <p className="text-xs text-on-surface-muted">
            No complex setup or rigid templates required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-surface-low border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-blue">
              <span className="w-5 h-5 rounded-full bg-primary-blue text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Quick Capture</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Drop thoughts as they happen</h4>
            <p className="text-[11px] text-on-surface-muted leading-relaxed">
              Spend 15 seconds recording when a task goes well or when you hit a road-block.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-blue">
              <span className="w-5 h-5 rounded-full bg-primary-blue text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Review Rhythm</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Check your peak focus hours</h4>
            <p className="text-[11px] text-on-surface-muted leading-relaxed">
              Protect your high-energy mornings and guard against post-lunch slump cycles.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-low border border-border-subtle space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary-blue">
              <span className="w-5 h-5 rounded-full bg-primary-blue text-white flex items-center justify-center text-[10px]">
                3
              </span>
              <span>Weekly Retrospective</span>
            </div>
            <h4 className="text-xs font-bold text-on-surface">Surface strategic progress</h4>
            <p className="text-[11px] text-on-surface-muted leading-relaxed">
              Every week, review key breakthroughs, unresolved threads, and energy shifts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Data Ownership */}
      <section className="glass-card p-6 rounded-2xl border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-surface-low text-emerald-500 flex items-center justify-center shrink-0 border border-border-subtle">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-on-surface">Your Diary Stays on Your Device</h3>
            <p className="text-xs text-on-surface-muted max-w-xl leading-relaxed">
              MindMoments stores all your logs, thoughts, and conversational reflections inside your browser&apos;s IndexedDB. No accounts to create, and your personal diary is never transmitted to any third-party marketing database.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectView('myday')}
          className="btn-press btn-primary px-4 py-2 rounded-xl text-xs font-semibold shrink-0"
        >
          Get Started
        </button>
      </section>
    </div>
  );
}
