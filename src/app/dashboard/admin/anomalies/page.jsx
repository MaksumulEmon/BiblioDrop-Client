"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    getAdminAnomalies,
    reviewAnomaly,
    seedDemoAnomalies,
    clearDemoAnomalies
} from "@/lib/api/ai";
import {
    AlertTriangle,
    ShieldAlert,
    Sparkles,
    CheckCircle2,
    Clock,
    User,
    Truck,
    CreditCard,
    XCircle,
    RefreshCw,
    Loader2,
    Search,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    HelpCircle,
    SlidersHorizontal,
    Info,
    Check,
    MessageSquare,
    X
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminAnomaliesPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [anomalies, setAnomalies] = useState([]);
    const [summary, setSummary] = useState({
        totalFlagged: 0,
        highSeverityCount: 0,
        pendingReviewCount: 0,
        reviewedCount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [seeding, setSeeding] = useState(false);

    // Filters
    const [activeFilter, setActiveFilter] = useState("all"); // all, pending, high, reviewed
    const [searchQuery, setSearchQuery] = useState("");

    // Modal / Drawer state for Timeline
    const [activeUserTimeline, setActiveUserTimeline] = useState(null);

    // Modal state for Admin Note
    const [reviewingUser, setReviewingUser] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const loadData = async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) setRefreshing(true);
            else setLoading(true);

            const { data: token } = await authClient.token();
            if (!token?.token) return;

            const res = await getAdminAnomalies(token.token);
            if (res.success) {
                setAnomalies(res.anomalies || []);
                setSummary(res.summary || {
                    totalFlagged: 0,
                    highSeverityCount: 0,
                    pendingReviewCount: 0,
                    reviewedCount: 0,
                });
                if (isManualRefresh) {
                    toast.success("Anomaly radar synchronized with latest transactions");
                }
            }
        } catch (err) {
            console.error("Error loading anomalies:", err);
            toast.error("Failed to load anomaly data: " + err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        if (user.role !== "admin") {
            router.push(`/dashboard/${user.role === "reader" ? "user" : "librarian"}`);
            return;
        }
        loadData();
    }, [user, isPending, router]);

    // Handle Seed Demo Data
    const handleSeedDemo = async () => {
        try {
            setSeeding(true);
            const { data: token } = await authClient.token();
            if (!token?.token) return;

            await seedDemoAnomalies(token.token);
            toast.success("✨ 2 Demo Anomaly cases seeded successfully!");
            await loadData(true);
        } catch (err) {
            toast.error("Failed to seed demo data: " + err.message);
        } finally {
            setSeeding(false);
        }
    };

    // Handle Clear Demo Data
    const handleClearDemo = async () => {
        try {
            setSeeding(true);
            const { data: token } = await authClient.token();
            if (!token?.token) return;

            await clearDemoAnomalies(token.token);
            toast.success("Demo cases cleared.");
            await loadData(true);
        } catch (err) {
            toast.error("Failed to clear demo data: " + err.message);
        } finally {
            setSeeding(false);
        }
    };

    // Handle Review Submit
    const handleConfirmReview = async () => {
        if (!reviewingUser) return;
        try {
            setSubmittingReview(true);
            const { data: token } = await authClient.token();
            if (!token?.token) return;

            const res = await reviewAnomaly(
                token.token,
                reviewingUser.userId,
                "Reviewed",
                adminNote
            );

            if (res.success) {
                toast.success(`Activity for ${reviewingUser.userName} marked as Reviewed`);
                setAnomalies(prev =>
                    prev.map(a =>
                        a.userId === reviewingUser.userId
                            ? {
                                  ...a,
                                  reviewStatus: "Reviewed",
                                  reviewedBy: user.email,
                                  reviewedAt: new Date().toISOString(),
                                  adminNote: adminNote
                              }
                            : a
                    )
                );
                setSummary(prev => ({
                    ...prev,
                    pendingReviewCount: Math.max(0, prev.pendingReviewCount - 1),
                    reviewedCount: prev.reviewedCount + 1,
                }));
                setReviewingUser(null);
                setAdminNote("");
            }
        } catch (err) {
            toast.error("Failed to review anomaly: " + err.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    // Filtered anomalies
    const filteredAnomalies = anomalies.filter(item => {
        // Status filter
        if (activeFilter === "pending" && item.reviewStatus !== "Pending Review") return false;
        if (activeFilter === "reviewed" && item.reviewStatus !== "Reviewed") return false;
        if (activeFilter === "high" && item.aiAnalysis?.severity !== "High") return false;

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesName = (item.userName || "").toLowerCase().includes(q);
            const matchesEmail = (item.userEmail || "").toLowerCase().includes(q);
            const matchesPattern = (item.aiAnalysis?.detectedPattern || "").toLowerCase().includes(q);
            return matchesName || matchesEmail || matchesPattern;
        }

        return true;
    });

    const getSeverityBadge = (severity) => {
        switch (severity) {
            case "High":
                return "bg-rose-500/10 border-rose-500/30 text-rose-400";
            case "Medium":
                return "bg-amber-500/10 border-amber-500/30 text-amber-400";
            case "Low":
            default:
                return "bg-blue-500/10 border-blue-500/30 text-blue-400";
        }
    };

    if (isPending || loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-2xl text-purple-400 shadow-lg shadow-purple-500/10 shrink-0">
                        <ShieldAlert className="w-5 h-5 sm:w-7 sm:h-7" />
                    </span>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                                AI Order Anomaly Detection
                            </h1>
                            <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                Gemini 1.5
                            </span>
                        </div>
                        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                            Automated detection of daily order limits, repeated cancellations, and checkout payment failures.
                        </p>
                    </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
                        title="Re-run anomaly scan"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-purple-400" : ""}`} />
                        Sync Radar
                    </button>

                    <button
                        onClick={handleSeedDemo}
                        disabled={seeding}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        title="Generate sample anomalous users for evaluation/demo"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Seed Demo Cases
                    </button>

                    <button
                        onClick={handleClearDemo}
                        disabled={seeding}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-rose-950/30 border border-slate-700 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 text-xs transition"
                        title="Remove demo user records"
                    >
                        Clear Demo
                    </button>
                </div>
            </div>

            {/* Non-punitive Policy Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-500/20 flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-slate-300">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                    <span className="font-semibold text-purple-200">BiblioDrop Administrative Review Standard: </span>
                    Unusual activities flagged by deterministic rules (e.g., daily order cap reached, $\ge 2$ cancellations, $\ge 2$ failed payments) are analyzed by Gemini AI to help administrators understand behavior patterns.
                    <strong className="text-white"> Users are never automatically banned or permanently blocked.</strong>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Total Flagged Users</span>
                        <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1 sm:mt-2">
                        {summary.totalFlagged}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Requiring attention</div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-rose-500/20 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-rose-300">High Risk Patterns</span>
                        <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-rose-400 mt-1 sm:mt-2">
                        {summary.highSeverityCount}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Multi-pattern volatility</div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-amber-500/20 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-amber-300">Pending Review</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 mt-1 sm:mt-2">
                        {summary.pendingReviewCount}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Awaiting assessment</div>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-emerald-500/20 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-semibold text-emerald-300">Reviewed Cases</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400 mt-1 sm:mt-2">
                        {summary.reviewedCount}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">Archived & confirmed</div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    {[
                        { key: "all", label: "All Anomalies" },
                        { key: "pending", label: `Pending (${summary.pendingReviewCount})` },
                        { key: "high", label: `High Severity (${summary.highSeverityCount})` },
                        { key: "reviewed", label: `Reviewed (${summary.reviewedCount})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                                activeFilter === tab.key
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search user, email or pattern..."
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Anomalies List */}
            {filteredAnomalies.length === 0 ? (
                <div className="p-12 text-center rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl">
                    <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">No Order Anomalies Detected</h3>
                    <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
                        All users are operating within standard parameters (under 2 orders/day, zero repeated cancellations or failed checkouts).
                    </p>
                    <button
                        onClick={handleSeedDemo}
                        disabled={seeding}
                        className="mt-4 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition inline-flex items-center gap-2"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Seed 2 Demo Anomalies for Presentation
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredAnomalies.map((item) => {
                        const { aiAnalysis = {}, triggers = {} } = item;
                        return (
                            <div
                                key={item.userId}
                                className={`rounded-3xl border p-6 md:p-7 backdrop-blur-xl transition-all duration-300 ${
                                    aiAnalysis.severity === "High"
                                        ? "bg-slate-900/80 border-rose-500/30 shadow-[0_10px_40px_rgba(244,63,94,0.08)]"
                                        : "bg-slate-900/60 border-white/10"
                                }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                                    {/* User Meta & Trigger Pills */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center justify-between sm:justify-start gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-purple-500/20">
                                                    {(item.userName || "U")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                        {item.userName}
                                                        {item.userId.startsWith("demo_user") && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                                DEMO
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p className="text-xs text-slate-400">{item.userEmail}</p>
                                                </div>
                                            </div>

                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border sm:ml-auto ${getSeverityBadge(aiAnalysis.severity)}`}>
                                                {aiAnalysis.severity || "Medium"} Severity
                                            </span>
                                        </div>

                                        {/* Trigger Metrics Badges */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                            {/* Rule 1: Orders Today */}
                                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                                                item.ordersToday >= 2
                                                    ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold"
                                                    : "bg-slate-800 text-slate-400 border-slate-700"
                                            }`}>
                                                <Truck className="w-3.5 h-3.5" />
                                                {item.ordersToday} Orders Today {item.ordersToday >= 2 ? "(Cap Reached)" : ""}
                                            </span>

                                            {/* Rule 2: Cancellations */}
                                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                                                item.cancellations >= 2
                                                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                                                    : "bg-slate-800 text-slate-400 border-slate-700"
                                            }`}>
                                                <XCircle className="w-3.5 h-3.5" />
                                                {item.cancellations} Cancellations {item.cancellations >= 2 ? "(Threshold \u22652)" : ""}
                                            </span>

                                            {/* Rule 3: Failed Payments */}
                                            <span className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                                                item.failedPayments >= 2
                                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                                                    : "bg-slate-800 text-slate-400 border-slate-700"
                                            }`}>
                                                <CreditCard className="w-3.5 h-3.5" />
                                                {item.failedPayments} Failed / Cancelled Payments {item.failedPayments >= 2 ? "(Threshold \u22652)" : ""}
                                            </span>
                                        </div>

                                        {/* AI Pattern Explanation Card */}
                                        <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border border-purple-500/30 relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                                                    <span className="text-xs font-bold text-purple-200">
                                                        AI Pattern Analysis: {aiAnalysis.detectedPattern || "Unusual Activity"}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    {aiAnalysis.analyzedBy || "Gemini 1.5"}
                                                </span>
                                            </div>

                                            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                                "{aiAnalysis.explanation}"
                                            </p>

                                            {aiAnalysis.recommendation && (
                                                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-start gap-2 text-xs text-purple-300">
                                                    <strong className="shrink-0 text-purple-200">Recommended Action:</strong>
                                                    <span>{aiAnalysis.recommendation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Review Status & Actions Sidebar inside card */}
                                    <div className="lg:w-64 shrink-0 flex flex-col justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/5">
                                        <div>
                                            <div className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                                                Review Status
                                            </div>
                                            {item.reviewStatus === "Reviewed" ? (
                                                <div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                        <Check className="w-3.5 h-3.5" />
                                                        Reviewed
                                                    </span>
                                                    <p className="text-[11px] text-slate-500 mt-2">
                                                        By {item.reviewedBy || "Admin"}
                                                    </p>
                                                    {item.adminNote && (
                                                        <p className="text-xs text-slate-400 italic mt-1 bg-slate-900/80 p-2 rounded-lg border border-white/5">
                                                            "{item.adminNote}"
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Pending Review
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-white/5">
                                            {/* Button: Mark as Reviewed */}
                                            {item.reviewStatus !== "Reviewed" ? (
                                                <button
                                                    onClick={() => setReviewingUser(item)}
                                                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                                                >
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Review & Add Note
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setReviewingUser(item)}
                                                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    Update Note
                                                </button>
                                            )}

                                            {/* Button: View Activity Timeline */}
                                            <button
                                                onClick={() => setActiveUserTimeline(item)}
                                                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                                            >
                                                <Clock className="w-3.5 h-3.5 text-purple-400" />
                                                View Timeline ({item.timeline?.length || 0})
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Timeline Inspection Modal */}
            {activeUserTimeline && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    Activity Timeline: {activeUserTimeline.userName}
                                </h3>
                                <p className="text-xs text-slate-400">{activeUserTimeline.userEmail}</p>
                            </div>
                            <button
                                onClick={() => setActiveUserTimeline(null)}
                                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Timeline Events */}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                            {(!activeUserTimeline.timeline || activeUserTimeline.timeline.length === 0) ? (
                                <p className="text-xs text-slate-500 py-6 text-center">No recent logged interactions</p>
                            ) : (
                                activeUserTimeline.timeline.map((evt, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 flex items-start gap-3 text-xs"
                                    >
                                        <div className={`p-2 rounded-xl shrink-0 ${
                                            evt.type === "ORDER_CANCELLED"
                                                ? "bg-rose-500/10 text-rose-400"
                                                : evt.type === "PAYMENT_FAILED"
                                                    ? "bg-amber-500/10 text-amber-400"
                                                    : "bg-purple-500/10 text-purple-400"
                                        }`}>
                                            {evt.type === "ORDER_CANCELLED" ? (
                                                <XCircle className="w-4 h-4" />
                                            ) : evt.type === "PAYMENT_FAILED" ? (
                                                <CreditCard className="w-4 h-4" />
                                            ) : (
                                                <Truck className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <strong className="text-white font-semibold">{evt.title}</strong>
                                                <span className="text-[11px] text-slate-500">
                                                    {new Date(evt.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                </span>
                                            </div>
                                            <p className="text-slate-300 mt-1">{evt.desc}</p>
                                            {evt.fee ? (
                                                <span className="inline-block text-[11px] font-mono text-purple-300 mt-1">
                                                    Fee: ${evt.fee}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="pt-3 border-t border-white/10 text-right">
                            <button
                                onClick={() => setActiveUserTimeline(null)}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Note / Review Modal */}
            {reviewingUser && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div>
                            <h3 className="text-lg font-bold text-white">Review Activity Confirmation</h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Log an administrative audit record for {reviewingUser.userName}.
                            </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-xs text-slate-300">
                            <strong>Pattern: </strong>{reviewingUser.aiAnalysis?.detectedPattern}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Admin Review Note (Optional):
                            </label>
                            <textarea
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="E.g., Verified customer phone number; confirmed order intent..."
                                rows={3}
                                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                onClick={() => setReviewingUser(null)}
                                disabled={submittingReview}
                                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmReview}
                                disabled={submittingReview}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-purple-500/20 disabled:opacity-50"
                            >
                                {submittingReview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                Confirm Reviewed
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
