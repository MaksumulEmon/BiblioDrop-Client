"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { BookOpen, CheckCircle, Clock, DollarSign, Truck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LibrarianOverviewChart from "@/Components/LibrarianOverviewChart";

export default function LibrarianOverview() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [stats, setStats] = useState({
        totalBooks: 0,
        publishedBooks: 0,
        pendingBooks: 0,
        totalEarnings: 0,
        totalDeliveries: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        if (user.role !== "librarian") {
            router.push(`/dashboard/${user.role === "reader" ? "user" : "admin"}`);
            return;
        }

        const loadLibrarianStats = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const [booksRes, paymentsRes] = await Promise.all([
                    fetch("http://localhost:5000/api/books/librarian", {
                        headers: { Authorization: `Bearer ${token.token}` }
                    }),
                    fetch("http://localhost:5000/api/payments/librarian", {
                        headers: { Authorization: `Bearer ${token.token}` }
                    })
                ]);

                const books = await booksRes.json();
                const { payments, deliveries } = await paymentsRes.json();

                const totalBooks = books.length;
                const publishedBooks = books.filter(b => b.status === "published").length;
                const pendingBooks = books.filter(b => b.status === "pending" || b.status === "pending_approval").length;

                // Revenue from delivered books only
                const deliveredPaymentTxIds = (deliveries || [])
                    .filter(d => d.status === "delivered")
                    .map(d => d.transactionId);

                const totalEarnings = (payments || [])
                    .filter(p => deliveredPaymentTxIds.includes(p.transactionId))
                    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

                setStats({
                    totalBooks,
                    publishedBooks,
                    pendingBooks,
                    totalEarnings,
                    totalDeliveries: (deliveries || []).length,
                });
            } catch (err) {
                console.error("Error loading librarian stats:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadLibrarianStats();
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
            label: "Total Books Added",
            value: stats.totalBooks,
            icon: BookOpen,
            color: "text-purple-400",
            bg: "from-purple-500/10 to-indigo-500/10 border-purple-500/20",
        },
        {
            label: "Published Books",
            value: stats.publishedBooks,
            icon: CheckCircle,
            color: "text-green-400",
            bg: "from-green-500/10 to-emerald-500/10 border-green-500/20",
        },
        {
            label: "Pending Approval",
            value: stats.pendingBooks,
            icon: Clock,
            color: "text-yellow-400",
            bg: "from-yellow-500/10 to-amber-500/10 border-yellow-500/20",
        },
        {
            label: "Total Earnings",
            value: `$${stats.totalEarnings.toFixed(2)}`,
            icon: DollarSign,
            color: "text-emerald-400",
            bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        },
        {
            label: "Total Deliveries",
            value: stats.totalDeliveries,
            icon: Truck,
            color: "text-blue-400",
            bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white">
                    Librarian Dashboard
                </h1>
                <p className="text-slate-400 mt-2">
                    Overview of books, publishing queue, earnings, and delivery stats.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={idx}
                            className={`relative overflow-hidden rounded-3xl p-5 border bg-gradient-to-br ${card.bg} backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                                    <Icon className={`w-5 h-5 ${card.color}`} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs font-semibold text-slate-400">{card.label}</p>
                                <h3 className="text-2xl font-extrabold text-white mt-1">
                                    {card.value}
                                </h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <LibrarianOverviewChart stats={stats} />
        </div>
    );
}
