"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">

            {/* Soft glow background */}
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

            {/* Content */}
            <div className="text-center z-10 px-6">

                {/* 404 */}
                <h1 className="text-[120px] md:text-[160px] font-bold text-white leading-none">
                    404
                </h1>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-semibold text-white mt-4">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="text-white/60 mt-4 max-w-md mx-auto">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>

                {/* Button */}
                <div className="mt-8">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition text-white rounded-full font-medium"
                    >
                        Go Back Home →
                    </Link>
                </div>

            </div>
        </div>
    );
}