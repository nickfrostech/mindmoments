'use client';

import React, { useState } from 'react';
import { Trash2, Calendar, Tag, Filter } from 'lucide-react';
import { EmptyMessage } from '@esvigy/react';
import { MemoryEntry, MOOD_CONFIGS } from '../types/memory';
import { MoodIcon } from './MoodIcon';

interface TimelineStreamProps {
  entries: MemoryEntry[];
  onDeleteEntry: (id: string) => void;
  onSeedDemo: () => void;
}

export function TimelineStream({ entries, onDeleteEntry, onSeedDemo }: TimelineStreamProps) {
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('all');

  // Extract all unique tags
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  // Filtered list
  const filteredEntries =
    selectedFilterTag === 'all'
      ? entries
      : entries.filter((e) => e.tags.includes(selectedFilterTag));

  return (
    <section className="space-y-4">
      {/* Stream Header & Tag Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-on-surface tracking-tight">Timeline Log</h2>
          <span className="text-xs font-semibold bg-surface-low text-primary-cyan px-2.5 py-0.5 rounded-full border border-border-subtle">
            {filteredEntries.length} entries
          </span>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-on-surface-muted shrink-0 mr-1" />
          <button
            type="button"
            onClick={() => setSelectedFilterTag('all')}
            className={`btn-press text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
              selectedFilterTag === 'all'
                ? 'bg-primary-cyan text-slate-950 font-semibold border-primary-cyan'
                : 'bg-surface text-on-surface-muted border-border-subtle hover:text-on-surface'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedFilterTag(tag)}
              className={`btn-press text-xs font-medium px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                selectedFilterTag === tag
                  ? 'bg-primary-cyan text-slate-950 font-semibold border-primary-cyan'
                  : 'bg-surface text-on-surface-muted border-border-subtle hover:text-on-surface'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State with Esvigy Illustration */}
      {filteredEntries.length === 0 ? (
        <div className="flat-card rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4">
          <div className="w-48 h-48 flex items-center justify-center">
            <EmptyMessage
              color="#00D4FF"
              secondaryColor="#1E293B"
              className="w-full h-full"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-on-surface">No moments logged</h3>
            <p className="text-xs text-on-surface-muted max-w-sm mx-auto leading-relaxed">
              {selectedFilterTag === 'all'
                ? 'Your private diary timeline is currently empty. Record your first moment or inject sample memories.'
                : `No entries tagged with #${selectedFilterTag}.`}
            </p>
          </div>
          {selectedFilterTag === 'all' ? (
            <button
              type="button"
              onClick={onSeedDemo}
              className="btn-press btn-flat-primary px-5 py-2 rounded-xl text-xs font-semibold"
            >
              Seed 14-Day Life Demo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelectedFilterTag('all')}
              className="btn-press text-xs font-semibold text-primary-cyan hover:underline"
            >
              Show all entries
            </button>
          )}
        </div>
      ) : (
        /* The Timeline Cards Stream */
        <div className="space-y-3 relative before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[1px] before:bg-border-subtle">
          {filteredEntries.map((entry) => {
            const moodConfig = MOOD_CONFIGS[entry.mood] || MOOD_CONFIGS.focused;

            return (
              <article key={entry.id} className="relative pl-7 group">
                {/* Timeline dot */}
                <div
                  className={`absolute left-1.5 top-5 w-3 h-3 rounded-full bg-surface border-2 transition-colors ${moodConfig.borderClass}`}
                />

                {/* Card Container */}
                <div className="flat-card rounded-xl p-4 transition-all hover:shadow-sm">
                  {/* Metadata Row */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 ${moodConfig.badgeClass}`}
                      >
                        <MoodIcon mood={entry.mood} className="w-3 h-3" />
                        <span>{moodConfig.label}</span>
                      </span>

                      <span className="text-xs text-on-surface-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3 opacity-60" />
                        <span>{entry.dateString}</span>
                        <span className="opacity-40">•</span>
                        <span>{entry.timeString}</span>
                      </span>
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-on-surface-muted hover:text-red-500 transition-opacity p-1 rounded hover:bg-surface-low"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Note Content */}
                  <p className="text-sm text-on-surface font-body leading-relaxed mb-3 whitespace-pre-wrap">
                    {entry.content}
                  </p>

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium text-on-surface-muted bg-surface-low px-2 py-0.5 rounded-md border border-border-subtle flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 opacity-60" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
