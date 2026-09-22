"use client";

import { addBook } from "@/lib/api/book";
import { authClient } from "@/lib/auth-client";
import { imageUpload } from "@/lib/imgUpload";
import { scanBookWithAI } from "@/lib/api/ai";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import {
    Sparkles,
    ScanLine,
    CheckCircle2,
    Loader2,
    UploadCloud,
    BookOpen,
    Tag,
    RotateCcw,
} from "lucide-react";
import Image from "next/image";

export default function AddBook() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [aiScanned, setAiScanned] = useState(false);
    const [detectedTags, setDetectedTags] = useState([]);

    const fileInputRef = useRef(null);

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

    const handleFileChange = (file) => {
        if (!file) return;
        setImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setAiScanned(false);
        setDetectedTags([]);
    };

    const handleScanWithAI = async () => {
        if (!image) {
            toast.error("Please choose or drop a book cover image first!");
            return;
        }

        try {
            setScanning(true);
            toast.loading("Scanning cover typography & artwork with Gemini Vision...", { id: "scan-toast" });

            // Compress / scale image via canvas to ensure ultra-fast upload (< 200KB)
            const getCompressedBase64 = (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new window.Image();
                        img.onload = () => {
                            const canvas = document.createElement("canvas");
                            let width = img.width;
                            let height = img.height;
                            const maxDim = 1000;
                            if (width > maxDim || height > maxDim) {
                                if (width > height) {
                                    height = Math.round((height * maxDim) / width);
                                    width = maxDim;
                                } else {
                                    width = Math.round((width * maxDim) / height);
                                    height = maxDim;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL("image/jpeg", 0.85));
                        };
                        img.onerror = () => resolve(event.target.result);
                        img.src = event.target.result;
                    };
                    reader.onerror = () => resolve(null);
                    reader.readAsDataURL(file);
                });
            };

            const base64Data = await getCompressedBase64(image);
            if (!base64Data) {
                throw new Error("Failed to read image file. Please try another image.");
            }

            const res = await scanBookWithAI(base64Data, "image/jpeg", image.name || "");

            if (res.success && res.book) {
                setFormData({
                    title: res.book.title || formData.title,
                    author: res.book.author || formData.author,
                    category: res.book.category || formData.category,
                    deliveryFee: res.book.deliveryFee || formData.deliveryFee || 3,
                    description: res.book.description || formData.description,
                });
                setDetectedTags(res.book.tags || []);
                setAiScanned(true);
                toast.success("✨ Book scanned! Title, author, genre & synopsis auto-filled.", { id: "scan-toast" });
            } else {
                toast.error(res.error || "Could not extract book details. Please check the image.", { id: "scan-toast" });
            }
        } catch (err) {
            console.error("Scan error:", err);
            const msg = err.message || "AI scanning failed. You can still fill fields manually.";
            toast.error(msg, { id: "scan-toast", duration: 5000 });
        } finally {
            setScanning(false);
        }
    };

    const handleResetForm = () => {
        setFormData({
            title: "",
            author: "",
            category: "Fiction",
            deliveryFee: "",
            description: "",
        });
        setImage(null);
        setPreviewUrl(null);
        setAiScanned(false);
        setDetectedTags([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast("Form reset", { icon: "🧹" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (!image) {
                toast.error("Please select a book cover image");
                return;
            }

            const uploadedImage = await imageUpload(image);

            const books = {
                title: formData.title,
                author: formData.author,
                category: formData.category,
                deliveryFee: Number(formData.deliveryFee) || 3,
                description: formData.description,
                image: uploadedImage.url,
                userId: user?.id,
                userEmail: user?.email,
                userName: user?.name,
                status: "pending",
                aiCataloged: aiScanned,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await addBook(books);

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
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                        Add New Book
                        <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-semibold">
                            <Sparkles size={12} className="text-purple-400" />
                            Multimodal AI Powered
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-2">
                        Add a new book to your library. Upload a cover photo to let Gemini Vision auto-fill title, author, and description in seconds!
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleResetForm}
                    className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs font-semibold flex items-center gap-2"
                >
                    <RotateCcw size={14} />
                    Reset Fields
                </button>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    
                    {/* Multimodal AI Book Cover Upload & Scanner Zone */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-200">
                                Book Cover & AI Scanner
                            </label>

                            {image && (
                                <button
                                    type="button"
                                    onClick={handleScanWithAI}
                                    disabled={scanning}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-purple-500/20 hover:scale-105 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                >
                                    {scanning ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Scanning with Gemini Vision...
                                        </>
                                    ) : (
                                        <>
                                            <ScanLine size={14} />
                                            Scan Cover with AI ✨
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Dropzone Container */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-2xl cursor-pointer transition overflow-hidden p-4 ${
                                aiScanned
                                    ? "border-green-500/40 bg-green-500/5 hover:border-green-500/60"
                                    : scanning
                                    ? "border-purple-500/50 bg-purple-500/5"
                                    : "border-white/15 bg-slate-950/50 hover:border-purple-500/40 hover:bg-slate-950/80"
                            }`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e.target.files?.[0])}
                            />

                            {/* Scanning Laser Animation Bar */}
                            {scanning && (
                                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce z-20" />
                            )}

                            {previewUrl ? (
                                <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg">
                                    <div className="relative w-28 h-40 rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0 bg-slate-900">
                                        <Image
                                            src={previewUrl}
                                            alt="Cover Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        {aiScanned && (
                                            <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-green-500 text-white shadow">
                                                <CheckCircle2 size={14} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-center sm:text-left space-y-2">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <p className="text-white font-bold text-sm truncate max-w-[220px]">
                                                {image?.name}
                                            </p>
                                            {aiScanned && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 font-bold border border-green-500/30">
                                                    Verified by AI
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400">
                                            {(image?.size / 1024).toFixed(1)} KB • Click to replace cover image
                                        </p>

                                        {!aiScanned && !scanning && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleScanWithAI();
                                                }}
                                                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition"
                                            >
                                                <Sparkles size={13} />
                                                Auto-Catalog This Book Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                                        <UploadCloud size={28} />
                                    </div>
                                    <p className="text-slate-200 font-semibold text-sm">
                                        Upload or drop book cover photo here
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        PNG, JPG or WEBP • Gemini Vision will automatically extract title, author & category!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* AI Detection Banner */}
                        {aiScanned && (
                            <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-transparent border border-green-500/20 flex items-center justify-between flex-wrap gap-2 text-xs">
                                <span className="text-green-300 font-semibold flex items-center gap-1.5">
                                    <CheckCircle2 size={15} />
                                    Cover scanned! Verified fields have been filled below. You can review and edit any field.
                                </span>
                                {detectedTags.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <Tag size={12} className="text-slate-400" />
                                        {detectedTags.map((t, idx) => (
                                            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                                                #{t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Title & Author */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Book Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Atomic Habits"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Author Name
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="e.g. James Clear"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>
                    </div>

                    {/* Category & Fee */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            >
                                <option value="Fiction">Fiction</option>
                                <option value="Academic">Academic</option>
                                <option value="Science">Science</option>
                                <option value="Biography">Biography</option>
                                <option value="History">History</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-2">
                                Delivery Fee ($)
                            </label>
                            <input
                                type="number"
                                name="deliveryFee"
                                min="0"
                                step="any"
                                value={formData.deliveryFee}
                                onChange={handleChange}
                                placeholder="e.g. 3.50"
                                required
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-300">
                                Book Synopsis & Catalog Description
                            </label>
                            {aiScanned && (
                                <span className="text-[11px] text-purple-400 font-medium">
                                    ✨ AI-Generated Reading Synopsis
                                </span>
                            )}
                        </div>
                        <textarea
                            rows={6}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write book description or use the AI scanner above..."
                            required
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-purple-500 transition leading-relaxed text-sm"
                        />
                    </div>

                    {/* Notice */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-3">
                        <span className="text-yellow-400 text-lg">ℹ️</span>
                        <p className="text-xs sm:text-sm text-yellow-300 leading-relaxed">
                            Newly submitted books will be cataloged with status <span className="font-bold underline">Pending Approval</span> and will be reviewed by an administrator before appearing in public browsing.
                        </p>
                    </div>

                    {/* Submit Action */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={loading || scanning}
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-500/25 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Submitting Book...
                                </>
                            ) : (
                                <>
                                    <BookOpen size={16} />
                                    Submit for Approval
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
