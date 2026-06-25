"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminBookApprovals() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [pendingBooks, setPendingBooks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const loadPendingBooks = async () => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/books/pending`, {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            setPendingBooks(data || []);
        } catch (err) {
            console.error("Error loading pending books:", err);
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
        loadPendingBooks();
    }, [user, isPending, router]);

    const handleApproval = async (id, action) => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/books/approve/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                toast.success(action === "approve" ? "Book approved and published!" : "Book rejected.");
                setPendingBooks(prev => prev.filter(b => b._id !== id));
            } else {
                toast.error("Action failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
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
                <h1 className="text-3xl font-extrabold text-white">Pending Approvals</h1>
                <p className="text-slate-400 mt-2">Approve new books submitted by librarians to list them on the browse page.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {pendingBooks.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No books currently pending approval.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Cover & Details</th>
                                    <th className="pb-4 font-bold">Librarian</th>
                                    <th className="pb-4 font-bold">Category</th>
                                    <th className="pb-4 font-bold">Delivery Fee</th>
                                    <th className="pb-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pendingBooks.map((book) => (
                                    <tr key={book._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4 flex gap-3 max-w-sm">
                                            {book.image && (
                                                <img 
                                                    src={book.image} 
                                                    alt={book.title} 
                                                    className="w-12 h-16 object-cover rounded-lg border border-white/10 shrink-0"
                                                />
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-white truncate">{book.title}</p>
                                                <p className="text-xs text-slate-500 truncate">By {book.author}</p>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2" title={book.description}>
                                                    {book.description}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <p className="font-semibold text-white">{book.userName}</p>
                                            <p className="text-xs text-slate-500">{book.userEmail}</p>
                                        </td>
                                        <td className="py-4 text-sm">{book.category}</td>
                                        <td className="py-4 font-bold text-white">${book.deliveryFee}</td>
                                        <td className="py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleApproval(book._id, "approve")}
                                                    className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                                                >
                                                    <CheckCircle size={14} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(book._id, "reject")}
                                                    className="flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                                                >
                                                    <XCircle size={14} />
                                                    Reject
                                                </button>
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
