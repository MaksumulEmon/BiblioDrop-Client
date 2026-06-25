"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, BookOpen, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteBook, updateBookStatus } from "@/lib/api/book";
import { useRouter } from "next/navigation";

export default function AdminBooksSystem() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [books, setBooks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const loadAllBooks = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/books`, {
                cache: "no-store"
            });
            const data = await res.json();
            setBooks(data || []);
        } catch (err) {
            console.error("Error fetching all books:", err);
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
        loadAllBooks();
    }, [user, isPending, router]);

    const handleDelete = async (bookId) => {
        if (!confirm("Are you sure you want to delete this book? This will remove it permanently.")) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/book/${bookId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Book deleted");
                setBooks(prev => prev.filter(b => b._id !== bookId));
            } else {
                toast.error("Failed to delete book");
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const handleStatusToggle = async (bookId, currentStatus) => {
        const nextStatus = currentStatus === "published" ? "unpublished" : "published";
        try {
            await updateBookStatus(bookId, nextStatus);
            toast.success(`Book status updated to ${nextStatus}`);
            setBooks(prev =>
                prev.map(b => b._id === bookId ? { ...b, status: nextStatus } : b)
            );
        } catch (err) {
            toast.error("Failed to toggle status");
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "pending":
            case "pending_approval":
                return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
            case "published":
                return "bg-green-500/10 border-green-500/20 text-green-400";
            case "unpublished":
                return "bg-gray-500/10 border-gray-500/20 text-slate-400";
            case "rejected":
                return "bg-red-500/10 border-red-500/20 text-red-400";
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
                <h1 className="text-3xl font-extrabold text-white">Books System Manager</h1>
                <p className="text-slate-400 mt-2">Force publish, unpublish, or delete books system-wide.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {books.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No books in the database.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Details</th>
                                    <th className="pb-4 font-bold">Librarian</th>
                                    <th className="pb-4 font-bold">Category</th>
                                    <th className="pb-4 font-bold">Fee</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {books.map((book) => (
                                    <tr key={book._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4 flex gap-3 max-w-xs">
                                            {book.image && (
                                                <img 
                                                    src={book.image} 
                                                    alt={book.title} 
                                                    className="w-10 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                                                />
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-white truncate">{book.title}</p>
                                                <p className="text-xs text-slate-500">By {book.author}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm">
                                            <p className="font-semibold text-white">{book.userName || "Unknown"}</p>
                                            <p className="text-xs text-slate-500">{book.userEmail || ""}</p>
                                        </td>
                                        <td className="py-4 text-sm">{book.category}</td>
                                        <td className="py-4 font-bold text-white">${book.deliveryFee}</td>
                                        <td className="py-4">
                                            <span className={`px-2.5 py-0.5 text-xs rounded-full border font-semibold uppercase ${statusColor(book.status)}`}>
                                                {book.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleStatusToggle(book._id, book.status)}
                                                    className={`p-2.5 border rounded-xl transition cursor-pointer ${
                                                        book.status === "published"
                                                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                                                            : "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                                    }`}
                                                    title={book.status === "published" ? "Unpublish Book" : "Publish Book"}
                                                >
                                                    {book.status === "published" ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(book._id)}
                                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition cursor-pointer"
                                                    title="Delete Book"
                                                >
                                                    <Trash2 size={16} />
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
