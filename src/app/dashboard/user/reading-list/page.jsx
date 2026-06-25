"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, BookOpen, Star, MessageSquareCode, X, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserReadingList() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [deliveredBooks, setDeliveredBooks] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Review Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const loadDeliveredBooks = async () => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/deliveries/user`, {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            // Filter only delivered status
            const delivered = (data || []).filter(d => d.status === "delivered");
            setDeliveredBooks(delivered);
        } catch (err) {
            console.error("Error loading reading list:", err);
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
        loadDeliveredBooks();
    }, [user, isPending, router]);

    const handleOpenReviewModal = (book) => {
        setSelectedBook(book);
        setRating(5);
        setComment("");
        setIsModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!selectedBook) return;

        try {
            setSubmittingReview(true);
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({
                    bookId: selectedBook.bookId,
                    rating: Number(rating),
                    comment
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Review submitted successfully!");
                handleCloseReviewModal();
            } else {
                toast.error(data.error || "Failed to submit review");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        } finally {
            setSubmittingReview(false);
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
                <h1 className="text-3xl font-extrabold text-white">My Reading List</h1>
                <p className="text-slate-400 mt-2">Books successfully delivered to you. Ready to read and review!</p>
            </div>

            {deliveredBooks.length === 0 ? (
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-12 text-center text-slate-500 backdrop-blur-xl">
                    <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                    <p>You haven't received any books yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {deliveredBooks.map((item) => (
                        <div 
                            key={item._id}
                            className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="p-5 flex-grow">
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl mb-4 bg-slate-950">
                                    {item.bookImage ? (
                                        <img 
                                            src={item.bookImage} 
                                            alt={item.bookTitle}
                                            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">No Image</div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-white line-clamp-1">{item.bookTitle}</h3>
                                <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                                    <span>Delivered:</span>
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </p>
                            </div>

                            <div className="p-5 pt-0">
                                <button
                                    onClick={() => handleOpenReviewModal(item)}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                                >
                                    <Star size={16} className="fill-current" />
                                    Write a Review
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {isModalOpen && selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl">
                        <button 
                            onClick={handleCloseReviewModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6 flex items-center gap-2 text-purple-400">
                            <Sparkles size={20} />
                            <h2 className="text-xl font-bold text-white">Review: {selectedBook.bookTitle}</h2>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="text-slate-400 hover:text-yellow-400 transition"
                                        >
                                            <Star 
                                                size={32} 
                                                className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Comment</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share your thoughts about this book..."
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingReview}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
