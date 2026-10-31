'use client';

import React, { useState } from 'react';
import { BrainCircuit, Sparkles, Send, Link as LinkIcon, CheckCircle2, X, Quote } from 'lucide-react';
import { WomanYoga } from '@esvigy/react';
import { MemoryEntry, AIInsight, AppSettings, CitedMoment } from '../types/memory';

interface AIMindCardProps {
  entries: MemoryEntry[];
  settings: AppSettings;
}

const SUGGESTED_QUERIES = [
  'What patterns trigger my creative breakthroughs?',
  'Why did I feel so unmotivated last week?',
  'What did I decide about our architecture?',
  'When am I most prone to fatigue?',
];

export function AIMindCard({ entries, settings }: AIMindCardProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<CitedMoment | null>(null);

  const [insight, setInsight] = useState<AIInsight>({
    id: 'initial-insight',
    query: 'What patterns trigger my creative breakthroughs?',
    answer:
      'Your highest-leverage decisions and breakthroughs consistently occur between 9:00 AM – 11:30 AM following at least 7.5 hours of sleep and no morning meetings.',
    citedMoments: [
      {
        id: 'mem-12',
        date: 'Oct 31, 2026',
        snippet: 'Decided to simplify system architecture. Choosing SQLite saved 3 weeks.',
        tags: ['decision', 'project'],
        mood: 'breakthrough',
      },
      {
        id: 'mem-05',
        date: 'Oct 24, 2026',
        snippet: 'Adopted open-weight Gemma 2 for privacy-first journaling.',
        tags: ['decision', 'project'],
        mood: 'breakthrough',
      },
      {
        id: 'mem-04',
        date: 'Oct 23, 2026',
        snippet: 'Back on track after an 8-hour sleep. Morning deep work was pure flow.',
        tags: ['code', 'project'],
        mood: 'focused',
      },
    ],
    observedFacts: [
      'Breakthrough moments occurred in morning blocks between 9:00 AM and 11:30 AM.',
      'Late-night coding on Oct 21 and Oct 22 directly preceded fatigue logs.',
    ],
    possibleInterpretation:
      'Your focus and decision velocity correlate strongly with sleep consistency rather than caffeine intake.',
    createdAt: new Date().toISOString(),
  });

  const handleAsk = async (questionToAsk: string) => {
    const q = questionToAsk.trim();
    if (!q) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          entries,
          settings,
        }),
      });

      if (res.ok) {
        const data: AIInsight = await res.json();
        setInsight(data);
      }
    } catch (e) {
      console.error('[AI Mind Fetch Error]:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(query);
  };

  return (
    <section className="rounded-card p-6 relative overflow-hidden transition-all shadow-sm space-y-5">
      {/* Header with Esvigy Mindfulness Illustration */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <BrainCircuit className="w-5 h-5 text-primary-blue" />
            <h2 className="text-base font-bold text-on-surface">AI Mind &amp; Grounded Reflection</h2>
            <span className="text-[10px] uppercase tracking-wider text-primary-blue font-semibold bg-primary-blue/10 px-2 py-0.5 rounded-full border border-primary-blue/20">
              Gemma 2 RAG
            </span>
          </div>
          <p className="text-xs text-on-surface-muted leading-relaxed max-w-lg">
            Ask your past self anything about what you&apos;ve logged. Every reflection is grounded in actual diary evidence with clickable citations.
          </p>
        </div>

        {/* Esvigy Yoga / Mindful Vector Illustration */}
        <div className="w-20 h-20 shrink-0 hidden sm:flex items-center justify-center p-2 bg-surface-low rounded-2xl border border-border-subtle">
          <WomanYoga
            color="#3B82F6"
            secondaryColor="#1E293B"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
        <div className="flex-1 bg-surface-low border border-border-subtle rounded-xl px-3.5 py-2.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-primary-blue/30 focus-within:border-primary-blue transition-all">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your diary a question (e.g. 'Why did I struggle last week?')..."
            className="bg-transparent border-0 text-on-surface placeholder:text-on-surface-muted/60 text-xs focus:ring-0 p-0 w-full outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="btn-press btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-40"
        >
          {isLoading ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Suggested Query Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {SUGGESTED_QUERIES.map((sq) => (
          <button
            key={sq}
            type="button"
            onClick={() => {
              setQuery(sq);
              handleAsk(sq);
            }}
            className="btn-press text-xs px-3 py-1.5 rounded-full bg-surface-low text-on-surface-muted border border-border-subtle hover:text-on-surface hover:border-primary-blue/40 shrink-0 transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Grounded Synthesis Response Card */}
      {insight && (
        <div className="bg-surface-low/60 border border-border-subtle rounded-2xl p-5 relative space-y-4">
          {/* Active Citation Badge */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-blue" />
            <span className="text-xs font-semibold text-primary-blue">
              Synthesis of {insight.citedMoments.length} verified diary moments
            </span>
          </div>

          {/* Main Grounded Answer */}
          <p className="text-sm text-on-surface leading-relaxed">
            {insight.answer}
          </p>

          {/* Observed Facts */}
          {insight.observedFacts?.length > 0 && (
            <div className="p-3.5 rounded-xl bg-surface border border-border-subtle space-y-2">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Recorded Timeline Facts:</span>
              </span>
              <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
                {insight.observedFacts.map((fact, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Evidence Citations Cluster */}
          <div className="pt-3 border-t border-border-subtle">
            <div className="text-[11px] font-semibold text-on-surface-muted mb-2.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-primary-blue" />
              <span>CITED EVIDENCE MOMENTS (TAP TO VERIFY):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {insight.citedMoments.map((cm) => (
                <button
                  key={cm.id}
                  type="button"
                  onClick={() => setSelectedCitation(cm)}
                  className="btn-press text-xs font-medium text-primary-blue bg-primary-blue/10 border border-primary-blue/20 hover:bg-primary-blue/20 px-3 py-1 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <span>{cm.date}</span>
                  {cm.tags?.[0] && <span className="opacity-70">#{cm.tags[0]}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Citation Popover Modal */}
      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-card p-5 border border-border-subtle shadow-xl relative bg-surface">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-border-subtle">
              <div className="flex items-center gap-1.5 text-xs text-primary-blue font-semibold">
                <Quote className="w-4 h-4" />
                <span>Source Diary Entry ({selectedCitation.date})</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCitation(null)}
                className="p-1 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-low"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface leading-relaxed italic mb-3">
              &quot;{selectedCitation.snippet}&quot;
            </p>

            <div className="flex items-center justify-between text-xs text-on-surface-muted pt-2 border-t border-border-subtle">
              <span>Tags: #{selectedCitation.tags?.join(', #')}</span>
              <span className="text-emerald-500 font-medium">Verified Grounded</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
