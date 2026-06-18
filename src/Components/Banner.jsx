


"use client";

import { useState, useEffect } from "react";

const slides = [
    {
        id: 1,
        image:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400&q=80",
        badge: "📚 Premium Book Delivery",
        heading: "Your Local Library,",
        highlight: "Delivered.",
        sub: "Browse thousands of books from local libraries and independent owners. Request doorstep delivery in minutes.",
    },
    {
        id: 2,
        image:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80",
        badge: "🔖 10,000+ Books Available",
        heading: "Read More,",
        highlight: "Travel Less.",
        sub: "Skip the commute. Get your favorite books delivered straight to your door.",
    },
    {
        id: 3,
        image:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400&q=80",
        badge: "⭐ Trusted by 12k+ Readers",
        heading: "Discover Books",
        highlight: "You'll Love.",
        sub: "From fiction to academics — explore curated collections and reviews.",
    },
];

export default function Banner() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            goTo((current + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [current]);

    const goTo = (index) => {
        if (animating) return;

        setAnimating(true);
        setTimeout(() => {
            setCurrent(index);
            setAnimating(false);
        }, 300);
    };

    const slide = slides[current];

    return (
        <section className="relative min-h-[560px] overflow-hidden">

            {/* Background */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${animating ? "opacity-0" : "opacity-100"
                    }`}
                style={{ backgroundImage: `url(${slide.image})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20" />

            {/* Content */}
            <div
                className={`relative z-10 flex h-full items-center px-6 md:px-16 transition-all duration-500 ${animating ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
                    }`}
            >
                <div className="max-w-2xl">

                    {/* Badge */}
                    <div className="inline-flex mt-5 items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-xs text-blue-200 mb-5">
                        {slide.badge}
                    </div>

                    

                    {/* Heading */}
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                        {slide.heading}
                        <br />
                        <span className="text-blue-500">{slide.highlight}</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-5 text-gray-300 text-sm md:text-base leading-relaxed max-w-lg">
                        {slide.sub}
                    </p>

                    {/* Buttons */}
                    <div className="mt-8 flex gap-4 flex-wrap">
                        <button className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white font-medium">
                            Browse Books →
                        </button>

                        <button className="border border-white/30 hover:border-white/70 hover:bg-white/10 transition px-6 py-3 rounded-lg text-white">
                            How it works
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="mt-10 flex gap-8 border-t border-white/10 pt-6 flex-wrap">
                        <div>
                            <p className="text-blue-500 font-bold text-xl">2,400+</p>
                            <p className="text-xs text-gray-400">Books</p>
                        </div>

                        <div>
                            <p className="text-blue-500 font-bold text-xl">180+</p>
                            <p className="text-xs text-gray-400">Librarians</p>
                        </div>

                        <div>
                            <p className="text-blue-500 font-bold text-xl">12k+</p>
                            <p className="text-xs text-gray-400">Deliveries</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-8 left-6 flex gap-2 z-10">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === current
                                ? "w-7 bg-blue-500"
                                : "w-2 bg-white/30"
                            }`}
                    />
                ))}
            </div>

            {/* Right thumbnails */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
                {slides.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-10 w-14 cursor-pointer rounded-md bg-cover bg-center border transition ${i === current
                                ? "border-blue-500 opacity-100"
                                : "border-white/20 opacity-60"
                            }`}
                        style={{ backgroundImage: `url(${s.image})` }}
                    />
                ))}
            </div>
        </section>
    );
}