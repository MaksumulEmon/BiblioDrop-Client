
"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
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
} from "react-icons/fa";
import { Avatar } from "@heroui/react";
import { MdOutlineAddCircleOutline } from "react-icons/md";

const DashboardSideBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user;

    const handleLogout = async () => {
        await authClient.signOut();
        redirect("/");
    };

    const reader = [
        {
            key: "overview",
            label: "Overview",
            icon: FaUsers,
            href: "/dashboard/organizer",
        },
        {
            key: "deliveryHistory",
            label: "Delivery History",
            icon: FaBuilding,
            href: "/dashboard/organizer/organization",
        },
        {
            key: "myReadingList",
            label: "My Reading List",
            icon: FaPlus,
            href: "/dashboard/organizer/add-event",
        },
        {
            key: "myReviews",
            label: "My Reviews",
            icon: FaCalendarAlt,
            href: "/dashboard/organizer/manage-events",
        },
        {
            key: "attendees",
            label: "Attendees",
            icon: FaUsers,
            href: "/dashboard/organizer/attendees",
        },
    ];

    const librarian = [
        {
            key: "overview",
            label: "Overview",
            icon: FaUserCircle,
            href: "/dashboard/librarian/overview",
        },
        {
            key: "addBook",
            label: "Add Book",
            icon: MdOutlineAddCircleOutline ,
            href: "/dashboard/librarian/addbook",
        },
        {
            key: "manageInventory",
            label: "Manage Inventory",
            icon: FaHistory,
            href: "/dashboard/librarian/manageInventory",
        },
        {
            key: "manageDeliveries",
            label: "Manage Deliveries",
            icon: FaCalendarMinus,
            href: "/dashboard/attendee/payments",
        },
    ];

    const admin = [
        {
            key: "users",
            label: "Users",
            icon: FaUserShield,
            href: "/dashboard/users",
        },
        {
            key: "events",
            label: "Approve Events",
            icon: FaCalendarAlt,
            href: "/dashboard/events",
        },
        {
            key: "manageUsers",
            label: "Manage Users",
            icon: FaHistory,
            href: "/dashboard/transactions",
        },
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
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    >
                        <Menu size={20} />
                    </button>

                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold">
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
            <aside
                className={`
                    fixed lg:static top-0 left-0 z-50
                    w-64 h-screen border-r border-white/10 bg-[#121212]
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0
                `}
            >
                <div className="h-full flex flex-col bg-[#111827]">

                    {/* Mobile Close */}
                    <div className="lg:hidden flex justify-end p-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white"
                        >
                            <X size={24} />
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
                                    className="group w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300"
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