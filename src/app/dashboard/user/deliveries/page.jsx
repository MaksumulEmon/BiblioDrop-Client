"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Truck, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDeliveries() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [deliveries, setDeliveries] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }

        const loadDeliveries = async () => {
            try {
                const { data: token } = await authClient.token();
                if (!token) return;

                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deliveries/user`, {
                    headers: { Authorization: `Bearer ${token.token}` }
                });
                const data = await res.json();
                setDeliveries(data || []);
            } catch (err) {
                console.error("Error loading deliveries:", err);
            } finally {
                setLoadingData(false);
            }
        };

        loadDeliveries();
    }, [user, isPending, router]);

    const statusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
            case "dispatched":
                return "bg-blue-500/10 border-blue-500/20 text-blue-400";
            case "delivered":
                return "bg-green-500/10 border-green-500/20 text-green-400";
            default:
                return "bg-slate-500/10 border-slate-500/20 text-slate-400";
        }
    };

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
                <h1 className="text-3xl font-extrabold text-white">Delivery History</h1>
                <p className="text-slate-400 mt-2">Track the dispatch and delivery status of your purchased books.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {deliveries.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Truck size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No delivery requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Name</th>
                                    <th className="pb-4 font-bold">Transaction ID</th>
                                    <th className="pb-4 font-bold">Payment</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {deliveries.map((delivery) => (
                                    <tr key={delivery._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-semibold text-white flex items-center gap-3">
                                            {delivery.bookImage && (
                                                <img 
                                                    src={delivery.bookImage} 
                                                    alt={delivery.bookTitle} 
                                                    className="w-10 h-14 object-cover rounded-lg border border-white/10"
                                                />
                                            )}
                                            {delivery.bookTitle}
                                        </td>
                                        <td className="py-4 font-mono text-xs text-slate-500">{delivery.transactionId}</td>
                                        <td className="py-4 font-bold text-white">
                                            ${Number(delivery.deliveryFee || 0).toFixed(2)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${statusBadge(delivery.status)}`}>
                                                {delivery.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {new Date(delivery.date).toLocaleDateString(undefined, {
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
