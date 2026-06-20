"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Bookcard = ({ book }) => {
    const statusColor =
        book.status === "Approved"
            ? "bg-emerald-500/90"
            : book.status === "Rejected"
                ? "bg-red-500/90"
                : "bg-amber-500/90";

    return (
        <Link href={`/all-books/${book._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-violet-500/40 hover:shadow-[0_20px_50px_rgba(124,58,237,0.18)]"
            >
                <div className="relative overflow-hidden">
                    <motion.img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-64 object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Category */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-medium text-white shadow-lg">
                        {book.category}
                    </span>

                    {/* Status */}
                    <span
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColor}`}
                    >
                        {book.status}
                    </span>
                </div>

                <div className="p-5">

                    <div className="flex justify-between">
                        <h2 className="text-xl font-bold text-white line-clamp-1 group-hover:text-violet-400 transition">
                            {book.title}
                        </h2>

                        <p className="text-slate-400 mt-2 text-sm">
                            Author: {book.author}
                        </p>
                    </div>

                    <p className="text-slate-500 text-sm mt-3 line-clamp-2">
                        {book.description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
};

export default Bookcard;