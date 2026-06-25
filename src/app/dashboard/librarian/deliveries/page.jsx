"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, Truck, CheckCircle2, Navigation } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LibrarianDeliveries() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [deliveries, setDeliveries] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const loadDeliveries = async () => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deliveries/librarian`, {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            setDeliveries(data || []);
        } catch (err) {
            console.error("Error fetching librarian deliveries:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        loadDeliveries();
    }, [user, isPending, router]);

    const handleUpdateStatus = async (id, nextStatus) => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deliveries/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });

            if (res.ok) {
                toast.success(`Delivery status updated to ${nextStatus}`);
                setDeliveries(prev =>
                    prev.map(d => d._id === id ? { ...d, status: nextStatus } : d)
                );
            } else {
                toast.error("Failed to update status");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
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
            default:
                return "bg-slate-700/10 border-slate-700/20 text-slate-400";
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
                <h1 className="text-3xl font-extrabold text-white">Manage Deliveries</h1>
                <p className="text-slate-400 mt-2">Manage incoming book delivery requests and track dispatch status.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {deliveries.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Truck size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No delivery requests assigned to you.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">User Details</th>
                                    <th className="pb-4 font-bold">Book Title</th>
                                    <th className="pb-4 font-bold">Address</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {deliveries.map((delivery) => (
                                    <tr key={delivery._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4">
                                            <p className="font-bold text-white">{delivery.userName}</p>
                                            <p className="text-xs text-slate-500">{delivery.userEmail}</p>
                                        </td>
                                        <td className="py-4 font-semibold text-white">
                                            {delivery.bookTitle}
                                        </td>
                                        <td className="py-4 text-sm max-w-xs truncate" title={delivery.address}>
                                            {delivery.address}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${statusBadge(delivery.status)}`}>
                                                {delivery.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {delivery.status === "pending" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(delivery._id, "dispatched")}
                                                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                                                    >
                                                        <Navigation size={12} />
                                                        Dispatch
                                                    </button>
                                                )}
                                                {delivery.status === "dispatched" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(delivery._id, "delivered")}
                                                        className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                                                    >
                                                        <CheckCircle2 size={12} />
                                                        Deliver
                                                    </button>
                                                )}
                                                {delivery.status === "delivered" && (
                                                    <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                                                        <CheckCircle2 size={14} /> Completed
                                                    </span>
                                                )}
                                            </div>
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
