/** @format */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { get, set, del } from "idb-keyval";
import { WomanYoga } from "@esvigy/react";
import { MemoryEntry, AppSettings } from "../types/memory";
import { IDB_KEYS } from "../lib/storage";
import { toast } from "sonner";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: string;
	provider?: string;
}

interface AIMindChatProps {
	entries: MemoryEntry[];
	settings: AppSettings;
}

const SUGGESTED_QUESTIONS = [
	"What patterns trigger my creative breakthroughs?",
	"Why did I feel so unmotivated or fatigued last week?",
	"Summarize the strategic decisions I recorded",
	"When is my peak focus window based on my logs?",
];

export function AIMindChat({ entries, settings }: AIMindChatProps) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load chat history from IndexedDB on mount
	useEffect(() => {
		async function loadChatFromIDB() {
			try {
				const idbChat = await get<Message[]>(IDB_KEYS.CHAT);
				if (idbChat && Array.isArray(idbChat) && idbChat.length > 0) {
					setMessages(idbChat);
					setIsInitialized(true);
					return;
				}
			} catch (e) {
				console.warn(
					"[MindMoments] Failed to read chat history from IndexedDB:",
					e,
				);
			}

			// Default initial greeting if no history exists
			setMessages([
				{
					id: "welcome-msg",
					role: "assistant",
					content: `Hello! I'm your AI Mind, powered by open-weight models. I have direct context of your **${entries.length} recorded moments**, decisions, and energy rhythms.\n\nWhat would you like to explore or reflect on today?`,
					timestamp: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					provider: "GPT-OSS 120B (Groq)",
				},
			]);
			setIsInitialized(true);
		}

		loadChatFromIDB();
	}, [entries.length]);

	// Persist messages to IndexedDB whenever they change
	useEffect(() => {
		if (!isInitialized) return;
		set(IDB_KEYS.CHAT, messages).catch((e) =>
			console.warn(
				"[MindMoments] Failed to persist chat history to IndexedDB:",
				e,
			),
		);
	}, [messages, isInitialized]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleCopyMessage = async (id: string, text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedId(id);
			toast.success("Message copied to clipboard");
			setTimeout(() => setCopiedId(null), 2000);
		} catch {
			toast.error("Failed to copy text");
		}
	};

	const handleSendMessage = async (textToSend?: string) => {
		const text = (textToSend || input).trim();
		if (!text || isLoading) return;

		const userMessage: Message = {
			id: `user-${Date.now()}`,
			role: "user",
			content: text,
			timestamp: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		const nextHistory = [...messages, userMessage];
		setMessages(nextHistory);
		setInput("");
		setIsLoading(true);

		try {
			// Exclude initial assistant welcome message when sending to backend LLM API
			const apiMessages = nextHistory
				.filter((m, idx) => !(idx === 0 && m.role === "assistant"))
				.map((m) => ({ role: m.role, content: m.content }));

			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					messages: apiMessages,
					entries,
					settings,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				const botMessage: Message = {
					id: `bot-${Date.now()}`,
					role: "assistant",
					content: data.content,
					timestamp: new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
					provider: data.model
						? `${data.model} (${data.provider})`
						: data.provider || "GPT-OSS 120B (Groq)",
				};
				setMessages((prev) => [...prev, botMessage]);
			} else {
				toast.error("Failed to get response from AI Mind");
			}
		} catch (e) {
			console.error("[Chat Error]:", e);
			toast.error("Error connecting to AI chat service");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='h-full w-full max-w-4xl mx-auto flex flex-col min-h-0 overflow-hidden select-text'>
			{/* 1. Chat Area: Scrollable internally without full window scroll */}
			<div className='flex-1 overflow-y-auto custom-scroll space-y-4 pr-1 pb-4 min-h-0'>
				{messages.length === 0 ? (
					/* Empty Chat State with Esvigy Illustration directly on screen */
					<div className='h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto'>
						<WomanYoga
							color='#3B82F6'
							secondaryColor='#3F3F46'
							className='w-48 h-48 mx-auto drop-shadow-sm'
						/>
						<div className='space-y-1.5 max-w-md'>
							<h3 className='text-base font-bold text-on-surface'>
								Chat with your AI Mind
							</h3>
							<p className='text-xs text-on-surface-muted leading-relaxed'>
								Reflect on your life, decisions, and cognitive rhythms.
								Every insight is synthesized directly from your personal
								diary.
							</p>
						</div>

						<div className='grid sm:grid-cols-2 gap-2 w-full max-w-lg pt-2'>
							{SUGGESTED_QUESTIONS.map((q) => (
								<button
									key={q}
									type='button'
									onClick={() => handleSendMessage(q)}
									className='btn-press glass-card text-left text-xs p-3 rounded-xl text-on-surface-variant transition-all hover:border-primary-blue/40'
								>
									{q}
								</button>
							))}
						</div>
					</div>
				) : (
					messages.map((m) => {
						const isUser = m.role === "user";
						const isCopied = copiedId === m.id;

						return (
							<div
								key={m.id}
								className={`flex flex-col group ${isUser ? "items-end" : "items-start"} animate-in fade-in duration-150`}
							>
								<div
									className={`relative rounded-2xl p-4 text-sm leading-relaxed max-w-[95%] sm:max-w-[85%] select-text cursor-text ${
										isUser
											? "bg-primary-blue text-white rounded-tr-xs shadow-md font-medium"
											: "glass-card text-on-surface rounded-tl-xs"
									}`}
								>
									{/* Markdown formatted content with GFM table support */}
									{isUser ? (
										<p className='whitespace-pre-wrap select-text'>
											{m.content}
										</p>
									) : (
										<div className='prose-chat select-text overflow-x-auto'>
											<ReactMarkdown
												remarkPlugins={[remarkGfm]}
												components={{
													table: ({ ...props }) => (
														<div className='overflow-x-auto my-3 rounded-xl border border-border-subtle bg-surface-low/30 backdrop-blur-sm shadow-inner'>
															<table
																className='w-full text-xs text-left border-collapse'
																{...props}
															/>
														</div>
													),
													thead: ({ ...props }) => (
														<thead
															className='bg-surface-low text-on-surface font-semibold border-b border-border-subtle'
															{...props}
														/>
													),
													th: ({ ...props }) => (
														<th
															className='px-3.5 py-2.5 font-semibold text-on-surface text-xs tracking-tight'
															{...props}
														/>
													),
													td: ({ ...props }) => (
														<td
															className='px-3.5 py-2 text-on-surface-variant border-t border-border-subtle/50 text-xs'
															{...props}
														/>
													),
													tr: ({ ...props }) => (
														<tr
															className='hover:bg-primary-blue/5 transition-colors'
															{...props}
														/>
													),
												}}
											>
												{m.content}
											</ReactMarkdown>
										</div>
									)}

									{/* Bottom Message Toolbar (Copy Button & Metadata at Bottom) */}
									<div
										className={`flex items-center justify-between pt-2.5 mt-2 border-t text-[11px] select-none ${
											isUser
												? "border-white/20 text-white/80"
												: "border-border-subtle/50 text-on-surface-muted"
										}`}
									>
										<div className='flex items-center gap-2'>
											<span>{m.timestamp}</span>
											{!isUser && m.provider && (
												<>
													<span>•</span>
													<span className='text-primary-blue font-medium'>
														{m.provider}
													</span>
												</>
											)}
										</div>

										{/* Copy Button at Bottom */}
										<button
											type='button'
											onClick={() =>
												handleCopyMessage(m.id, m.content)
											}
											className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors ${
												isUser
													? "hover:bg-white/20 text-white/90"
													: "hover:bg-surface-low text-on-surface-muted hover:text-on-surface"
											}`}
											title='Copy message to clipboard'
										>
											{isCopied ? (
												<>
													<Check className='w-3.5 h-3.5 text-emerald-400' />
													<span className='text-emerald-400 font-medium'>
														Copied
													</span>
												</>
											) : (
												<>
													<Copy className='w-3.5 h-3.5 opacity-70 group-hover:opacity-100' />
													<span>Copy</span>
												</>
											)}
										</button>
									</div>
								</div>
							</div>
						);
					})
				)}

				{/* Loading Indicator */}
				{isLoading && (
					<div className='flex items-center gap-2 text-xs text-on-surface-muted p-3 rounded-xl glass-card w-fit select-none'>
						<Sparkles className='w-4 h-4 text-primary-blue animate-spin' />
						<span>AI Mind is synthesizing your memories...</span>
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			{/* Suggested chips above input if conversation has messages */}
			{messages.length > 0 && !isLoading && (
				<div className='flex items-center gap-1.5 overflow-x-auto py-1 mb-2 scrollbar-none shrink-0 select-none'>
					{SUGGESTED_QUESTIONS.map((q) => (
						<button
							key={q}
							type='button'
							onClick={() => handleSendMessage(q)}
							className='btn-press text-xs px-2.5 py-1 rounded-full glass-card hover:border-primary-blue/40 text-on-surface-muted hover:text-on-surface shrink-0 transition-colors'
						>
							{q}
						</button>
					))}
				</div>
			)}

			{/* 2. Message Box: Static and pinned at bottom */}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSendMessage();
				}}
				className='shrink-0 relative pt-1'
			>
				<div className='glass-card p-2 flex items-center gap-2 rounded-2xl shadow-lg focus-within:ring-2 focus-within:ring-primary-blue/30 focus-within:border-primary-blue transition-all'>
					<input
						type='text'
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder='Ask your diary a question or reflect on a memory...'
						className='w-full bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-muted/60 focus:ring-0 px-2 py-1 outline-none select-text'
						disabled={isLoading}
					/>
					<button
						type='submit'
						disabled={!input.trim() || isLoading}
						className='btn-press btn-primary p-2 rounded-xl text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-transform active:scale-95 shadow-sm'
						title='Send reflection'
					>
						<ArrowUp className='w-4 h-4' />
					</button>
				</div>
			</form>
		</div>
	);
}
