"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Trash2, EyeOff, Loader2, BookOpen } from "lucide-react";
import { deleteBook, updateBookStatus } from "@/lib/api/book";
import { EditModal2 } from "@/Components/EditModal2";
import { useRouter } from "next/navigation";
import { AlertDialog, Button, } from "@heroui/react";

export default function LibrarianInventory() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [books, setBooks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadBooks = async () => {
        if (!user) return;
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/books/librarian`, {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            setBooks(data || []);
        } catch (err) {
            console.error("Error fetching librarian inventory:", err);
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
        loadBooks();
    }, [user, isPending, router]);

    const handleDelete = async () => {
        if (!selectedBookId) return;

        try {
            setIsDeleting(true);

            await deleteBook(selectedBookId);

            toast.success("Book deleted successfully");

            setBooks((prev) =>
                prev.filter((b) => b._id !== selectedBookId)
            );

            setSelectedBookId(null);
        } catch (err) {
            toast.error("Failed to delete book");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUnpublish = async (bookId) => {
        try {
            // Unpublish book -> sets status to "unpublished"
            await updateBookStatus(bookId, "unpublished");
            toast.success("Book unpublished");
            setBooks(prev =>
                prev.map(b => b._id === bookId ? { ...b, status: "unpublished" } : b)
            );
        } catch (err) {
            toast.error("Failed to unpublish book");
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

    const statusLabel = (status) => {
        if (status === "pending" || status === "pending_approval") return "PENDING APPROVAL";
        return status.toUpperCase();
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
                <h1 className="text-3xl font-extrabold text-white">Manage Inventory</h1>
                <p className="text-slate-400 mt-2">View and manage the status and details of your submitted books.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {books.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Your inventory is empty.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">Book Name</th>
                                    <th className="pb-4 font-bold">Category</th>
                                    <th className="pb-4 font-bold">Delivery Fee</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {books.map((book) => (
                                    <tr key={book._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-semibold text-white flex items-center gap-3">
                                            {book.image && (
                                                <img
                                                    src={book.image}
                                                    alt={book.title}
                                                    className="w-10 h-14 object-cover rounded-lg border border-white/10"
                                                />
                                            )}
                                            <div>
                                                <p className="font-bold text-white">{book.title}</p>
                                                <p className="text-xs text-slate-500">By {book.author}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm">{book.category}</td>
                                        <td className="py-4 font-bold text-white">${book.deliveryFee}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 text-xs rounded-full border font-semibold ${statusColor(book.status)}`}>
                                                {statusLabel(book.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex gap-2 justify-end items-center">
                                                <EditModal2 book={book} />

                                                <button
                                                    onClick={() => setSelectedBookId(book._id)}
                                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition cursor-pointer"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                {book.status === "published" && (
                                                    <button
                                                        onClick={() => handleUnpublish(book._id)}
                                                        title="Unpublish book"
                                                        className="p-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-yellow-400 hover:text-yellow-300 transition cursor-pointer"
                                                    >
                                                        <EyeOff size={16} />
                                                    </button>
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




            <AlertDialog
                isOpen={!!selectedBookId}
                onOpenChange={(open) => {
                    if (!open) setSelectedBookId(null);
                }}
            >
                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className="max-w-md border border-white/10 bg-slate-900 text-white">

                            <AlertDialog.Header>
                                <AlertDialog.Icon status="danger" />
                                <AlertDialog.Heading>
                                    Delete Book?
                                </AlertDialog.Heading>
                            </AlertDialog.Header>

                            <AlertDialog.Body>
                                <p className="text-slate-400">
                                    This action will permanently remove this book
                                    from your inventory and cannot be undone.
                                </p>
                            </AlertDialog.Body>

                            <AlertDialog.Footer>
                                <Button
                                    variant="bordered"
                                    onPress={() => setSelectedBookId(null)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    color="danger"
                                    isLoading={isDeleting}
                                    onPress={handleDelete}
                                >
                                    Delete Book
                                </Button>
                            </AlertDialog.Footer>

                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </div>
    );
}
