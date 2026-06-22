"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, DollarSign, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminTransactions() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [transactions, setTransactions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }

        const loadTransactions = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const res = await fetch("http://localhost:5000/api/payments/admin", {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const data = await res.json();
                setTransactions(data?.payments || []);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadTransactions();
    }, [user, isPending, router]);

    if (isPending || loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Transaction History</h1>
                <p className="text-slate-400 mt-2">View system-wide payment records and customer transactions.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Name</th>
                                    <th className="pb-4 font-bold">Transaction ID</th>
                                    <th className="pb-4 font-bold">User Email</th>
                                    <th className="pb-4 font-bold">Librarian Email</th>
                                    <th className="pb-4 font-bold">Amount</th>
                                    <th className="pb-4 font-bold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-bold text-white">
                                            {tx.bookTitle}
                                        </td>
                                        <td className="py-4 font-mono text-xs text-slate-500">
                                            {tx.transactionId}
                                        </td>
                                        <td className="py-4 text-sm text-slate-300">
                                            {tx.userEmail}
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {tx.librarianEmail || "Admin / Direct"}
                                        </td>
                                        <td className="py-4 font-bold text-green-400">
                                            ${Number(tx.amount || 0).toFixed(2)}
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {new Date(tx.date).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
