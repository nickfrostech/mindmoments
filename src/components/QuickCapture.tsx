'use client';

import React, { useState } from 'react';
import { PenLine, ArrowUpRight, Plus, X } from 'lucide-react';
import { MoodType, MOOD_CONFIGS } from '../types/memory';
import { MoodIcon } from './MoodIcon';

interface QuickCaptureProps {
  onSave: (content: string, mood: MoodType, tags: string[]) => void;
}

const DEFAULT_TAGS = ['decision', 'project', 'code', 'life', 'reflection'];

export function QuickCapture({ onSave }: QuickCaptureProps) {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('focused');
  const [selectedTags, setSelectedTags] = useState<string[]>(['project']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');
  const [isSavedEffect, setIsSavedEffect] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customTagInput.trim().replace(/^#/, '').toLowerCase();
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
    }
    setCustomTagInput('');
    setIsAddingTag(false);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    onSave(content, selectedMood, selectedTags);
    setContent('');
    setIsSavedEffect(true);
    setTimeout(() => setIsSavedEffect(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="flat-card rounded-2xl p-5 relative overflow-hidden transition-all shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <PenLine className="w-4 h-4 text-primary-cyan" />
          <span>Capture a Moment</span>
        </h2>
        <span className="text-xs text-on-surface-muted">Local-first memory</span>
      </div>

      {/* Input Text Area */}
      <div className="flat-card-focus bg-surface-low rounded-xl p-3.5 border border-border-subtle mb-4 transition-all">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What happened? Log an architecture decision, code breakthrough, thought, or fatigue note..."
          rows={3}
          className="w-full bg-transparent border-0 text-on-surface placeholder:text-on-surface-muted/60 focus:ring-0 text-sm resize-none p-0 outline-none leading-relaxed"
        />

        <div className="flex justify-between items-center pt-2.5 mt-2 border-t border-border-subtle text-on-surface-muted text-xs">
          <span>Record what you thought or did</span>
          <span className="hidden sm:inline opacity-75 font-mono text-[11px]">Ctrl + ↵ to save</span>
        </div>
      </div>

      {/* Mood Selector Row - Clean Flat Icons */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-on-surface-muted mb-2 uppercase tracking-wider">
          State of Mind (Frequency)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((moodKey) => {
            const config = MOOD_CONFIGS[moodKey];
            const isSelected = selectedMood === moodKey;

            return (
              <button
                key={moodKey}
                type="button"
                onClick={() => setSelectedMood(moodKey)}
                className={`btn-press p-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? config.badgeClass + ' border-2 font-semibold shadow-sm'
                    : 'bg-surface-low text-on-surface-muted border-border-subtle hover:text-on-surface hover:border-border-hover'
                }`}
              >
                <MoodIcon mood={moodKey} className="w-3.5 h-3.5 shrink-0" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags & Action Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border-subtle">
        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none flex-1">
          {DEFAULT_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`btn-press px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary-cyan/15 text-primary-cyan border-primary-cyan/40 font-semibold'
                    : 'bg-surface-low text-on-surface-muted border-border-subtle hover:text-on-surface'
                }`}
              >
                #{tag}
              </button>
            );
          })}

          {/* Add custom tag button */}
          {isAddingTag ? (
            <form onSubmit={handleAddCustomTag} className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                autoFocus
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                placeholder="tag..."
                className="w-20 px-2.5 py-1 rounded-lg text-xs bg-surface-low text-on-surface border border-primary-cyan outline-none"
              />
              <button
                type="button"
                onClick={() => setIsAddingTag(false)}
                className="text-on-surface-muted hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="btn-press px-2.5 py-1 rounded-lg text-xs bg-surface-low text-on-surface-muted border border-dashed border-border-subtle hover:text-on-surface shrink-0 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>tag</span>
            </button>
          )}
        </div>

        {/* Flat Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`btn-press btn-flat-primary px-5 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm ${
            !content.trim() ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'
          }`}
        >
          <span>{isSavedEffect ? 'Recorded ✓' : 'Save Moment'}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
