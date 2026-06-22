"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2, Star, Edit, Trash2, X, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function UserReviews() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [reviews, setReviews] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState("");
    const [updatingReview, setUpdatingReview] = useState(false);

    const loadReviews = async () => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch("http://localhost:5000/api/reviews/user", {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            setReviews(data || []);
        } catch (err) {
            console.error("Error loading reviews:", err);
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
        loadReviews();
    }, [user, isPending, router]);

    const handleOpenEditModal = (review) => {
        setSelectedReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedReview(null);
    };

    const handleUpdateReview = async (e) => {
        e.preventDefault();
        if (!selectedReview) return;

        try {
            setUpdatingReview(true);
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/reviews/${selectedReview._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({
                    rating: Number(editRating),
                    comment: editComment
                })
            });

            if (res.ok) {
                toast.success("Review updated!");
                handleCloseEditModal();
                loadReviews();
            } else {
                toast.error("Failed to update review");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        } finally {
            setUpdatingReview(false);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token.token}`
                }
            });

            if (res.ok) {
                toast.success("Review deleted");
                setReviews(prev => prev.filter(r => r._id !== id));
            } else {
                toast.error("Failed to delete review");
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
                <h1 className="text-3xl font-extrabold text-white">My Reviews</h1>
                <p className="text-slate-400 mt-2">Manage the reviews and ratings you have shared for books.</p>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-12 text-center text-slate-500 backdrop-blur-xl">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                    <p>You haven't written any reviews yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                        <div 
                            key={review._id}
                            className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 relative group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{review.bookTitle}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {new Date(review.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg text-yellow-400 text-sm font-semibold items-center">
                                        <Star size={14} className="fill-current" />
                                        <span>{review.rating}/5</span>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm italic line-clamp-4">"{review.comment}"</p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 border-t border-white/5 pt-4">
                                <button
                                    onClick={() => handleOpenEditModal(review)}
                                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-blue-400 hover:text-blue-300 transition cursor-pointer"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteReview(review._id)}
                                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl">
                        <button 
                            onClick={handleCloseEditModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Review</h2>
                            <p className="text-sm text-slate-400 mt-1">Update your feedback for {selectedReview.bookTitle}</p>
                        </div>

                        <form onSubmit={handleUpdateReview} className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-300 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setEditRating(star)}
                                            className="text-slate-400 hover:text-yellow-400 transition"
                                        >
                                            <Star 
                                                size={32} 
                                                className={star <= editRating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}
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
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updatingReview}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {updatingReview ? "Updating..." : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
