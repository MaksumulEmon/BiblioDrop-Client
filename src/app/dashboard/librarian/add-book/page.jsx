"use client";

import { addBook } from "@/lib/api/book";
import { authClient } from "@/lib/auth-client";
import { imageUpload } from "@/lib/imgUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddBook() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Fiction",
        deliveryFee: "",
        description: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (!image) {
                toast.error("Please select an image");
                return;
            }

            const uploadedImage = await imageUpload(image);

            const books = {
                title: formData.title,
                author: formData.author,
                category: formData.category,
                deliveryFee: Number(formData.deliveryFee),
                description: formData.description,
                image: uploadedImage.url,
                userId: user.id,
                userEmail: user.email,
                userName: user.name,
                status: "pending",
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const result = await addBook(books);
            console.log(result);

            toast.success("Book submitted successfully! Waiting for admin approval.");
            router.push("/dashboard/librarian/inventory");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add book");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Add New Book</h2>
                <p className="text-slate-400 mt-2">
                    Add a new book to your inventory. Books require admin approval before publication.
                </p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Book Cover */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Book Cover</label>
                        <label className="flex items-center justify-center w-full h-56 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-purple-600 transition">
                            <div className="text-center">
                                <p className="text-slate-300 font-medium">Upload Book Cover</p>
                                <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                                {image && <p className="text-green-400 mt-2 text-sm">{image.name}</p>}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </label>
                    </div>

                    {/* Title & Author */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">Book Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Atomic Habits"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">Author Name</label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="James Clear"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>
                    </div>

                    {/* Category & Fee */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            >
                                <option>Fiction</option>
                                <option>Academic</option>
                                <option>Science</option>
                                <option>Biography</option>
                                <option>History</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">Delivery Fee</label>
                            <input
                                type="number"
                                name="deliveryFee"
                                value={formData.deliveryFee}
                                onChange={handleChange}
                                placeholder="50"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-slate-300 mb-2">Description</label>
                        <textarea
                            rows={6}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write book description..."
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-purple-600"
                        />
                    </div>

                    {/* Notice */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-sm text-yellow-300">
                            All newly submitted books will be marked as <span className="font-semibold">Pending Approval</span> until reviewed by an administrator.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit for Approval"}
                    </button>
                </form>
            </div>
        </div>
    );
}
