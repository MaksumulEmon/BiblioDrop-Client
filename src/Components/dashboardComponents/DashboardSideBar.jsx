
"use client"
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaBuilding, FaCalendarAlt, FaHistory, FaHome, FaPlus, FaSignOutAlt, FaTicketAlt, FaUserCircle, FaUsers, FaUserShield } from "react-icons/fa";


const DashboardSideBar = () => {

    const { data: session } = authClient.useSession();
    const user = session?.user;



    const handleLogout = async () => {
        await authClient.signOut();
        redirect('/')
    };


    const reader = [
        { key: "overview", label: "Overview", icon: FaUsers, href: "/dashboard/organizer" },
        { key: "deliveryHistory", label: "Delivery History", icon: FaBuilding, href: "/dashboard/organizer/organization" },
        { key: "myReadingList", label: "My Reading List", icon: FaPlus, href: "/dashboard/organizer/add-event" },
        { key: "myReviews", label: "My Reviews", icon: FaCalendarAlt, href: "/dashboard/organizer/manage-events" },
        { key: "attendees", label: "Attendees", icon: FaUsers, href: "/dashboard/organizer/attendees" },
    ]

    const librarian = [
        { key: "overview", label: "Overview", icon: FaUserCircle, href: "/dashboard/attendee" },
        { key: "addBook", label: "Add Book", icon: FaTicketAlt, href: "/dashboard/attendee/tickets" },
        { key: "manageInventory", label: "Manage Inventory", icon: FaHistory, href: "/dashboard/attendee/payments" },
    ]

    const admin = [
        { key: "users", label: "Users", icon: FaUserShield, href: "/dashboard/users" },
        { key: "events", label: "Approve Events", icon: FaCalendarAlt, href: "/dashboard/events" },
        { key: "manageUsers", label: "Manage Users", icon: FaHistory, href: "/dashboard/transactions" },
    ]

    const role = user?.role;


    const manuItems = role === "reader" ? reader : role === "librarian" ? librarian : role === "admin" ? admin : null;

    return (
        <aside className="w-64 h-screen border-r border-white/10 bg-[#121212]">
            <div className="h-full flex flex-col bg-[#111827] ">


                {/* User Profile */}
                <div className="px-6 py-5 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/60 shrink-0">
                            <Image
                                width={40}
                                height={40}
                                src={user?.image || null}
                                alt="Avatar"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate leading-tight">
                                {user?.name}
                            </p>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "text-yellow-400" : role == "reader" ? "text-indigo-400" : "text-pink-400"}`}>
                                {role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-3 pb-2">Navigation</p>
                    {
                        manuItems?.map(({ key, label, icon: Icon, href }) => {

                            return (
                                <Link
                                    key={key}
                                    href={href}
                                    className={`group w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300`}
                                >
                                    <span className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-blue-400 group-hover:bg-white/10 transition-all duration-300">
                                        <Icon size={20} />
                                    </span>
                                    <span>{label}</span>

                                    {/* 
                                    {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />} */}
                                </Link>
                            )
                        })
                    }

                </nav>

                {/* Bottom Links */}
                <div className="px-3 py-4 border-t border-white/5 space-y-1">
                    <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150">
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
    );
};

export default DashboardSideBar;
