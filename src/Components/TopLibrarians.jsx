import React from "react";

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

const TopLibrarians = () => {
    return (
        <section className="py-14 px-4 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-100 mb-10">
                Top Librarians
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {topLibrarians.map((user, index) => (
                    <div
                        key={user.id}
                        className="flex items-center gap-5 p-8 rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-md hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 shadow-lg"
                    >
                        {/* Avatar */}
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover border border-slate-700"
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="text-lg text-slate-100 font-semibold">
                                {user.name}
                            </h3>

                            <p className="text-slate-400 mt-1 text-sm">
                                Completed Deliveries
                            </p>

                            <p className="text-2xl font-bold text-slate-200 mt-1">
                                {user.deliveries}
                            </p>
                        </div>

                        {/* Rank */}
                        <div className="text-slate-400 text-lg font-bold">
                            #{index + 1}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TopLibrarians;