'use client';

import React, { useState, useEffect } from 'react';
import { History, RefreshCw, CheckCircle2, Flame, ArrowRight, Calendar, TrendingUp } from 'lucide-react';
import { MemoryEntry, WeeklyRecap, AppSettings } from '../types/memory';
import { saveStoredRecap, getRecapFromIDB, getStoredRecap } from '../lib/storage';

interface WeeklyRecapCardProps {
  entries: MemoryEntry[];
  settings: AppSettings;
}

export function WeeklyRecapCard({ entries, settings }: WeeklyRecapCardProps) {
  const [recap, setRecap] = useState<WeeklyRecap>(() => {
    const cached = getStoredRecap();
    if (cached) return cached;

    return {
      period: 'Oct 24 – Oct 31, 2026',
      keyDecisions: [
        'Established a firm 11:00 PM screen curfew to protect morning cognitive energy.',
        'Replaced heavy carb lunches with balanced meals to eliminate mid-afternoon slumps.',
        'Declined non-essential weekend commitments to safeguard rest and family time.',
      ],
      breakthroughs: [
        'Maintained 90%+ focus across morning blocks by eliminating phone notifications.',
        'Successfully replaced afternoon caffeine spikes with 20-minute outdoor walks.',
      ],
      energyRhythmAnalysis:
        'Highest cognitive clarity consistently recorded between 9:00 AM and 11:30 AM. Slumps recorded in mid-afternoons on days following late-night phone scrolling.',
      unresolvedThreads: [
        'Decide on photography workshop enrollment before Monday registration deadline.',
        'Maintain a consistent 8-hour sleep schedule across both weekdays and weekends.',
      ],
      totalEntriesCount: entries.length || 14,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getRecapFromIDB().then((cached) => {
      if (cached) setRecap(cached);
    });
  }, []);

  const handleRefreshRecap = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries,
          settings,
        }),
      });

      if (res.ok) {
        const data: WeeklyRecap = await res.json();
        setRecap(data);
        saveStoredRecap(data);
      }
    } catch (e) {
      console.error('[Recap Fetch Error]:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner Card */}
      <section className="rounded-card p-6 relative overflow-hidden transition-all shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <History className="w-5 h-5 text-primary-blue" />
              <h2 className="text-base font-bold text-on-surface">Weekly Retrospective</h2>
              <span className="text-[10px] uppercase font-semibold text-primary-blue px-2.5 py-0.5 rounded-full bg-primary-blue/10 border border-primary-blue/20">
                Gemma 2 Synthesis
              </span>
            </div>
            <p className="text-xs text-on-surface-muted leading-relaxed max-w-lg">
              Longitudinal analysis of recorded decisions, velocity, and habits across your private timeline.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefreshRecap}
            disabled={isLoading}
            className="btn-press btn-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'Re-synthesize'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-border-subtle text-xs text-on-surface-muted">
          <Calendar className="w-4 h-4 text-primary-blue" />
          <span className="font-semibold text-on-surface">{recap.period}</span>
          <span className="opacity-40">•</span>
          <span>{recap.totalEntriesCount} moments analyzed</span>
        </div>
      </section>

      {/* Responsive Grid for Wide Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Key Decisions Made */}
        <section className="rounded-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-blue uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-primary-blue" />
            <span>Strategic Decisions Documented</span>
          </div>

          <div className="space-y-2">
            {recap.keyDecisions.map((dec, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-low border border-border-subtle text-xs text-on-surface leading-relaxed flex items-start gap-2.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-blue mt-1.5 shrink-0" />
                <span>{dec}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Key Breakthroughs */}
        <section className="rounded-card p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-indigo-500" />
            <span>Breakthrough Milestones</span>
          </div>

          <div className="space-y-2">
            {recap.breakthroughs.map((b, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-low border border-border-subtle text-xs text-on-surface leading-relaxed flex items-start gap-2.5"
              >
                <Flame className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 3. Energy & Rhythm Longitudinal Analysis */}
      <section className="rounded-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4" />
          <span>Longitudinal Rhythm &amp; Fatigue Mirror</span>
        </div>

        <p className="text-xs text-on-surface leading-relaxed p-4 rounded-xl bg-surface-low border border-border-subtle">
          {recap.energyRhythmAnalysis}
        </p>
      </section>

      {/* 4. Carrying Forward (Unresolved Threads) */}
      <section className="rounded-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-primary-blue uppercase tracking-wider">
          <ArrowRight className="w-4 h-4" />
          <span>Carrying Forward to Next Week</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recap.unresolvedThreads.map((thread, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-surface-low border border-border-subtle text-xs text-on-surface leading-relaxed flex items-start gap-2"
            >
              <ArrowRight className="w-3.5 h-3.5 text-primary-blue mt-0.5 shrink-0" />
              <span>{thread}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
