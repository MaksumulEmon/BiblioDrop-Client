"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Users, BookOpen, Truck, DollarSign, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export default function AdminOverview() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        totalBooks: 0,
        totalDeliveries: 0,
        totalRevenue: 0,
    });


    const COLORS = [
        "#8B5CF6",
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#EC4899",
    ];
    const [loadingData, setLoadingData] = useState(true);
    const [categoryData, setCategoryData] = useState([]);

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

        const loadAdminStats = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const res = await fetch("http://localhost:5000/api/payments/admin", {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const data = await res.json();

                const { payments = [], deliveries = [], usersCount = 0, booksCount = 0 } = data;

                const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

                setAdminStats({
                    totalUsers: usersCount,
                    totalBooks: booksCount,
                    totalDeliveries: deliveries.length,
                    totalRevenue,
                });
            } catch (err) {
                console.error("Error loading admin stats:", err);
            } finally {
                setLoadingData(false);
            }



            try {
                const booksRes = await fetch(
                    "http://localhost:5000/admin/books"
                );

                const books = await booksRes.json();

                const categoryCounts = {};

                books.forEach((book) => {
                    const category = book.category || "Other";

                    categoryCounts[category] =
                        (categoryCounts[category] || 0) + 1;
                });

                const chartData = Object.entries(categoryCounts).map(
                    ([name, value]) => ({
                        name,
                        value,
                    })
                );

                setCategoryData(chartData);

            } catch (error) {
                console.error("Category Chart Error:", error);
            }

        };



        loadAdminStats();
    }, [user, isPending, router]);





    if (isPending || loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const cards = [
        {
            label: "Total Users",
            value: adminStats.totalUsers,
            icon: Users,
            color: "text-purple-400",
            bg: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
            label: "Total Books",
            value: adminStats.totalBooks,
            icon: BookOpen,
            color: "text-blue-400",
            bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
        {
            label: "Total Deliveries",
            value: adminStats.totalDeliveries,
            icon: Truck,
            color: "text-yellow-400",
            bg: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20",
        },
        {
            label: "Total Revenue",
            value: `$${adminStats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: "text-green-400",
            bg: "from-green-500/10 to-emerald-500/10 border-green-500/20",
        },
    ];

    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <span className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400">
                    <ShieldCheck size={28} />
                </span>

                <div>
                    <h1 className="text-3xl font-extrabold text-white">
                        Admin Control Center
                    </h1>

                    <p className="text-slate-400 mt-1">
                        Platform overview and core administration metrics.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={idx}
                            className={`relative overflow-hidden rounded-3xl p-6 border bg-gradient-to-br ${card.bg} backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>

                                <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                                    Active
                                </span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-semibold text-slate-400">
                                    {card.label}
                                </p>

                                <h3 className="text-3xl font-extrabold text-white mt-2">
                                    {card.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Books By Category Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Books By Category
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                        Distribution of books across different categories.
                    </p>
                </div>

                {categoryData.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center text-slate-400">
                        No Category Data Found
                    </div>
                ) : (
                    <div className="h-[450px]">

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>

                                <Pie
                                    data={categoryData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    innerRadius={70}
                                    paddingAngle={3}
                                    label={({ name, value }) =>
                                        `${name}: ${value}`
                                    }
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={
                                                COLORS[
                                                index % COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                />

                            </PieChart>
                        </ResponsiveContainer>

                    </div>
                )}
            </div>

        </div>
    );
}