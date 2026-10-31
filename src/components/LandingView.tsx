'use client';

import React from 'react';
import {
  Compass,
  ArrowRight,
  MessageSquare,
  Zap,
  Brain,
  Lock,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ViewType } from '../types/memory';

interface LandingViewProps {
  onSelectView: (view: ViewType) => void;
  entriesCount: number;
}

export function LandingView({ onSelectView, entriesCount }: LandingViewProps) {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-14 py-4 sm:py-8 pb-16 animate-in fade-in duration-200">
      {/* 1. Proper Hero Section (Spacious on-canvas, NO enclosing card) */}
      <section className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Bold Headline & Action Triggers */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-surface-low border border-border-subtle text-xs font-medium text-on-surface">
            <img src="/mindmoments-logo.svg" alt="MindMoments" className="w-4 h-4 rounded-md" />
            <span className="font-semibold text-primary-blue">MindMoments</span>
            <span className="text-on-surface-muted">•</span>
            <span className="text-on-surface-muted">Cognitive Diary &amp; Reflection</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-on-surface tracking-tight leading-[1.14]">
              Capture your moments. Understand your focus.
            </h1>
            <p className="text-sm sm:text-base text-on-surface-muted leading-relaxed max-w-xl">
              A private, distraction-free space to record daily thoughts, track energy shifts,
              and uncover patterns in your decisions. No noise, no endless forms—just pure cognitive clarity.
            </p>
          </div>

          {/* Primary & Secondary Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onSelectView('myday')}
              className="btn-press btn-primary px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <span>Start with My Day</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onSelectView('aimind')}
              className="btn-press px-4 py-3 rounded-xl text-sm font-medium text-on-surface bg-surface-low hover:bg-surface-low/80 border border-border-subtle flex items-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary-blue" />
              <span>Ask AI Mind</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('forecast')}
              className="btn-press px-4 py-3 rounded-xl text-sm font-medium text-on-surface hover:text-primary-blue transition-colors flex items-center gap-1.5"
            >
              <span>Explore Forecast</span>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          </div>

          {/* Privacy & Storage Footnote */}
          <div className="flex items-center gap-4 text-xs text-on-surface-muted pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{entriesCount} moments in local IndexedDB</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary-blue" />
              <span>100% Private to your device</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Product Demonstration Snippet */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* Simulated Active Diary Entry */}
          <div className="glass-card p-4 rounded-2xl border border-border-subtle shadow-md space-y-2.5">
            <div className="flex items-center justify-between text-xs text-on-surface-muted">
              <span className="font-semibold text-primary-blue flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-blue animate-pulse" />
                Live Reflection Sample
              </span>
              <span>Today, 10:15 AM</span>
            </div>
            <p className="text-sm font-medium text-on-surface leading-snug">
              &quot;Protected an uninterrupted morning block with no phone notifications. Finished our monthly budget and felt completely at ease.&quot;
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                Breakthrough
              </span>
              <span className="text-on-surface-muted">#life #decision</span>
            </div>
          </div>

          {/* Simulated Forecast Micro-Metric */}
          <div className="p-3.5 rounded-2xl bg-surface-low border border-border-subtle flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary-blue/10 text-primary-blue flex items-center justify-center font-bold text-xs">
                94%
              </div>
              <div>
                <p className="font-semibold text-on-surface text-xs leading-none">Peak Focus Anticipated</p>
                <p className="text-[11px] text-on-surface-muted mt-0.5">Optimal for creative projects &amp; planning</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-primary-blue">9:00 – 11:30 AM</span>
          </div>
        </div>
      </section>

      {/* 2. Core Capabilities: Flat Clean 3-Column Layout (NO heavy box wrapping) */}
      <section className="space-y-6 pt-6 border-t border-border-subtle">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-bold text-on-surface tracking-tight">
            Designed for how your brain actually works
          </h2>
          <p className="text-xs text-on-surface-muted">
            Three simple ways MindMoments helps you protect your focus and decisions every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">1. Capture in Seconds</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Don&apos;t let breakthroughs slip away. Log thoughts, decisions, or burnout signals in under 15 seconds with 1-click mood tags.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">2. Anticipate Energy Rhythms</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Spot afternoon fatigue before it hits. Occurrence Forecast tracks your energy cycles so you can schedule deep work during peak windows.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-surface-low text-primary-blue flex items-center justify-center border border-border-subtle">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-on-surface">3. Conversational Reflection</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Ask your AI Mind about past decisions, fatigue triggers, or breakthrough patterns. Every answer is grounded directly in your recorded diary.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Bottom Direct Action Banner */}
      <section className="p-6 sm:p-8 rounded-2xl bg-surface-low border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-on-surface">
            Ready to log your first moment?
          </h3>
          <p className="text-xs text-on-surface-muted max-w-lg leading-relaxed">
            Start with My Day, view your personalized forecast, or seed demo data to see the timeline in action.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onSelectView('myday')}
            className="btn-press btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Open My Day
          </button>
          <button
            type="button"
            onClick={() => onSelectView('forecast')}
            className="btn-press px-4 py-2 rounded-xl text-xs font-medium text-on-surface hover:bg-surface-card transition-colors border border-border-subtle"
          >
            View Forecast
          </button>
        </div>
      </section>
    </div>
  );
}
