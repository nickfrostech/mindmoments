'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Trash2,
  Calendar,
  Clock,
  Tag,
  Plus,
  Check,
} from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { MemoryEntry, MoodType, MOOD_CONFIGS } from '../types/memory';
import { MoodIcon } from './MoodIcon';
import { toast } from 'sonner';

interface MomentDetailDrawerProps {
  moment: MemoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: MemoryEntry) => void;
  onDelete: (id: string) => void;
  onToggleImportant: (id: string) => void;
}

export function MomentDetailDrawer({
  moment,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
  onToggleImportant,
}: MomentDetailDrawerProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType>('focused');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  useEffect(() => {
    if (moment) {
      setContent(moment.content);
      setMood(moment.mood);
      setTags(moment.tags || []);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  }, [moment]);

  if (!isOpen || !moment) return null;

  const handleSaveContent = () => {
    if (!content.trim() || content === moment.content) return;
    const updated: MemoryEntry = {
      ...moment,
      content: content.trim(),
    };
    onUpdate(updated);
    toast.success('Moment updated');
  };

  const handleMoodSelect = (newMood: MoodType) => {
    setMood(newMood);
    const updated: MemoryEntry = {
      ...moment,
      mood: newMood,
    };
    onUpdate(updated);
    toast.success(`State changed to ${MOOD_CONFIGS[newMood].label}`);
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (!trimmed || tags.includes(trimmed)) return;
    const updatedTags = [...tags, trimmed];
    setTags(updatedTags);
    setNewTagInput('');
    setIsAddingTag(false);
    const updated: MemoryEntry = {
      ...moment,
      tags: updatedTags,
    };
    onUpdate(updated);
    toast.success(`Tag #${trimmed} added`);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    setTags(updatedTags);
    const updated: MemoryEntry = {
      ...moment,
      tags: updatedTags,
    };
    onUpdate(updated);
    toast.success(`Tag #${tagToRemove} removed`);
  };

  let relativeTimeStr = '';
  try {
    relativeTimeStr = formatDistanceToNow(parseISO(moment.timestamp), { addSuffix: true });
  } catch {
    relativeTimeStr = moment.timeString;
  }

  return (
    <aside className="w-full sm:w-96 shrink-0 h-full bg-surface/90 backdrop-blur-xl border-l border-border-subtle flex flex-col z-40 animate-in slide-in-from-right duration-200">
      {/* Drawer Top Header (Microsoft To Do style) */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleImportant(moment.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              moment.isImportant
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                : 'bg-surface-low border-border-subtle text-on-surface-muted hover:text-on-surface'
            }`}
            title={moment.isImportant ? 'Unmark important' : 'Mark as important'}
          >
            <Star className={`w-4 h-4 ${moment.isImportant ? 'fill-amber-500' : ''}`} />
          </button>
          <span className="text-xs font-semibold text-on-surface">
            {moment.isImportant ? 'Starred Moment' : 'Moment Details'}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-low transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-5">
        {/* State / Mood Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-muted uppercase tracking-wider block">
            Cognitive State
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(MOOD_CONFIGS) as MoodType[]).map((m) => {
              const cfg = MOOD_CONFIGS[m];
              const isSelected = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMoodSelect(m)}
                  className={`btn-press p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
                    isSelected
                      ? `${cfg.badgeClass} border-current font-semibold`
                      : 'bg-surface-low border-border-subtle text-on-surface-muted hover:text-on-surface'
                  }`}
                >
                  <MoodIcon mood={m} className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Note Area */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-on-surface-muted uppercase tracking-wider block">
            Memory Note
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSaveContent}
            rows={5}
            className="w-full rounded-xl bg-surface-low border border-border-subtle p-3 text-sm text-on-surface placeholder:text-on-surface-muted focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue outline-none transition-all resize-none leading-relaxed"
            placeholder="Type note details..."
          />
          <p className="text-[11px] text-on-surface-muted">
            Auto-saves on blur. Grounded directly in your local diary.
          </p>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-on-surface-muted uppercase tracking-wider">
              Categorical Tags
            </label>
            {!isAddingTag && (
              <button
                type="button"
                onClick={() => setIsAddingTag(true)}
                className="text-xs text-primary-blue hover:underline flex items-center gap-1 font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Add tag</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-low border border-border-subtle text-on-surface"
              >
                <Tag className="w-3 h-3 opacity-60 text-primary-blue" />
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500 ml-0.5 text-on-surface-muted"
                  title="Remove tag"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {isAddingTag && (
              <div className="flex items-center gap-1 bg-surface-low border border-primary-blue/50 rounded-full px-2 py-0.5 text-xs">
                <span>#</span>
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    } else if (e.key === 'Escape') {
                      setIsAddingTag(false);
                    }
                  }}
                  autoFocus
                  placeholder="tag name..."
                  className="bg-transparent border-0 text-xs text-on-surface focus:ring-0 p-0 w-20 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="text-primary-blue hover:text-primary-blue-hover"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTag(false)}
                  className="text-on-surface-muted hover:text-on-surface"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp Info */}
        <div className="p-3.5 rounded-xl bg-surface-low border border-border-subtle space-y-2 text-xs text-on-surface-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary-blue" />
            <span>Logged on <strong className="text-on-surface">{moment.dateString}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary-blue" />
            <span>Exact time: <strong className="text-on-surface">{moment.timeString}</strong> ({relativeTimeStr})</span>
          </div>
        </div>
      </div>

      {/* Drawer Footer (Delete button) */}
      <div className="p-4 border-t border-border-subtle flex items-center justify-between bg-surface">
        <span className="text-[11px] text-on-surface-muted">
          Private local storage
        </span>
        <button
          type="button"
          onClick={() => {
            onDelete(moment.id);
            onClose();
            toast.success('Moment deleted');
          }}
          className="btn-press px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Moment</span>
        </button>
      </div>
    </aside>
  );
}

