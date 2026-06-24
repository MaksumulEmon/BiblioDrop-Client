
"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Bookcard = ({ bookData }) => {
    console.log(bookData)
    const book = bookData;
    // const page = bookData.page;
    // const totalPage = bookData.totalPage;

    const statusColor =
        book.status === "Approved"
            ? "bg-emerald-500/90"
            : book.status === "Rejected"
                ? "bg-red-500/90"
                : "bg-amber-500/90";

    return (
        <div>
            <Link href={`/all-books/${book._id}`}>
                <motion.div
                    initial={{
                        opacity: 0,
                        x: -60,
                        scale: 0.95,
                        filter: "blur(10px)",
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                    }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{
                        y: -12,
                        scale: 1.03,
                    }}
                    className="w-full group bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-violet-500/40 hover:shadow-[0_20px_60px_rgba(124,58,237,0.2)]"
                >

                    <div className="relative overflow-hidden">

                        <motion.img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-44 object-cover"  
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6 }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] font-medium text-white shadow">
                            {book.category}
                        </span>

                        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-semibold text-white ${statusColor}`}>
                            {book.status}
                        </span>

                    </div>

                    <div className="p-4">

                        <h2 className="text-lg font-bold text-white line-clamp-1 group-hover:text-violet-400 transition">
                            {book.title}
                        </h2>

                        <p className="text-slate-400 text-xs mt-1">
                            Author: {book.author}
                        </p>

                        <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                            {book.description}
                        </p>

                    </div>

                </motion.div>


            </Link>


            
        </div>
    );
};

export default Bookcard;