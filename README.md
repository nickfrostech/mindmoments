<div align="center">

# 🌌 MindMoments

### A Memory-Grounded Personal Diary & Cognitive Reflection System
**Powered by open-weight Google Gemma 2, with local and hosted inference options**

[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemma 2](https://img.shields.io/badge/Google%20Gemma%202-9B%20Instruct-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/gemma)
[![Package Manager: pnpm](https://img.shields.io/badge/pnpm-v12-f69220?style=for-the-badge&logo=pnpm)](https://pnpm.io)
[![Esvigy Illustrations](https://img.shields.io/badge/Illustrations-@esvigy/react-00D4FF?style=for-the-badge)](https://esvigy.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

*Built for Hacktoberfest & Major League Hacking (MLH) Hackathon.*

---

</div>

## 💡 The Core Problem: The Thin-Wrapper AI Trap

Most "AI journaling" apps are shallow chat wrappers: you ask a chatbot how you feel, and it returns generic motivational fluff. Generic LLMs have no persistent recollection of your life, cannot identify relationships between your past decisions and current fatigue, and require pasting sensitive personal thoughts into closed cloud servers.

**MindMoments solves this through three foundational innovations:**

1. **Grounded Longitudinal Memory**: MindMoments answers questions strictly using your *actual recorded experiences*, distinguishing documented facts from observed patterns and potential interpretations.
2. **Evidence Citations**: Every AI response cites the exact diary entries that informed its reflection (e.g. `📎 Cited: Oct 18 #decision, Oct 24 #project`).
3. **Open-weight AI with a local option**: Run Gemma 2 locally with Ollama, or use a hosted inference provider. Local inference can keep diary content on your machine; hosted providers receive the content required to answer your request, subject to their terms and privacy practices.

---

## 🌟 The 3 Temporal Pillars of MindMoments

```
           ┌──────────────────────────────────────────────┐
           │                 MINDMOMENTS                  │
           └──────────────────────┬───────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
 🔮 THE FUTURE           ⚡ THE PRESENT            📊 THE PAST
 Today's Occurrence       Universal Diary         Weekly Recap &
 Forecast & Rhythm        & AI Mind Q&A          Pattern Mirror
```

### 1. 🔮 Look Ahead: Today's Occurrence Forecast (Future)
* Analyzes past entries on this day of the week, recent sleep debt, and unresolved tasks.
* **Cognitive Rhythm Arc**: Predicts daily focus windows (e.g. *Morning 94% Peak Flow*, *Afternoon 48% Guard Time*, *Evening 72% Restorative*).
* **Pattern Warning Alerts**: E.g., *"After 2 consecutive late nights, protect your afternoon against context-switching fatigue."*

### 2. ⚡ In the Moment: Universal Diary & AI Mind (Present)
* **Quick Moment Capture**: Log any thought, architecture decision, project milestone, or feeling with mood pills (`😊 Focused`, `😴 Fatigued`, `🔥 Breakthrough`, `😔 Uncertain`) and tags (`#decision`, `#project`, `#life`).
* **AI Mind Q&A**: Ask your diary anything (*"What patterns trigger my creative breakthroughs?"*, *"Why was I so burned out two weeks ago?"*).
* **Verifiable Grounding**: Displays exact citation pills referencing the source memories.

### 3. 📊 Look Back: Weekly Recap & Pattern Mirror (Past)
* Synthesizes 7-day longitudinal trajectory into:
  * **Milestones & Decisions Made**
  * **Energy & Mood Rhythms**
  * **Unfinished Threads** carried into next week.

---

## 🎨 Design Engineering Standards

MindMoments is engineered as a **mobile app UI built for the web** (responsive ~420px mobile viewport with elegant desktop centering):

* **Aesthetic**: Deep nocturnal canvas (`#0B0F17` / `#111827`) with frosted glassmorphic card containers (`backdrop-blur-md`).
* **Color Accents**: Electric Cyan (`#00D4FF`) for clarity and active states; Soft Violet (`#8B5CF6`) for introspective memory depth.
* **Typography**: **Plus Jakarta Sans** for headlines and **Inter** for distraction-free longform reading.
* **Motion & Craft**: Adheres to **Emil Kowalski's Animations.dev standards** (zero `transition: all`, spring deceleration curves, and tactile button `:active:scale-95` press physics).
* **Illustrations**: Open-source vector illustration system via **`@esvigy/react`**.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org) (App Router, Server Actions & Route Handlers)
* **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Matt Pocock typing patterns)
* **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + `clsx` + `tailwind-merge`
* **Icons & Vectors**: [Lucide React](https://lucide.dev) & [@esvigy/react](https://esvigy.vercel.app)
* **AI Engine**: **Google Gemma 2 (open-weight)** via local Ollama (`gemma2:2b`) or Groq (`gemma2-9b-it`). An optional Google Gemini API route uses Gemini 1.5 Flash, which is a separate hosted model and is not Gemma.
* **State & Persistence**: Local-first browser storage (`localStorage`)
* **Package Manager**: [`pnpm`](https://pnpm.io)

### Models, providers, and privacy

Gemma 2 is an open-weight model family; open weights do not make every part of
the model or service open source. Gemma weights are subject to Google's
[Gemma Terms of Use](https://ai.google.dev/gemma/terms). The supported Gemma
variants are [Gemma 2 2B through Ollama](https://ollama.com/library/gemma2)
and [Gemma 2 9B Instruct](https://huggingface.co/google/gemma-2-9b-it),
available through Groq when supported by that provider.

The Google Gemini API integration is an alternative hosted model route, not a
Gemma route. Refer to the [Gemini API terms](https://ai.google.dev/gemini-api/terms)
and [Groq's terms](https://groq.com/terms-of-service/) when using those
services. Provider availability, model identifiers, and terms can change.

Diary entries are stored in the browser's local storage. When a cloud provider
is used, the entries included in an AI request are sent to that provider for
inference; local browser storage does not mean cloud requests stay local. API
keys entered in Settings are stored in that browser's local storage. For
machine-local inference, configure Ollama and use the local model option.

---

## 🚀 Quickstart Guide

### Prerequisites
* Node.js 20+
* `pnpm` (default package manager)

### 1. Clone & Install
```bash
git clone https://github.com/OWNER/REPOSITORY.git
cd mindmoments
pnpm install
```
Replace `OWNER/REPOSITORY` with the public GitHub repository URL.

### 2. Configure an AI provider (optional)
You can add a provider key in the app's Settings dialog, or configure a server
environment variable:
```env
# Hosted Gemma 2 inference through Groq
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional hosted Gemini 1.5 Flash route (not Gemma)
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```
For local Gemma 2 inference, install [Ollama](https://docs.ollama.com/quickstart)
and pull/run the model used by the app (for example, `ollama run gemma2:2b`).
Do not commit `.env.local` or share API keys.

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing with Demo Memories

MindMoments includes a built-in **"✨ Seed Demo"** button in the header bar. Clicking it instantly injects **14 realistic diary entries** spanning the past two weeks (late-night coding sprints, system architecture decisions, fatigue cycles, and breakthrough moments) so you can immediately test all 3 AI modules without manually typing entries.

---

## 📄 License
MindMoments project code and documentation are open source under the
[MIT License](LICENSE). See [CONTRIBUTING.md](CONTRIBUTING.md) to participate
and [COPYRIGHT.md](COPYRIGHT.md) for copyright and third-party model/service
notices. The MIT License does not apply to Gemma weights, hosted AI services,
or third-party dependencies. For an MLH challenge submission, make sure the
GitHub repository is public.
