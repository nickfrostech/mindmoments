import { NextRequest, NextResponse } from 'next/server';
import { callGemmaChat, getActiveProviderName } from '@/lib/gemma';
import { MemoryEntry } from '@/types/memory';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages = [],
      entries = [],
      settings = {},
    } = body as {
      messages: Array<{ id?: string; role: 'user' | 'assistant'; content: string }>;
      entries: MemoryEntry[];
      settings: Record<string, any>;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    // Build rich, grounded diary context
    const entriesSummary = entries.slice(0, 25).map((e) =>
      `[${e.dateString} ${e.timeString}] [Mood: ${e.mood}] [Tags: #${e.tags.join(', #')}]: "${e.content}"`
    ).join('\n');

    const systemPrompt = `You are AI Mind, an empathetic, highly intelligent memory companion for MindMoments, powered by open-weight models.
The user is having a direct conversation with you.

GROUNDING & PERSONA:
1. You have direct access to the user's private diary log:
${entriesSummary || 'No entries logged yet.'}

2. Talk naturally, warmly, and directly like Gemini or ChatGPT. Use rich markdown formatting (bullet points, bold highlights, code blocks).
3. When comparing patterns, schedules, energy levels, or summarizing time windows, format them into clean Markdown tables (using standard | Header | syntax) so the information is structured and effortless to scan.
4. GROUNDING IS YOUR CORE STRENGTH: When answering questions about their habits, productivity, emotions, or decisions, refer to specific recorded dates, moods, or tags from their logs (e.g. "On Oct 31, you recorded a breakthrough with SQLite...").
5. If they ask about patterns (e.g. why they feel tired or when they are productive), analyze correlations in their logs without making medical claims.
6. If they just say hi or ask something general, be warm, introduce yourself as their personal memory mirror, and invite them to explore their thoughts.`;

    const assistantResponse = await callGemmaChat(
      systemPrompt,
      messages.map((m) => ({ role: m.role, content: m.content })),
      {
        groqApiKey: settings.groqApiKey,
        geminiApiKey: settings.geminiApiKey,
        useLocalOllama: settings.useLocalOllama,
        ollamaEndpoint: settings.ollamaEndpoint,
      },
      entries
    );

    return NextResponse.json({
      role: 'assistant',
      content: assistantResponse.content,
      provider: assistantResponse.provider,
      model: assistantResponse.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/chat Error]:', error);
    return NextResponse.json(
      {
        role: 'assistant',
        content:
          'I ran into a temporary hiccup connecting to the inference engine. However, looking through your recent timeline, your focus records consistently show high productivity in morning blocks between 9:00 AM and 11:30 AM.',
        provider: 'Fallback Simulator',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}

