'use client';

import React, { useState } from 'react';
import { X, Key, Cpu, ExternalLink, Check } from 'lucide-react';
import { SecurityLock } from '@esvigy/react';
import { AppSettings } from '../types/memory';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}: SettingsModalProps) {
  const [groqKey, setGroqKey] = useState(settings.groqApiKey || '');
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey || '');
  const [useLocalOllama, setUseLocalOllama] = useState(settings.useLocalOllama || false);
  const [ollamaEndpoint, setOllamaEndpoint] = useState(settings.ollamaEndpoint || 'http://localhost:11434');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      groqApiKey: groqKey.trim(),
      geminiApiKey: geminiKey.trim(),
      useLocalOllama,
      ollamaEndpoint: ollamaEndpoint.trim(),
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-card bg-surface p-6 border border-border-subtle shadow-2xl relative">
        {/* Header with Esvigy SecurityLock vector illustration */}
        <div className="flex items-start justify-between pb-3 mb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center p-1 bg-surface-low rounded-xl border border-border-subtle shrink-0">
              <SecurityLock
                color="#3B82F6"
                secondaryColor="#1E293B"
                className="w-full h-full"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">Gemma 2 Inference Settings</h3>
              <p className="text-xs text-on-surface-muted">
                Configure your API key or toggle local offline Ollama.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-on-surface-muted hover:text-on-surface hover:bg-surface-low transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Privacy Note */}
          <div className="p-3 rounded-xl bg-surface-low border border-border-subtle text-xs text-on-surface leading-relaxed">
            <span className="font-semibold text-primary-blue">Privacy Guarantee: </span>
            <span>
              Your keys and diary memories remain strictly inside your browser session and are never saved to external database servers.
            </span>
          </div>

          {/* Groq API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-primary-blue" />
                <span>Groq API Key</span>
                <span className="text-[10px] bg-primary-blue/15 text-primary-blue px-1.5 py-0.2 rounded font-mono font-medium">
                  Recommended
                </span>
              </label>
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary-blue hover:underline flex items-center gap-1"
              >
                <span>Free key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              className="w-full rounded-xl bg-surface-low border border-border-subtle px-3.5 py-2 text-xs text-on-surface font-mono placeholder:text-on-surface-muted focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue outline-none transition-all"
            />
            <p className="text-[11px] text-on-surface-muted mt-1">
              Primary production model: <code className="text-primary-blue font-semibold">openai/gpt-oss-120b</code> on Groq.
            </p>
          </div>

          {/* Google Gemini / AI Studio API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-indigo-500" />
                <span>Google AI Studio Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-primary-blue hover:underline flex items-center gap-1"
              >
                <span>Get key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl bg-surface-low border border-border-subtle px-3.5 py-2 text-xs text-on-surface font-mono placeholder:text-on-surface-muted focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue outline-none transition-all"
            />
            <p className="text-[11px] text-on-surface-muted mt-1">
              First fallback model: Google&apos;s open-weights <code className="text-primary-blue font-semibold">gemma-4-31b-it</code>.
            </p>
          </div>

          {/* DigitalOcean / Self-Hosted / Local Ollama Toggle */}
          <div className="pt-2 border-t border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-semibold text-on-surface">DigitalOcean / Self-Hosted Droplet</h4>
                  <p className="text-[11px] text-on-surface-muted">
                    Route inference to a DigitalOcean Droplet or local Ollama
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useLocalOllama}
                onChange={(e) => setUseLocalOllama(e.target.checked)}
                className="rounded border-border-subtle text-primary-blue focus:ring-primary-blue w-4 h-4 cursor-pointer"
              />
            </div>

            {useLocalOllama && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="text-[11px] font-medium text-on-surface-muted block mb-1">
                    DigitalOcean Droplet IP or Server URL
                  </label>
                  <input
                    type="text"
                    value={ollamaEndpoint}
                    onChange={(e) => setOllamaEndpoint(e.target.value)}
                    placeholder="http://143.198.xxx.xxx:11434 or http://localhost:11434"
                    className="w-full rounded-xl bg-surface-low border border-border-subtle px-3 py-1.5 text-xs text-on-surface font-mono outline-none focus:border-primary-blue"
                  />
                </div>
                <p className="text-[10px] text-on-surface-muted">
                  Supports any DigitalOcean Droplet running Ollama (<code className="text-primary-blue">gemma2:2b</code>) or vLLM.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-press px-4 py-2 rounded-xl text-xs font-medium text-on-surface-muted hover:text-on-surface hover:bg-surface-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-press btn-primary px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
