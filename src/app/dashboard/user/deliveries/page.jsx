"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Truck, Calendar, DollarSign, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cancelOrder } from "@/lib/api/ai";

export default function UserDeliveries() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [deliveries, setDeliveries] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

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

    const handleCancelOrder = async (deliveryId, bookTitle) => {
        if (!confirm(`Are you sure you want to cancel the delivery request for "${bookTitle}"?`)) {
            return;
        }

        try {
            setCancellingId(deliveryId);
            const { data: token } = await authClient.token();
            if (!token?.token) {
                toast.error("Authentication required");
                return;
            }

            const res = await cancelOrder(deliveryId, token.token, "Cancelled by reader from dashboard");
            if (res.success) {
                toast.success("Order cancelled successfully");
                setDeliveries(prev =>
                    prev.map(d => d._id === deliveryId ? { ...d, status: "cancelled" } : d)
                );
            } else {
                toast.error(res.error || "Failed to cancel order");
            }
        } catch (err) {
            toast.error(err.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
            case "dispatched":
                return "bg-blue-500/10 border-blue-500/20 text-blue-400";
            case "delivered":
                return "bg-green-500/10 border-green-500/20 text-green-400";
            case "cancelled":
                return "bg-rose-500/10 border-rose-500/20 text-rose-400";
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
                                    <th className="pb-4 font-bold text-right">Action</th>
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
                                        <td className="py-4 text-right">
                                            {delivery.status === "pending" ? (
                                                <button
                                                    onClick={() => handleCancelOrder(delivery._id, delivery.bookTitle)}
                                                    disabled={cancellingId === delivery._id}
                                                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition flex items-center gap-1.5 ml-auto disabled:opacity-50"
                                                >
                                                    {cancellingId === delivery._id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    )}
                                                    Cancel Order
                                                </button>
                                            ) : delivery.status === "cancelled" ? (
                                                <span className="text-xs text-rose-400/80 italic font-mono">
                                                    Order Cancelled
                                                </span>
                                            ) : (
                                                <span className="text-xs text-slate-500">
                                                    —
                                                </span>
                                            )}
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
