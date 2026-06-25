"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, TrendingUp, BarChart2, PieChart, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminAnalytics() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [loadingData, setLoadingData] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        revenueHistory: [],
        usersCount: 0,
        booksCount: 0,
        categoryCounts: {},
    });

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                // Fetch admin stats (payments, users count, books count)
                const statsRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/admin`, {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const statsData = await statsRes.json();

                // Fetch all books for category distribution
                const booksRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/books`, {
                    cache: "no-store"
                });
                const booksData = await booksRes.json();

                const { payments = [], usersCount = 0, booksCount = 0 } = statsData;

                // 1. Process Revenue History (group by date last 7 days)
                const revenueMap = {};
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split("T")[0];
                }).reverse();

                last7Days.forEach(date => {
                    revenueMap[date] = 0;
                });

                payments.forEach(p => {
                    const pDate = new Date(p.date).toISOString().split("T")[0];
                    if (revenueMap[pDate] !== undefined) {
                        revenueMap[pDate] += Number(p.amount || 0);
                    }
                });

                const revenueHistory = last7Days.map(date => ({
                    date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    amount: revenueMap[date]
                }));

                // 2. Process Category Distribution
                const categoryCounts = {};
                booksData.forEach(b => {
                    const cat = b.category || "Other";
                    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
                });

                setAnalyticsData({
                    revenueHistory,
                    usersCount,
                    booksCount,
                    categoryCounts,
                });

            } catch (err) {
                console.error("Error loading analytics:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchAnalytics();
    }, [user, isPending, router]);

    if (isPending || loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const { revenueHistory, usersCount, booksCount, categoryCounts } = analyticsData;

    // --- SVG Math for Revenue Area Chart ---
    const chartHeight = 200;
    const chartWidth = 500;
    const padding = 30;
    const graphHeight = chartHeight - padding * 2;
    const graphWidth = chartWidth - padding * 2;

    const maxRevenue = Math.max(...revenueHistory.map(d => d.amount), 10);
    
    // Generate SVG coordinates for Revenue Area Chart
    const points = revenueHistory.map((d, index) => {
        const x = padding + (index / (revenueHistory.length - 1)) * graphWidth;
        const y = padding + graphHeight - (d.amount / maxRevenue) * graphHeight;
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = points.length > 0 
        ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
        : "";

    // --- SVG Math for Category Donut Chart ---
    const donutRadius = 70;
    const donutCircumference = 2 * Math.PI * donutRadius;
    const colors = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"];
    
    const categories = Object.keys(categoryCounts);
    const categoryTotal = Object.values(categoryCounts).reduce((sum, c) => sum + c, 0) || 1;

    let accumulatedPercentage = 0;
    const donutSegments = categories.map((cat, idx) => {
        const count = categoryCounts[cat];
        const percentage = count / categoryTotal;
        const strokeDasharray = `${percentage * donutCircumference} ${donutCircumference}`;
        const strokeDashoffset = -accumulatedPercentage * donutCircumference;
        accumulatedPercentage += percentage;

        return {
            category: cat,
            count,
            percentage,
            strokeDasharray,
            strokeDashoffset,
            color: colors[idx % colors.length]
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                    <ShieldCheck size={28} />
                </span>
                <div>
                    <h1 className="text-3xl font-extrabold text-white">System Analytics</h1>
                    <p className="text-slate-400 mt-1">Real-time statistics and visual insights of the platform.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Revenue Area Chart */}
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-green-400" size={20} />
                            Revenue Trend (Last 7 Days)
                        </h3>
                    </div>
                    <div className="flex justify-center">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-w-lg">
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4"/>
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Grid Lines */}
                            <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
                            <line x1={padding} y1={padding + graphHeight / 2} x2={chartWidth - padding} y2={padding + graphHeight / 2} stroke="rgba(255,255,255,0.05)" />
                            <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.1)" />

                            {/* Area Fill */}
                            {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

                            {/* Line Path */}
                            {linePath && <path d={linePath} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />}

                            {/* Data points */}
                            {points.map((p, idx) => (
                                <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#0D0D0D" stroke="#10B981" strokeWidth="2" />
                            ))}

                            {/* X Axis Labels */}
                            {revenueHistory.map((d, index) => {
                                const x = padding + (index / (revenueHistory.length - 1)) * graphWidth;
                                return (
                                    <text key={index} x={x} y={chartHeight - 10} fill="#64748B" fontSize="9" textAnchor="middle">
                                        {d.date}
                                    </text>
                                );
                            })}
                        </svg>
                    </div>
                </div>

                {/* 2. Donut Pie Chart - Category Distribution */}
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <PieChart className="text-purple-400" size={20} />
                        Category Distribution
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                {donutSegments.map((seg, idx) => (
                                    <circle
                                        key={idx}
                                        cx="100"
                                        cy="100"
                                        r={donutRadius}
                                        fill="transparent"
                                        stroke={seg.color}
                                        strokeWidth="20"
                                        strokeDasharray={seg.strokeDasharray}
                                        strokeDashoffset={seg.strokeDashoffset}
                                        className="transition-all duration-500 hover:opacity-85"
                                    />
                                ))}
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Books</span>
                                <span className="text-2xl font-black text-white">{categoryTotal}</span>
                            </div>
                        </div>

                        {/* Legends */}
                        <div className="space-y-2.5 w-full">
                            {donutSegments.map((seg, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: seg.color }} />
                                        <span className="text-slate-300 font-semibold">{seg.category}</span>
                                    </div>
                                    <span className="text-slate-500 font-mono">
                                        {seg.count} ({Math.round(seg.percentage * 100)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Bar Chart - Users vs Books */}
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl space-y-6 lg:col-span-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart2 className="text-blue-400" size={20} />
                        Users vs Books Ratio
                    </h3>

                    <div className="flex flex-col gap-5 max-w-xl mx-auto py-4">
                        {/* Users Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-semibold">
                                <span className="text-slate-300">Total Users</span>
                                <span className="text-white font-bold">{usersCount} Accounts</span>
                            </div>
                            <div className="w-full h-5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-700" 
                                    style={{ width: `${Math.min((usersCount / (usersCount + booksCount || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Books Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-semibold">
                                <span className="text-slate-300">Total Books</span>
                                <span className="text-white font-bold">{booksCount} Titles</span>
                            </div>
                            <div className="w-full h-5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-700" 
                                    style={{ width: `${Math.min((booksCount / (usersCount + booksCount || 1)) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
