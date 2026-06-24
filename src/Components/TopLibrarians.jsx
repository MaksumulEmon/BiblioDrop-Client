// import React from "react";

// const topLibrarians = [
//     {
//         id: 1,
//         name: "Abdullah Al Mamun",
//         avatar: "https://i.pravatar.cc/150?img=12",
//         deliveries: 128,
//     },
//     {
//         id: 2,
//         name: "Sadia Islam",
//         avatar: "https://i.pravatar.cc/150?img=32",
//         deliveries: 115,
//     },
//     {
//         id: 3,
//         name: "Roza Kabir",
//         avatar: "https://i.pravatar.cc/150?img=45",
//         deliveries: 102,
//     },
// ];

// const TopLibrarians = () => {
//     return (
//         <section className="py-14 px-4 max-w-6xl mx-auto">
//             <h2 className="text-2xl md:text-3xl font-semibold text-slate-100 mb-10">
//                 Top Librarians
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 {topLibrarians.map((user, index) => (
//                     <div
//                         key={user.id}
//                         className="flex items-center gap-5 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-md hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 shadow-lg"
//                     >
//                         {/* Avatar */}
//                         <img
//                             src={user.avatar}
//                             alt={user.name}
//                             className="w-20 h-20 rounded-full object-cover border border-slate-700"
//                         />

//                         {/* Info */}
//                         <div className="flex-1">
//                             <h3 className="text-lg text-slate-100 font-semibold">
//                                 {user.name}
//                             </h3>

//                             <p className="text-slate-400 mt-1 text-sm">
//                                 Completed Deliveries
//                             </p>

//                             <p className="text-2xl font-bold text-slate-200 mt-1">
//                                 {user.deliveries}
//                             </p>
//                         </div>

//                         {/* Rank */}
//                         <div className="text-slate-400 text-lg font-bold">
//                             #{index + 1}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default TopLibrarians;






"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const topLibrarians = [
    {
        id: 1,
        name: "Abdullah Al Mamun",
        avatar: "https://i.pravatar.cc/150?img=12",
        deliveries: 128,
    },
    {
        id: 2,
        name: "Sadia Islam",
        avatar: "https://i.pravatar.cc/150?img=32",
        deliveries: 115,
    },
    {
        id: 3,
        name: "Roza Kabir",
        avatar: "https://i.pravatar.cc/150?img=45",
        deliveries: 102,
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        x: -80,
        filter: "blur(10px)",
    },
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const TopLibrarians = () => {
    return (
        <section className="py-14 px-4 max-w-6xl mx-auto">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="
                    text-2xl md:text-3xl
                    font-bold
                    mb-10
                    bg-gradient-to-r
                    from-violet-500
                    to-indigo-500
                    bg-clip-text
                    text-transparent
                "
            >
                Top Librarians
            </motion.h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {topLibrarians.map((user, index) => (
                    <motion.div
                        key={user.id}
                        variants={cardVariants}
                        whileHover={{
                            y: -8,
                            scale: 1.02,
                        }}
                        className="
                            group
                            flex items-center gap-5
                            p-8
                            rounded-3xl
                            border border-slate-800
                            bg-slate-900/70
                            backdrop-blur-xl
                            hover:border-violet-500/40
                            hover:shadow-[0_20px_50px_rgba(124,58,237,0.18)]
                            transition-all duration-300
                        "
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                width={80}
                                height={80}
                                className="
        rounded-full
        object-cover
        border-2 border-slate-700
        group-hover:border-violet-500/50
        transition-all duration-300
    "
                            />

                            <div className="
                                absolute -bottom-1 -right-1
                                w-7 h-7
                                rounded-full
                                bg-gradient-to-r
                                from-violet-600
                                to-indigo-600
                                text-white
                                flex items-center justify-center
                                text-xs font-bold
                            ">
                                #{index + 1}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="text-lg text-white font-bold">
                                {user.name}
                            </h3>

                            <p className="text-slate-400 mt-1 text-sm">
                                Completed Deliveries
                            </p>

                            <p className="
                                text-2xl font-extrabold mt-2
                                bg-gradient-to-r
                                from-violet-500
                                to-indigo-500
                                bg-clip-text
                                text-transparent
                            ">
                                {user.deliveries}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default TopLibrarians;