import Link from "next/link";
import React from "react";
import { ArrowRight, Building2 } from "lucide-react";
import Bookcard from "./Bookcard";

const FeaturedBook = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/featured`, {
        cache: "no-store",
    });

    const books = await res.json();

    return (
        <section className="relative py-16 bg-[#0D0D0D] overflow-hidden">

        
           

            <div className="relative z-10 max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

                    {/* LEFT TITLE */}
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
                            Featured{" "}
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Books
                            </span>
                        </h1>

                        <p className="mt-3 text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
                            Discover top-rated and trending books curated for your reading journey.
                        </p>
                    </div>

                    {/* RIGHT BUTTON */}
                    <Link href="/all-books">
                        <button className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300">

                            <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />

                            <span className="relative z-10">
                                View All
                            </span>

                            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition" />
                        </button>
                    </Link>

                </div>

                {/* CONTENT */}
                {books.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-24 text-center">

                        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 backdrop-blur-xl">
                            <Building2 size={40} className="text-blue-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            No Books Found
                        </h2>

                        <p className="text-slate-400 mt-3 max-w-md leading-relaxed">
                            Currently there are no featured books available. Please check again later or add new books.
                        </p>

                        <Link href="/add-room">
                            <button className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition">
                                + Add New Book
                            </button>
                        </Link>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {books.map((book) => (
                            <Bookcard key={book._id} bookData={book} />
                        ))}
                    </div>

                )}

            </div>
        </section>
    );
};

export default FeaturedBook;