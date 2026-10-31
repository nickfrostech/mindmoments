'use client';

import React, { useState, useEffect } from 'react';
import { Compass, RefreshCw, Zap, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { OccurrenceForecast, MemoryEntry, AppSettings } from '../types/memory';
import { saveStoredForecast, getForecastFromIDB, getStoredForecast } from '../lib/storage';
import { CognitiveChart } from './CognitiveChart';

interface OccurrenceForecastCardProps {
  entries: MemoryEntry[];
  settings: AppSettings;
}

export function OccurrenceForecastCard({ entries, settings }: OccurrenceForecastCardProps) {
  const [forecast, setForecast] = useState<OccurrenceForecast>(() => {
    const cached = getStoredForecast();
    if (cached) return cached;

    return {
      date: 'Saturday, Oct 31',
      peakFocusWindow: 'Morning window 9:00 AM – 11:45 AM',
      patternAlert: 'After 2 late nights, protect your afternoon against context-switching fatigue.',
      morningScore: 94,
      afternoonScore: 48,
      eveningScore: 72,
      suggestedAction: 'Schedule your deepest architecture and coding tasks before lunch.',
      basedOnEntriesCount: entries.length || 14,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getForecastFromIDB().then((cached) => {
      if (cached) setForecast(cached);
    });
  }, []);

  const handleRefreshForecast = async () => {
    setIsLoading(true);
    try {
      const todayFormatted = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entries,
          todayDate: todayFormatted,
          settings,
        }),
      });

      if (res.ok) {
        const data: OccurrenceForecast = await res.json();
        setForecast(data);
        saveStoredForecast(data);
      }
    } catch (e) {
      console.error('[Forecast Fetch Error]:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-card p-6 relative overflow-hidden transition-all shadow-sm space-y-6">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-5 h-5 text-primary-blue" />
            <h2 className="text-base font-bold text-on-surface tracking-tight">
              Today&apos;s Occurrence Forecast
            </h2>
            <span className="bg-primary-blue/10 border border-primary-blue/20 text-primary-blue text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Gemma 2 Predictive
            </span>
          </div>
          <p className="text-xs text-on-surface-muted leading-relaxed max-w-lg">
            Anticipating cognitive focus and fatigue traps based on historical diary patterns and circadian rhythms.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshForecast}
          disabled={isLoading}
          className="btn-press text-xs text-primary-blue hover:underline flex items-center gap-1.5 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Synthesizing...' : 'Re-calculate'}</span>
        </button>
      </div>

      {/* Narrative Insights */}
      <div className="grid sm:grid-cols-2 gap-3 text-xs">
        {/* Peak Focus */}
        <div className="flex items-start gap-3 bg-surface-low p-3.5 rounded-xl border border-border-subtle">
          <Zap className="w-4 h-4 text-primary-blue shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-on-surface font-semibold block mb-0.5">Peak Focus Window:</strong>
            <span className="text-on-surface-variant">
              {forecast.peakFocusWindow}. Highest cognitive clarity detected in logs.
            </span>
          </div>
        </div>

        {/* Pattern Warning Alert */}
        <div className="flex items-start gap-3 bg-surface-low p-3.5 rounded-xl border border-border-subtle">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-on-surface font-semibold block mb-0.5">Pattern Alert:</strong>
            <span className="text-on-surface-variant">{forecast.patternAlert}</span>
          </div>
        </div>
      </div>

      {/* Cognitive Rhythm Prediction Arc & Recharts Visualizer */}
      <div className="pt-4 border-t border-border-subtle space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold text-on-surface-muted">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <TrendingUp className="w-4 h-4 text-primary-blue" />
            <span>Predicted 24-Hour Cognitive Rhythm</span>
          </span>
          <span className="text-[11px] text-primary-blue font-medium">
            {entries.length} moments analyzed
          </span>
        </div>

        {/* Recharts Area Chart */}
        <div className="bg-surface-low/50 rounded-2xl p-3 border border-border-subtle">
          <CognitiveChart
            morningScore={forecast.morningScore}
            afternoonScore={forecast.afternoonScore}
            eveningScore={forecast.eveningScore}
          />
        </div>

        {/* Scores Breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {/* Morning Score */}
          <div className="bg-surface-low p-3.5 rounded-xl border border-border-subtle flex flex-col items-center text-center">
            <span className="text-[11px] text-on-surface-muted uppercase font-medium">Morning</span>
            <span className="text-2xl font-bold text-primary-blue my-1 font-heading">
              {forecast.morningScore}%
            </span>
            <span className="text-[10px] text-primary-blue flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
              <span>Peak Flow</span>
            </span>
          </div>

          {/* Afternoon Score */}
          <div className="bg-surface-low p-3.5 rounded-xl border border-border-subtle flex flex-col items-center text-center">
            <span className="text-[11px] text-on-surface-muted uppercase font-medium">Afternoon</span>
            <span className="text-2xl font-bold text-amber-500 my-1 font-heading">
              {forecast.afternoonScore}%
            </span>
            <span className="text-[10px] text-amber-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Guard Time</span>
            </span>
          </div>

          {/* Evening Score */}
          <div className="bg-surface-low p-3.5 rounded-xl border border-border-subtle flex flex-col items-center text-center">
            <span className="text-[11px] text-on-surface-muted uppercase font-medium">Evening</span>
            <span className="text-2xl font-bold text-indigo-500 my-1 font-heading">
              {forecast.eveningScore}%
            </span>
            <span className="text-[10px] text-indigo-500 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Restorative</span>
            </span>
          </div>
        </div>

        {/* Tactical Advice Footnote */}
        <div className="p-3 rounded-xl bg-surface-low border border-border-subtle flex items-center justify-between text-xs text-on-surface-muted">
          <div className="flex items-center gap-2 truncate mr-2">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">
              <strong className="text-on-surface">Guidance:</strong> {forecast.suggestedAction}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
