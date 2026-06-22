






// "use client";

// import { useState, useEffect } from "react";

// import Link from "next/link";
// import Image from "next/image";



// const images = [

//     "https://cdn.pixabay.com/photo/2024/03/30/12/01/book-8664639_1280.jpg",

//     "https://cdn.pixabay.com/photo/2017/12/11/16/12/book-3012622_1280.jpg",

//     "https://cdn.pixabay.com/photo/2021/11/15/20/29/book-6799314_1280.jpg",

// ];



// export default function Banner() {

//     const [current, setCurrent] = useState(0);



//     useEffect(() => {

//         const interval = setInterval(() => {

//             setCurrent((prev) => (prev + 1) % images.length);

//         }, 2000);



//         return () => clearInterval(interval);

//     }, []);



//     return (

//         <section className="relative overflow-hidden bg-[#0D0D0D] min-h-20 flex items-center">



//             {/* Glow Background */}

//             <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />



//             <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />



//             <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">



//                 <div className="grid lg:grid-cols-2 gap-16 items-center">



//                     {/* Left Content */}

//                     <div>

//                         <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-6">

//                             ✨ Trusted by 12,000+ Readers

//                         </div>



//                         <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">

//                             Find Your Next



//                             <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">

//                                 Favorite Book

//                             </span>

//                         </h1>



//                         <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">

//                             Discover thousands of books from libraries and independent

//                             owners. Borrow books instantly and enjoy doorstep delivery.

//                         </p>



//                         <div className="mt-10 flex flex-wrap gap-4">

//                             <Link

//                                 href="/browse"

//                                 className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-white font-medium transition hover:scale-105"

//                             >

//                                 Browse Books

//                             </Link>



//                             <Link

//                                 href="/about"

//                                 className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-white hover:bg-white/10 transition"

//                             >

//                                 Learn More

//                             </Link>

//                         </div>



//                         {/* Stats */}

//                         <div className="mt-12 flex flex-wrap gap-4">

//                             <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">

//                                 <h3 className="text-2xl font-bold text-blue-400">2,400+</h3>

//                                 <p className="text-sm text-slate-400">Books</p>

//                             </div>



//                             <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">

//                                 <h3 className="text-2xl font-bold text-blue-400">180+</h3>

//                                 <p className="text-sm text-slate-400">Libraries</p>

//                             </div>



//                             <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">

//                                 <h3 className="text-2xl font-bold text-blue-400">12K+</h3>

//                                 <p className="text-sm text-slate-400">Readers</p>

//                             </div>

//                         </div>

//                     </div>



//                     {/* Right Image Slider */}

//                     <div className="relative flex justify-center">



//                         <div className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />



//                         <div className="relative w-full max-w-lg">



//                             <Image
//                                 src={images[current]}
//                                 alt="Books"
//                                 width={550}
//                                 height={550}
//                                 className="w-full h-[550px]  rounded-3xl border border-white/10 shadow-2xl transition-all duration-700"
//                                 priority
//                             />



//                             {/* Dots */}

//                             <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">

//                                 {images.map((_, index) => (

//                                     <button

//                                         key={index}

//                                         onClick={() => setCurrent(index)}

//                                         className={`h-2 rounded-full transition-all duration-300 ${current === index

//                                             ? "w-8 bg-blue-500"

//                                             : "w-2 bg-white/40"

//                                             }`}

//                                     />

//                                 ))}

//                             </div>



//                         </div>



//                     </div>



//                 </div>

//             </div>

//         </section>

//     );

// }












"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const images = [
    "https://cdn.pixabay.com/photo/2024/03/30/12/01/book-8664639_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/12/11/16/12/book-3012622_1280.jpg",
    "https://cdn.pixabay.com/photo/2021/11/15/20/29/book-6799314_1280.jpg",
];

export default function Banner() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative overflow-hidden bg-[#0D0D0D] min-h-20 flex items-center">

            {/* Glow Background */}
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">

                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-6"
                        >
                            ✨ Trusted by 12,000+ Readers
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold leading-tight text-white"
                        >
                            Find Your Next
                            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Favorite Book
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed"
                        >
                            Discover thousands of books from libraries and independent
                            owners. Borrow books instantly and enjoy doorstep delivery.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 flex flex-wrap gap-4"
                        >
                            <Link
                                href="/about"
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-7 py-3 text-white font-medium transition hover:scale-105"
                            >
                                Browse Books
                            </Link>

                            <Link
                                href="/about"
                                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-white hover:bg-white/10 transition"
                            >
                                Learn More
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 flex flex-wrap gap-4"
                        >
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                                <h3 className="text-2xl font-bold text-blue-400">2,400+</h3>
                                <p className="text-sm text-slate-400">Books</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                                <h3 className="text-2xl font-bold text-blue-400">180+</h3>
                                <p className="text-sm text-slate-400">Libraries</p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-5">
                                <h3 className="text-2xl font-bold text-blue-400">12K+</h3>
                                <p className="text-sm text-slate-400">Readers</p>
                            </div>
                        </motion.div>

                    </motion.div>

                    {/* RIGHT IMAGE SLIDER */}
                    <div className="relative flex justify-center">

                        <div className="absolute w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />

                        <div className="relative w-full max-w-lg">

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Image
                                        src={images[current]}
                                        alt="Books"
                                        width={550}
                                        height={550}
                                        className="w-full h-[550px] rounded-3xl border border-white/10 shadow-2xl"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Dots */}
                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">

                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrent(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${current === index
                                                ? "w-8 bg-blue-500"
                                                : "w-2 bg-white/40"
                                            }`}
                                    />
                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}