
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
    FaBuilding,
    FaCalendarAlt,
    FaCalendarMinus,
    FaHistory,
    FaHome,
    FaPlus,
    FaSignOutAlt,
    FaTicketAlt,
    FaUserCircle,
    FaUsers,
    FaUserShield,
    FaBookOpen,
    FaTruck,
    FaStar,
    FaDollarSign,
    FaChartBar,
    FaChartPie,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Avatar } from "@heroui/react";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import toast from "react-hot-toast";

const DashboardSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut();
        toast.error("Logout")
        redirect("/");
    };

    const pathname = usePathname();

    const reader = [
        {
            key: "overview",
            label: "Overview",
            icon: FaChartBar,
            href: "/dashboard/user",
        },
        {
            key: "deliveries",
            label: "Delivery History",
            icon: FaTruck,
            href: "/dashboard/user/deliveries",
        },
        {
            key: "readingList",
            label: "My Reading List",
            icon: FaBookOpen,
            href: "/dashboard/user/reading-list",
        },
        {
            key: "reviews",
            label: "My Reviews",
            icon: FaStar,
            href: "/dashboard/user/reviews",
        },
        {
            key: "profile",
            label: "Profile",
            icon: FaUserCircle,
            href: "/dashboard/user/profile",
        },
    ];

    const librarian = [
        {
            key: "overview",
            label: "Overview",
            icon: FaChartBar,
            href: "/dashboard/librarian",
        },
        {
            key: "addBook",
            label: "Add Book",
            icon: MdOutlineAddCircleOutline,
            href: "/dashboard/librarian/add-book",
        },
        {
            key: "inventory",
            label: "Inventory",
            icon: FaBookOpen,
            href: "/dashboard/librarian/inventory",
        },
        {
            key: "deliveries",
            label: "Deliveries",
            icon: FaTruck,
            href: "/dashboard/librarian/deliveries",
        },
        // {
        //     key: "earnings",
        //     label: "Earnings",
        //     icon: FaDollarSign,
        //     href: "/dashboard/librarian/earnings",
        // },
    ];

    const admin = [
        {
            key: "overview",
            label: "Overview",
            icon: FaHome,
            href: "/dashboard/admin",
        },
        {
            key: "bookApprovals",
            label: "Books Approval",
            icon: FaCalendarAlt,
            href: "/dashboard/admin/book-approvals",
        },
        {
            key: "users",
            label: "Manage User",
            icon: FaUsers,
            href: "/dashboard/admin/users",
        },
        {
            key: "books",
            label: "Manage Books",
            icon: FaBookOpen,
            href: "/dashboard/admin/books",
        },

        {
            key: "transactions",
            label: "Transactions",
            icon: FaTicketAlt,
            href: "/dashboard/admin/transactions",
        },
        {
            key: "anomalies",
            label: "AI Anomaly Detection",
            icon: FaExclamationTriangle,
            href: "/dashboard/admin/anomalies",
        },
        // {
        //     key: "analytics",
        //     label: "Analytics",
        //     icon: FaChartPie,
        //     href: "/dashboard/admin/analytics",
        // },
    ];

    const role = user?.role;

    const manuItems =
        role === "reader"
            ? reader
            : role === "librarian"
                ? librarian
                : role === "admin"
                    ? admin
                    : [];

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-16 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">

                {/* Left */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setIsOpen(true)}
                        aria-label="Open sidebar menu"
                        className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/30 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 text-slate-200 hover:text-white"
                    >
                        <span className="block h-0.5 w-5 rounded-full bg-current transition-all" />
                        <span className="block h-0.5 w-3.5 -translate-x-[3px] rounded-full bg-current transition-all" />
                        <span className="block h-0.5 w-5 rounded-full bg-current transition-all" />
                    </button>

                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold">
                            <span className="text-white">Biblio</span>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Drop
                            </span>
                        </span>
                    </Link>

                </div>

                {/* Right */}
                {user && (
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10">

                        <Avatar>
                            <Avatar.Image
                                src={user?.image}
                                alt={user?.name}
                                referrerPolicy="no-referrer"
                            />
                            <Avatar.Fallback>
                                {user?.name?.charAt(0)}
                            </Avatar.Fallback>
                        </Avatar>
                    </div>
                )}

            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
            )}

            {/* Sidebar */}

            {/* <aside
                className={`
                    fixed lg:static top-0 left-0 z-50
                    w-64 h-screen border-r border-white/10 bg-[#121212]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            > */}

            <aside
                className={`
        fixed lg:sticky
        lg:top-0
        top-0 left-0 z-50
        w-64 h-screen
        border-r border-white/10
        bg-[#121212]
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
    `}
            >

                <div className="h-full flex flex-col bg-[#111827]">

                    {/* Mobile Close Header */}
                    <div className="lg:hidden flex justify-between items-center p-4 border-b border-white/5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation Menu</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close sidebar menu"
                            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="px-6 py-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2  shrink-0">

                                <Avatar>
                                    <Avatar.Image
                                        src={user?.image}
                                        alt={user?.name}
                                        referrerPolicy="no-referrer"
                                    />
                                    <Avatar.Fallback>
                                        {user?.name?.charAt(0)}
                                    </Avatar.Fallback>
                                </Avatar>
                            </div>

                            <div className="overflow-hidden">
                                <p className="text-white text-sm font-bold truncate leading-tight">
                                    {user?.name}
                                </p>

                                <span
                                    className={`text-[10px] font-bold uppercase tracking-wider ${role === "admin"
                                        ? "text-yellow-400"
                                        : role === "reader"
                                            ? "text-indigo-400"
                                            : "text-pink-400"
                                        }`}
                                >
                                    {role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1">
                        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-3 pb-2">
                            Navigation
                        </p>

                        {manuItems?.map(
                            ({ key, label, icon: Icon, href }) => (
                                <Link
                                    key={key}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={`group w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300    ${pathname === href
                                        ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-white border border-violet-500/20"
                                        : "text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-indigo-500/10"
                                        } `}
                                >
                                    <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-400 group-hover:bg-white/10 transition-all duration-300">
                                        <Icon size={20} />
                                    </span>

                                    <span>{label}</span>
                                </Link>
                            )
                        )}
                    </nav>

                    {/* Bottom */}
                    <div className="px-3 py-4 border-t border-white/5 space-y-1">

                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150"
                        >
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                <FaHome size={13} />
                            </span>

                            Back to Site
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
                        >
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                <FaSignOutAlt size={13} />
                            </span>

                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DashboardSideBar;