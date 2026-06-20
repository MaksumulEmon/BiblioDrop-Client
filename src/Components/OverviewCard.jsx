import { BookMarked, Truck, Wallet } from "lucide-react";

const stats = [
    {
        icon: BookMarked,
        badge: "+4 this month",
        label: "Total Books Read",
        value: "24",
    },
    {
        icon: Truck,
        badge: "Arriving soon",
        label: "Pending Deliveries",
        value: "2",
    },
    {
        icon: Wallet,
        badge: "Total Value",
        label: "Total Spent",
        value: "$58.50",
    },
];

const OverviewCard = () => {
    return (
        <div className="text-white">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Welcome back, Reader
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Here is what is happening with your BiblioDrop account today.
                </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {stats.map(({ icon: Icon, badge, label, value }) => (
                    <div
                        key={label}
                        className="
                        relative overflow-hidden
                        rounded-2xl p-5
                        border border-white/10
                        bg-slate-900/60
                        backdrop-blur-xl
                        shadow-lg
                        hover:shadow-pink-500/10
                        hover:border-pink-500/30
                        transition-all duration-300
                        hover:-translate-y-1
                    "
                    >
                        {/* glow effect */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-pink-500/10 via-transparent to-indigo-500/10" />

                        {/* Top */}
                        <div className="relative flex items-start justify-between">
                            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-pink-400" />
                            </div>

                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                                {badge}
                            </span>
                        </div>

                        {/* Bottom */}
                        <div className="relative mt-4">
                            <p className="text-sm text-slate-400">{label}</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {value}
                            </p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default OverviewCard;