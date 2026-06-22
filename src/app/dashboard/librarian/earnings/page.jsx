"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, DollarSign, Wallet, ArrowUpRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LibrarianEarnings() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [earningsData, setEarningsData] = useState({ payments: [], deliveries: [] });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }

        const loadEarnings = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const res = await fetch("http://localhost:5000/api/payments/librarian", {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const data = await res.json();
                setEarningsData(data || { payments: [], deliveries: [] });
            } catch (err) {
                console.error("Error loading librarian earnings:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadEarnings();
    }, [user, isPending, router]);

    if (isPending || loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    const { payments = [], deliveries = [] } = earningsData;

    // Map delivery statuses to payments
    const deliveryMap = deliveries.reduce((acc, d) => {
        acc[d.transactionId] = d.status;
        return acc;
    }, {});

    // Earnings from delivered books only
    const deliveredPayments = payments.filter(p => deliveryMap[p.transactionId] === "delivered");
    const totalEarnings = deliveredPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Earnings & Transactions</h1>
                <p className="text-slate-400 mt-2">Track your book revenues. Earnings are credited only after successful delivery completion.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative overflow-hidden rounded-3xl p-6 border border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                            <DollarSign className="w-6 h-6 text-green-400" />
                        </div>
                        <span className="text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20 flex items-center gap-1 font-semibold">
                            <TrendingUp size={12} /> Direct Revenue
                        </span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-400">Total Earnings (Delivered)</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">
                            ${totalEarnings.toFixed(2)}
                        </h3>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                            <Wallet className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-slate-400">Delivered Transactions</p>
                        <h3 className="text-3xl font-extrabold text-white mt-2">
                            {deliveredPayments.length} of {payments.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-6">Transaction Logs</h3>
                {payments.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No transaction records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Name</th>
                                    <th className="pb-4 font-bold">Transaction ID</th>
                                    <th className="pb-4 font-bold">Reader Email</th>
                                    <th className="pb-4 font-bold">Amount</th>
                                    <th className="pb-4 font-bold">Delivery Status</th>
                                    <th className="pb-4 font-bold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payments.map((payment) => {
                                    const deliveryStatus = deliveryMap[payment.transactionId] || "unknown";
                                    const isCredited = deliveryStatus === "delivered";

                                    return (
                                        <tr key={payment._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                            <td className="py-4 font-semibold text-white">
                                                {payment.bookTitle}
                                            </td>
                                            <td className="py-4 font-mono text-xs text-slate-500">
                                                {payment.transactionId}
                                            </td>
                                            <td className="py-4 text-sm">
                                                {payment.userEmail}
                                            </td>
                                            <td className={`py-4 font-bold ${isCredited ? "text-green-400" : "text-slate-400"}`}>
                                                ${Number(payment.amount || 0).toFixed(2)}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-0.5 text-xs rounded-full border font-medium uppercase ${
                                                    deliveryStatus === "delivered" 
                                                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                                                        : deliveryStatus === "dispatched"
                                                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                                                }`}>
                                                    {deliveryStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-slate-400">
                                                {new Date(payment.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
