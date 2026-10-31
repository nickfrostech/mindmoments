# 📋 MindMoments — Master Build Roadmap & TODO

> **A memory-grounded personal diary and cognitive reflection system powered by Google Gemma 2.**
> Designed for Hacktoberfest & MLH Hackathon (3-Hour Sprint).

---

## 🎯 Project Overview
MindMoments is an intimate, private-first personal diary that transforms logged daily thoughts, decisions, code breakthroughs, and feelings into an active cognitive co-pilot. Powered by **Google Gemma 2**, it looks **forward** (predicting daily occurrences & energy rhythms), stays grounded in the **present** (interactive Q&A with past self citing actual evidence), and looks **backward** (weekly pattern recaps).

---

## 🏗️ Phased Execution Plan

### 📌 Phase 1: Foundations & Design Tokens
- [x] Configure Tailwind CSS theme with MindMoments Stitch design tokens:
  - Base canvas: `#0B0F17` / `#111827`
  - Accents: Electric Cyan (`#00D4FF`) and Soft Violet (`#8B5CF6`)
  - Frosted glassmorphism utilities (`ambient-bg-blur`, `glass-border`, `glow-cyan`)
- [x] Configure Google Fonts (**Plus Jakarta Sans** for headlines & **Inter** for body text) in `src/app/layout.tsx`.
- [x] Verify `@esvigy/react` and `lucide-react` component imports.
- [x] Set up environment configuration (`.env.local.example`) for Gemma 2 (Groq / Google AI Studio API).

---

### 📌 Phase 2: Domain Modeling & Memory Persistence
- [x] Define bulletproof TypeScript interfaces (`src/types/memory.ts`) following Matt Pocock standards:
  - `MemoryEntry` (id, timestamp, content, mood, tags, category)
  - `MoodType` (`😊 Focused`, `😴 Fatigued`, `🔥 Breakthrough`, `😔 Uncertain`)
  - `OccurrenceForecast` (peakWindow, warningPattern, morningScore, afternoonScore, eveningScore)
  - `AIInsight` (answer, citedEntries, patternObservations)
  - `WeeklyRecap` (milestones, moodRhythm, openThreads)
- [x] Build local-first persistence utilities (`src/lib/storage.ts`) with safe SSR fallback.
- [x] Create **"✨ Seed 14 Days of Demo Life"** dataset (`src/lib/seedData.ts`):
  - 14 realistic, rich entries spanning the past two weeks (late-night coding, architecture decisions, team meetings, burnout warnings, breakthrough moments).

---

### 📌 Phase 3: Mobile-First Web Shell & Navigation
- [x] Build responsive mobile-first shell (`max-w-[440px] mx-auto` with desktop-friendly centered backdrop).
- [x] Build **Top Header Bar**:
  - Live formatted date (e.g. `Saturday, Oct 31`)
  - Brand mark `MindMoment` with glowing spark icon
  - Interactive **"✨ Seed Demo"** action button
  - Settings trigger (for API key configuration)
- [x] Build **Fixed Bottom Navigation Bar**:
  - 4 destination tabs: `Timeline`, `Forecast`, `AI Mind`, `Weekly Recap`
  - Active tab glow indicator dot & smooth tab switching state.

---

### 📌 Phase 4: Universal Diary Timeline Module
- [x] Build **Quick Moment Capture Card**:
  - Textarea supporting thoughts, decisions, or raw feelings
  - Frequency (Mood) pills: `😊 Focused`, `😴 Fatigued`, `🔥 Breakthrough`, `😔 Uncertain`
  - Interactive tag pills: `#decision`, `#project`, `#life`, `+ tag`
  - Gradient CTA button: **"Log Moment"** with tactile Emil Kowalski press scale (`:active:scale-95`)
- [x] Build **Timeline Stream**:
  - Grouped chronologically with vertical connection track
  - Rich cards displaying timestamp, mood badge, text content, and tag chips
  - Empty state with `@esvigy/react` illustration when no entries exist
  - Tag filter bar to filter entries by `#decision`, `#project`, etc.

---

### 📌 Phase 5: 🔮 Today's Occurrence Forecast Engine
- [x] Create API Route `/api/forecast` using **Gemma 2** (`gemma2-9b-it`):
  - Analyzes past entries for day-of-week patterns, sleep debt, and pending tasks
  - Outputs structured daily forecast: Peak focus window, pattern alerts, and adaptive cognitive arc
- [x] Build **Today's Occurrence Forecast Card**:
  - Ambient violet/cyan aura
  - ⚡ Peak Focus Window badge
  - ⚠️ Pattern Alert (e.g. *"After 2 late nights, protect your afternoon against context-switching fatigue"*)
  - Interactive 3-part **Cognitive Rhythm Arc**: Morning (Peak), Afternoon (Guard Time), Evening (Restorative).

---

### 📌 Phase 6: 🧠 AI Mind (Grounded Reflection & Citations)
- [x] Create API Route `/api/reflect` using **Gemma 2**:
  - System prompt grounded strictly in retrieved user entries
  - Formulates response distinguishing **Observed Facts**, **Patterns**, and **Interpretations**
  - Extracts and returns exact entry IDs cited as evidence
- [x] Build **AI Mind Interactive Interface**:
  - Natural language prompt bar (*"What patterns trigger my creative breakthroughs?"*)
  - Quick suggested question chips
  - Grounded answer card displaying synthesized insight
  - Clickable **Evidence Citation Chips** (`📎 Cited: Oct 18 #decision, Oct 24 #project`) that highlight referenced diary entries!

---

### 📌 Phase 7: 📊 Weekly Recap & Pattern Mirror
- [x] Create API Route `/api/recap` using **Gemma 2**:
  - Synthesizes 7-day longitudinal trajectory into: Key Decisions Made, Energy/Mood Rhythms, and Unresolved Threads
- [x] Build **Weekly Recap View**:
  - Milestone summary cards
  - Behavioral pattern observations
  - Carrying forward action list for next week.

---

### 📌 Phase 8: Settings, Polish & Hackathon Deliverables
- [x] Build **API Key Settings Modal** (allows judges to test with Groq or Google AI Studio keys without editing files).
- [x] Apply Emil Kowalski motion craft:
  - Spring decel curves, no `transition: all`, subtle breathing aura animations.
- [x] End-to-end verification and testing with sample data.
- [x] Prepare **90-second MLH demo recording script & screenshots** ([`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md)).
