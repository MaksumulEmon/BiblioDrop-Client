"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BookOpen, Wallet, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import UserOverviewChart from "@/Components/UserOverviewChart";

export default function UserOverview() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState({
        totalBooks: 0,
        totalSpent: 0,
        completedDeliveries: 0,
        pendingDeliveries: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        if (user.role !== "reader") {
            router.push(`/dashboard/${user.role === "librarian" ? "librarian" : "admin"}`);
            return;
        }

        const loadStats = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const [paymentsRes, deliveriesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/user`, {
                        headers: { Authorization: `Bearer ${token.token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deliveries/user`, {
                        headers: { Authorization: `Bearer ${token.token}` }
                    })
                ]);

                const payments = await paymentsRes.json();
                const deliveries = await deliveriesRes.json();

                const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
                const completedDeliveries = deliveries.filter(d => d.status === "delivered").length;
                const pendingDeliveries = deliveries.filter(d => d.status === "pending" || d.status === "dispatched").length;

                setStats({
                    totalBooks: payments.length,
                    totalSpent,
                    completedDeliveries,
                    pendingDeliveries,
                });
            } catch (err) {
                console.error("Error loading stats:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadStats();
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
            label: "Total Books Purchased",
            value: stats.totalBooks,
            icon: BookOpen,
            color: "text-purple-400",
            bg: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
            label: "Total Money Spent",
            value: `$${stats.totalSpent.toFixed(2)}`,
            icon: Wallet,
            color: "text-green-400",
            bg: "from-green-500/10 to-emerald-500/10 border-green-500/20",
        },
        {
            label: "Deliveries Completed",
            value: stats.completedDeliveries,
            icon: CheckCircle2,
            color: "text-blue-400",
            bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
        {
            label: "Pending Deliveries",
            value: stats.pendingDeliveries,
            icon: Truck,
            color: "text-yellow-400",
            bg: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white">
                    Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user?.name}</span>
                </h1>
                <p className="text-slate-400 mt-2">
                    Here's a quick overview of your reading activity and delivery history.
                </p>
            </div>

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
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-slate-400">{card.label}</p>
                                <h3 className="text-3xl font-extrabold text-white mt-2">
                                    {card.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <UserOverviewChart stats={stats} />
        </div>
    );
}
