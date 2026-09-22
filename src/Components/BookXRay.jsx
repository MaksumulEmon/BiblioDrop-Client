"use client";

import React, { useState, useEffect, useRef } from "react";
import { getBookXRay, askBookQA } from "@/lib/api/ai";
import {
    Sparkles,
    Volume2,
    VolumeX,
    Play,
    Pause,
    RotateCcw,
    BookOpen,
    Clock,
    Users,
    CheckCircle2,
    MessageSquare,
    Send,
    HelpCircle,
    Loader2,
    Flame,
    Zap,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";

export const BookXRay = ({ bookId, book }) => {
    const [xray, setXray] = useState(null);
    const [loadingXray, setLoadingXray] = useState(true);
    const [xrayError, setXrayError] = useState(null);

    // Audio Narrator State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showScript, setShowScript] = useState(false);
    const utteranceRef = useRef(null);

    // Q&A State
    const [question, setQuestion] = useState("");
    const [asking, setAsking] = useState(false);
    const [qaList, setQaList] = useState([]);

    const suggestedQuestions = [
        "Is this book beginner-friendly?",
        "What is the overall tone and writing style?",
        "What makes this book worth reading?",
        "How fast-paced is the story or content?"
    ];

    // Fetch Book X-Ray on component mount
    useEffect(() => {
        let isMounted = true;
        const fetchXRay = async () => {
            if (!bookId) return;
            setLoadingXray(true);
            setXrayError(null);
            try {
                const data = await getBookXRay(bookId);
                if (isMounted && data.success && data.xray) {
                    setXray(data.xray);
                }
            } catch (err) {
                console.error("Failed to load X-Ray:", err);
                if (isMounted) setXrayError("Unable to load AI dossier. Click retry.");
            } finally {
                if (isMounted) setLoadingXray(false);
            }
        };

        fetchXRay();

        return () => {
            isMounted = false;
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [bookId]);

    // Handle Audio Narration
    const startAudio = () => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            toast.error("Speech Synthesis is not supported in this browser.");
            return;
        }

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        window.speechSynthesis.cancel();

        const textToRead = xray?.audioScript || `${book?.title} by ${book?.author}. ${book?.description || ""}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = playbackRate;
        utterance.pitch = 1.0;

        // Try to pick an English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Zira") || v.name.includes("Samantha"))) || voices.find(v => v.lang.startsWith("en"));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const pauseAudio = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsPlaying(false);
        }
    };

    const stopAudio = () => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    const togglePlaybackRate = () => {
        const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
        setPlaybackRate(nextRate);
        if (isPlaying) {
            // Restart with new rate
            stopAudio();
            setTimeout(() => {
                startAudio();
            }, 100);
        }
    };

    // Handle Asking Question
    const handleAsk = async (textToSend) => {
        const query = (textToSend || question).trim();
        if (!query || asking) return;

        setAsking(true);
        try {
            const res = await askBookQA(bookId, query);
            if (res.success && res.answer) {
                setQaList(prev => [
                    ...prev,
                    { question: query, answer: res.answer, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                ]);
                setQuestion("");
            }
        } catch (err) {
            toast.error("Could not fetch answer right now. Please try again.");
        } finally {
            setAsking(false);
        }
    };

    // Reading level color helper
    const getLevelBadge = (level) => {
        const l = (level || "").toLowerCase();
        if (l.includes("beginner")) {
            return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
        }
        if (l.includes("advanced")) {
            return "bg-rose-500/10 border-rose-500/30 text-rose-400";
        }
        return "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
    };

    return (
        <section className="mt-8 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
            {/* Background subtle neon glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Badge */}
            <div className="relative flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                AI Book X-Ray & Voice Intelligence
                            </h2>
                            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                Gemini 1.5
                            </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                            Interactive reader dossier, 60-second audio teaser, and instant book Q&A
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Live Intelligence
                    </span>
                </div>
            </div>

            {loadingXray ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                    <p className="text-sm font-medium">Synthesizing Book X-Ray with Gemini AI...</p>
                </div>
            ) : xrayError ? (
                <div className="py-12 text-center text-slate-400">
                    <p className="text-sm mb-3">{xrayError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition"
                    >
                        Retry Analysis
                    </button>
                </div>
            ) : (
                <div className="relative mt-6 space-y-8">
                    {/* 1. Voice Audio Previewer Bar */}
                    <div className="relative rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-indigo-950/40 p-5 backdrop-blur-md">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                {/* Play/Pause Button */}
                                {!isPlaying ? (
                                    <button
                                        onClick={startAudio}
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 transition hover:scale-105 active:scale-95"
                                        title="Play 60s AI Audio Preview"
                                    >
                                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={pauseAudio}
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transition hover:scale-105 active:scale-95"
                                        title="Pause Audio"
                                    >
                                        <Pause className="w-5 h-5 fill-white" />
                                    </button>
                                )}

                                <div>
                                    <div className="flex items-center gap-2">
                                        <Volume2 className="w-4 h-4 text-violet-400" />
                                        <h4 className="text-sm font-bold text-white">
                                            {isPlaying ? "Narrating 60-Second Audio Teaser" : isPaused ? "Preview Paused" : "Listen to 60s AI Audio Preview"}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Synthesized reader overview & narrative hook narrated by browser voice
                                    </p>
                                </div>
                            </div>

                            {/* Equalizer & Audio Controls */}
                            <div className="flex items-center gap-4 self-end md:self-center">
                                {/* Equalizer Bars */}
                                <div className="flex items-end gap-1 h-7 px-3 py-1 bg-black/40 rounded-xl border border-white/5">
                                    {[35, 75, 45, 95, 60, 85, 40, 70, 50].map((h, i) => (
                                        <span
                                            key={i}
                                            className={`w-1 rounded-full transition-all duration-300 ${
                                                isPlaying
                                                    ? "bg-violet-400 animate-pulse"
                                                    : "bg-slate-700"
                                            }`}
                                            style={{
                                                height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : "25%",
                                                animationDuration: `${0.4 + (i % 4) * 0.2}s`
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Speed Control */}
                                <button
                                    onClick={togglePlaybackRate}
                                    className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition"
                                    title="Change voice speed"
                                >
                                    {playbackRate}x
                                </button>

                                {/* Stop Button */}
                                {(isPlaying || isPaused) && (
                                    <button
                                        onClick={stopAudio}
                                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition"
                                        title="Stop playback"
                                    >
                                        <VolumeX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Collapsible Narration Script */}
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <button
                                onClick={() => setShowScript(!showScript)}
                                className="text-xs text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition"
                            >
                                {showScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                {showScript ? "Hide Audio Narration Script" : "View Audio Narration Script"}
                            </button>

                            {showScript && (
                                <p className="mt-2 text-xs md:text-sm text-slate-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5 font-mono">
                                    "{xray.audioScript}"
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 2. Reading Dossier: Metrics & Audience */}
                    <div className="grid sm:grid-cols-3 gap-4">
                        {/* Reading Level */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                <BookOpen className="w-4 h-4 text-violet-400" />
                                <span>Reading Level</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getLevelBadge(xray.readingLevel)}`}>
                                {xray.readingLevel || "Intermediate"}
                            </span>
                        </div>

                        {/* Estimated Reading Time */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                <span>Estimated Reading Time</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {xray.readingTime || "4 - 6 Hours"}
                            </div>
                        </div>

                        {/* Best For / Target Audience */}
                        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:col-span-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                <Users className="w-4 h-4 text-pink-400" />
                                <span>Ideal Reader</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                                {xray.targetAudience || "Readers interested in exploring this topic."}
                            </p>
                        </div>
                    </div>

                    {/* Key Takeaways */}
                    {xray.keyTakeaways && xray.keyTakeaways.length > 0 && (
                        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                3 Key Takeaways & Core Concepts
                            </h3>
                            <div className="grid md:grid-cols-3 gap-3">
                                {xray.keyTakeaways.map((takeaway, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/50 border border-white/5"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {takeaway}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mood / Vibe Tags */}
                    {xray.moodTags && xray.moodTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-amber-400" /> Vibe:
                            </span>
                            {xray.moodTags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 3. Interactive "Ask This Book" Q&A Assistant */}
                    <div className="rounded-2xl border border-violet-500/20 bg-slate-950/60 p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="w-4 h-4 text-violet-400" />
                            <h3 className="text-sm font-bold text-white">
                                Ask This Book (AI Q&A)
                            </h3>
                            <span className="text-xs text-slate-500">
                                • Ask anything about content, suitability, or tone before ordering
                            </span>
                        </div>

                        {/* Suggested Query Chips */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {suggestedQuestions.map((q, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleAsk(q)}
                                    disabled={asking}
                                    className="text-xs px-3 py-1.5 rounded-full bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/20 text-violet-300 transition text-left disabled:opacity-50"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Conversational Answers Stream */}
                        {qaList.length > 0 && (
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                                {qaList.map((item, idx) => (
                                    <div key={idx} className="space-y-2 p-3 rounded-xl bg-slate-900/80 border border-white/5">
                                        <div className="flex items-center justify-between text-xs text-slate-400">
                                            <span className="font-semibold text-slate-200">You asked: "{item.question}"</span>
                                            <span>{item.timestamp}</span>
                                        </div>
                                        <div className="flex items-start gap-2 pt-1 text-xs md:text-sm text-slate-300">
                                            <Sparkles className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                                            <p className="leading-relaxed">{item.answer}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input Box */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAsk();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="E.g. Is this book too technical? Does it have practical exercises?..."
                                className="flex-1 bg-slate-900 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none transition"
                                disabled={asking}
                            />
                            <button
                                type="submit"
                                disabled={!question.trim() || asking}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs md:text-sm font-semibold flex items-center gap-1.5 transition shadow-lg shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                            >
                                {asking ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Thinking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Ask</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
};
