"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Bot,
    X,
    Send,
    RotateCcw,
    BookOpen,
    Truck,
    ArrowRight,
    Loader2,
    MessageSquare,
    Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { askBiblioBot } from "@/lib/api/ai";

const QUICK_PROMPTS = [
    { label: "🚚 Range ($2 - $6)", prompt: "Show me books with delivery fee between $2 and $6." },
    { label: "💰 Low Delivery Fee", prompt: "What are the best books with the lowest delivery fee?" },
    { label: "⚡ Quick Read", prompt: "Recommend a gripping, fast-paced book for a quick read." },
    { label: "🔍 Thrill & Mystery", prompt: "Find me the best mystery or thriller available in your library." },
    { label: "🧠 Self Growth", prompt: "Suggest an inspiring book for personal development and productivity." },
];

export default function BiblioBot() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hello! I'm **BiblioBot**, your AI library concierge. Tell me what kind of book you're in the mood for, your favorite themes, or ask for books with low delivery fees!",
            books: [],
            followUps: [
                "Recommend an exciting fiction book",
                "Books with lowest delivery fee",
                "Suggest something for self-improvement",
            ],
        },
    ]);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen, loading]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Do not show on dashboard pages to prevent UI clutter
    if (pathname && pathname.includes("/dashboard")) {
        return null;
    }

    const handleSend = async (messageText) => {
        const query = (messageText || input).trim();
        if (!query || loading) return;

        setInput("");

        // Append user message
        const newMessages = [...messages, { role: "user", text: query }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const data = await askBiblioBot(query);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data.reply || "Here are recommendations based on your request!",
                    books: data.books || [],
                    followUps: data.suggestedFollowUps || [],
                },
            ]);
        } catch (err) {
            console.error("BiblioBot error:", err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "I had a momentary glitch reaching the library index, but our book catalog is still available. Feel free to ask again or browse directly!",
                    books: [],
                    followUps: ["Fiction books", "Lowest delivery fee", "Browse all books"],
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([
            {
                role: "assistant",
                text: "Chat cleared! How can I assist your reading journey today?",
                books: [],
                followUps: [
                    "Recommend an exciting fiction book",
                    "Books with lowest delivery fee",
                    "Suggest something for self-improvement",
                ],
            },
        ]);
    };

    const handleBookClick = (bookId) => {
        setIsOpen(false);
        router.push(`/all-books/${bookId}`);
    };

    return (
        <>
            {/* Floating Launcher Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-[0_10px_35px_rgba(99,102,241,0.45)] border border-white/20 backdrop-blur-xl transition-all"
                    aria-label="Open BiblioBot AI Book Concierge"
                >
                    {/* Glowing pulse ring */}
                    <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity" />

                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                        {isOpen ? <X size={18} /> : <Sparkles size={18} className="text-yellow-300 animate-pulse" />}
                    </div>

                    <span className="relative text-sm font-bold tracking-wide hidden sm:inline">
                        {isOpen ? "Close BiblioBot" : "Ask BiblioBot AI"}
                    </span>

                    {!isOpen && (
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                    )}
                </motion.button>
            </div>

            {/* Chat Modal / Popover */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 25, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[440px] h-[640px] max-h-[82vh] bg-[#0A0A0F]/95 border border-white/15 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative px-5 py-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                            {/* Background ambient glow */}
                            <div className="absolute top-0 left-1/4 w-36 h-12 bg-blue-500/20 blur-2xl rounded-full pointer-events-none" />
                            <div className="absolute top-0 right-1/4 w-36 h-12 bg-purple-500/20 blur-2xl rounded-full pointer-events-none" />

                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/25 border border-white/20">
                                    <Bot size={22} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-bold text-base leading-tight">BiblioBot</h3>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-purple-500/30 text-purple-300">
                                            AI Concierge
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        Online • Context-Aware
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center gap-1">
                                <button
                                    onClick={handleReset}
                                    title="Reset conversation"
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    title="Close"
                                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Mood Chips Bar */}
                        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2">
                            {QUICK_PROMPTS.map((item, idx) => (
                                <button
                                    key={idx}
                                    disabled={loading}
                                    onClick={() => handleSend(item.prompt)}
                                    className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-purple-500/20 text-slate-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/30 transition duration-200 disabled:opacity-50 shrink-0"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scroll-smooth">
                            {messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                                    >
                                        <div
                                            className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                                                isUser
                                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-purple-500/15"
                                                    : "bg-slate-900/90 border border-white/10 text-slate-200 shadow-sm"
                                            }`}
                                        >
                                            <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                                            {/* Render Recommended Books Cards */}
                                            {msg.books && msg.books.length > 0 && (
                                                <div className="mt-3.5 space-y-2.5 pt-2.5 border-t border-white/10">
                                                    <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                                                        <BookOpen size={13} />
                                                        Available on Bibliodrop:
                                                    </p>
                                                    <div className="space-y-2">
                                                        {msg.books.map((book) => (
                                                            <div
                                                                key={book._id || book.id}
                                                                onClick={() => handleBookClick(book._id || book.id)}
                                                                className="group flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-white/10 hover:border-purple-500/50 hover:bg-slate-900 transition-all cursor-pointer shadow-sm"
                                                            >
                                                                {/* Cover Thumbnail */}
                                                                <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                                                                    {book.image ? (
                                                                        <Image
                                                                            src={book.image}
                                                                            alt={book.title || "Book"}
                                                                            fill
                                                                            className="object-cover group-hover:scale-105 transition"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                                            <BookOpen size={18} />
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Book Metadata */}
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-white text-xs font-bold truncate group-hover:text-purple-300 transition">
                                                                        {book.title}
                                                                    </h4>
                                                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                                        {book.author ? `by ${book.author}` : book.category}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-1.5">
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-300 font-medium border border-violet-500/20">
                                                                            {book.category}
                                                                        </span>
                                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-300 font-medium flex items-center gap-1 border border-green-500/20">
                                                                            <Truck size={10} />
                                                                            ${book.deliveryFee ?? 0}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Action Arrow */}
                                                                <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-purple-600 text-slate-400 group-hover:text-white transition shrink-0">
                                                                    <ArrowRight size={14} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Suggested follow-up prompt pills */}
                                        {!isUser && msg.followUps && msg.followUps.length > 0 && index === messages.length - 1 && (
                                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                {msg.followUps.map((promptText, i) => (
                                                    <button
                                                        key={i}
                                                        disabled={loading}
                                                        onClick={() => handleSend(promptText)}
                                                        className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-purple-200 transition text-left"
                                                    >
                                                        ✨ {promptText}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Typing / Loading indicator */}
                            {loading && (
                                <div className="flex items-start gap-2 text-slate-400">
                                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center gap-2.5 text-xs">
                                        <Loader2 size={16} className="animate-spin text-purple-400" />
                                        <span className="animate-pulse">BiblioBot is browsing the library shelves...</span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Footer */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="p-3 bg-slate-900/90 border-t border-white/10"
                        >
                            <div className="relative flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for genres, moods, low delivery fees..."
                                    disabled={loading}
                                    className="w-full bg-black/50 border border-white/15 rounded-2xl pl-4 pr-12 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                />

                                <button
                                    type="submit"
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition"
                                    aria-label="Send message"
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 text-center mt-2">
                                Powered by Google Gemini AI & Bibliodrop Real-Time Catalog
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
