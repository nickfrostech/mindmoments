'use client';

import React, { useState } from 'react';
import { Circle, Plus, ArrowUpRight, Tag, X } from 'lucide-react';
import { MoodType, MOOD_CONFIGS } from '../types/memory';
import { MoodIcon } from './MoodIcon';
import { toast } from 'sonner';

interface BottomInputBarProps {
  onSave: (content: string, mood: MoodType, tags: string[]) => void;
  defaultTag?: string;
}

const DEFAULT_TAGS = ['decision', 'project', 'code', 'life', 'reflection'];

export function BottomInputBar({ onSave, defaultTag }: BottomInputBarProps) {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>('focused');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    defaultTag && defaultTag !== 'all' ? [defaultTag] : ['project']
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;

    onSave(content, selectedMood, selectedTags);
    setContent('');
    setIsFocused(false);
    toast.success('Moment logged to your diary');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-4 z-30 w-full max-w-3xl mx-auto px-4">
      <div
        className={`glass-card p-2.5 shadow-lg transition-all duration-200 ${
          isFocused ? 'ring-2 ring-primary-blue/30 border-primary-blue' : ''
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <Circle className="w-4 h-4 text-primary-blue shrink-0" />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Add a moment, decision, or thought..."
            className="w-full bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:ring-0 p-1 outline-none"
          />
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!content.trim()}
            className="btn-press btn-primary p-2 rounded-lg text-xs font-semibold flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Expanded Controls when focused */}
        {isFocused && (
          <div className="pt-3 mt-2 border-t border-border-subtle space-y-2.5 animate-in fade-in duration-150">
            {/* Mood picker */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wider">
                State:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((m) => {
                  const cfg = MOOD_CONFIGS[m];
                  const isSel = selectedMood === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMood(m)}
                      className={`btn-press px-2 py-0.5 rounded-lg text-xs flex items-center gap-1 border transition-colors ${
                        isSel
                          ? cfg.badgeClass + ' border-current font-semibold'
                          : 'bg-surface-low text-on-surface-muted border-border-subtle hover:text-on-surface'
                      }`}
                    >
                      <MoodIcon mood={m} className="w-3 h-3" />
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none px-1">
              <span className="text-[11px] font-medium text-on-surface-muted uppercase tracking-wider mr-1">
                Tags:
              </span>
              {DEFAULT_TAGS.map((tag) => {
                const isSel = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`btn-press px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                      isSel
                        ? 'bg-primary-blue text-white font-semibold border-primary-blue'
                        : 'bg-surface-low text-on-surface-muted border-border-subtle hover:text-on-surface'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

