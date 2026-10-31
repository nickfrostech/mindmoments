'use client';

import React from 'react';
import { BookOpen, Compass, BrainCircuit, History } from 'lucide-react';
import { ActiveTab } from '../types/memory';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const tabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'timeline', label: 'Timeline', icon: BookOpen },
    { id: 'forecast', label: 'Forecast', icon: Compass },
    { id: 'aimind', label: 'AI Mind', icon: BrainCircuit },
    { id: 'recap', label: 'Recap', icon: History },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-border-subtle transition-colors">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`btn-press flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-colors ${
                isActive
                  ? 'text-primary-cyan font-semibold'
                  : 'text-on-surface-muted hover:text-on-surface'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-primary-cyan shadow-[0_0_6px_var(--accent-cyan)]" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
