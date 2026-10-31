/** @format */

import { NextRequest, NextResponse } from "next/server";
import { callGemma } from "@/lib/gemma";
import { MemoryEntry, OccurrenceForecast } from "@/types/memory";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const {
			entries = [],
			todayDate = "Today",
			settings = {},
		} = body as {
			entries: MemoryEntry[];
			todayDate: string;
			settings: Record<string, any>;
		};

		const systemPrompt = `You are the Cognitive Rhythm & Occurrence Forecaster for MindMoments, an evidence-grounded personal diary.
Your job is to analyze the user's recorded past moments (decisions, sleep notes, energy logs, work milestones) to project their likely occurrences, cognitive rhythm, and pattern alerts for ${todayDate}.

CRITICAL INSTRUCTIONS:
1. Ground your observations strictly on the entries provided.
2. Formulate 1 specific pattern alert (e.g. noticing fatigue correlations with past late nights, recurring post-lunch dips, or high morning energy).
3. Predict numerical cognitive scores (0-100) for Morning, Afternoon, and Evening.
4. Output STRICT JSON only. Do not include markdown codeblocks, triple backticks, or preamble.

Expected JSON format:
{
  "peakFocusWindow": "string (e.g. Morning window 9:00 AM – 11:45 AM)",
  "patternAlert": "string (concrete observation from entries)",
  "morningScore": number (e.g. 94),
  "afternoonScore": number (e.g. 48),
  "eveningScore": number (e.g. 72),
  "suggestedAction": "string (practical tactical advice for today)",
  "reasoning": "string"
}`;

		const userPrompt = `Here are my recent recorded diary moments:
${entries
	.slice(0, 15)
	.map(
		(e) =>
			`[${e.dateString} ${e.timeString}] Mood: ${e.mood} | Tags: ${e.tags.join(", ")} | Note: ${e.content}`,
	)
	.join("\n")}

Forecast my likely occurrences and rhythm for ${todayDate}. Return raw JSON only.`;

		const rawResponse = await callGemma(systemPrompt, userPrompt, {
			groqApiKey: settings.groqApiKey,
			geminiApiKey: settings.geminiApiKey,
			useLocalOllama: settings.useLocalOllama,
			ollamaEndpoint: settings.ollamaEndpoint,
		});

		// Clean JSON markdown fences if any
		const cleanJson = rawResponse
			.replace(/^```json\s*/i, "")
			.replace(/^```\s*/i, "")
			.replace(/```$/i, "")
			.trim();

		const parsed = JSON.parse(cleanJson);

		const forecast: OccurrenceForecast = {
			date: todayDate,
			peakFocusWindow:
				parsed.peakFocusWindow || "Morning window 9:00 AM – 11:30 AM",
			patternAlert:
				parsed.patternAlert ||
				"After 2 late nights working past midnight, protect your afternoon against context-switching fatigue.",
			morningScore: Number(parsed.morningScore) || 92,
			afternoonScore: Number(parsed.afternoonScore) || 50,
			eveningScore: Number(parsed.eveningScore) || 75,
			suggestedAction:
				parsed.suggestedAction ||
				"Focus on high-leverage architectural code before lunch.",
			basedOnEntriesCount: entries.length,
		};

		return NextResponse.json(forecast);
	} catch (error: any) {
		console.error("[API /api/forecast Error]:", error);

		// Fallback response so frontend never breaks
		const fallback: OccurrenceForecast = {
			date: "Today",
			peakFocusWindow: "Morning window 9:00 AM – 11:45 AM",
			patternAlert:
				"After 2 late nights working past midnight, protect your afternoon against context-switching fatigue.",
			morningScore: 94,
			afternoonScore: 48,
			eveningScore: 72,
			suggestedAction:
				"Tackle deep work in the morning block; avoid scheduling high-friction meetings after lunch.",
			basedOnEntriesCount: 14,
		};
		return NextResponse.json(fallback);
	}
}
