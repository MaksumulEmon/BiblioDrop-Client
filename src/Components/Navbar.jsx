"use client";

import React, { useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { Moon, Menu, X, Home, BookOpen, Info, ChevronRight, LogIn, UserPlus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Link from "next/link";
import NavLink from "./NavLink";
import { authClient } from "@/lib/auth-client";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import toast from "react-hot-toast";


const Navbar = () => {
    // const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    console.log(user)

    const handleSignOut = async () => {
        await authClient.signOut();
        toast.error('Logout')
        redirect("/")
    };

    const pathname = usePathname()
    if (pathname.includes('dashboard')) {
        return null;
    }

    return (
        <nav className="relative sticky top-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/10">

            {/* Bottom Glow Line */}
            <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-purple-500/50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* LEFT SIDE */}
                    <div className="flex items-center space-x-8">

                        {/* Logo */}
                        <Link
                            href="/"
                            className="text-xl sm:text-2xl font-bold tracking-tight"
                        >
                            <span className="text-white">Biblio</span>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Drop
                            </span>
                        </Link>


                    </div>



                    {/* Desktop Nav middle */}
                    <div className="hidden md:flex items-center space-x-6">
                        <NavLink href="/">Home</NavLink>
                        <NavLink href="/all-books">Browse Books</NavLink>
                        <NavLink href="/about">About</NavLink>
                    </div>


                    {/* RIGHT SIDE */}
                    <div className="hidden md:flex items-center space-x-4">

                        {!user && (
                            <div className="hidden items-center gap-4 md:flex">
                                <Link href="/signin">Login</Link>
                                <Link href="/signup">
                                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-5 py-2  hover:scale-105 transition rounded-2xl">
                                        Signup
                                    </button>
                                </Link>
                            </div>
                        )}


                        {user && (
                            <div className="hidden items-center gap-4 md:flex">
                                <Dropdown>
                                    <Dropdown.Trigger className="rounded-full">
                                        <Avatar size="sm" aria-label="Menu">
                                            <Avatar.Image
                                                referrerPolicy="no-referrer"
                                                alt="John Doe"
                                                src={user?.image}
                                            />
                                            <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
                                        </Avatar>
                                    </Dropdown.Trigger>
                                    <Dropdown.Popover>
                                        <div className="px-3 pt-3 pb-1 mr-2">
                                            <div className="flex items-center gap-2">
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
                                                <div className="flex flex-col gap-0">
                                                    <p className="text-sm leading-5 font-medium">
                                                        {user?.name}
                                                    </p>
                                                    <p className="text-xs leading-none text-muted">
                                                        {user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Dropdown.Menu
                                            onAction={(key) => console.log(`Selected: ${key}`)}
                                        >
                                            <Dropdown.Item id="new-file" textValue="New file">
                                                <Link
                                                    className="flex items-center gap-2"
                                                    href={user?.role === "reader" ? "/dashboard/user" : user?.role === "librarian" ? "/dashboard/librarian" : user?.role === "admin" ? "/dashboard/admin" : "/"}
                                                >
                                                    <MdDashboard />
                                                    <Label>Dashboard</Label>
                                                </Link>
                                            </Dropdown.Item>
                                            {/* 
                                            <Dropdown.Item id="copy-link" textValue="Copy link">
                                                <CgProfile />
                                                <Label>Profile</Label>
                                            </Dropdown.Item> */}



                                            <Dropdown.Item id="copy-link" textValue="Profile">
                                                <Link
                                                    href="/profile"
                                                    className="flex items-center gap-2 w-full"
                                                >
                                                    <CgProfile />
                                                    <Label>Profile</Label>
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                                id="delete-file"
                                                textValue="Delete file"
                                                variant="danger"
                                                onClick={handleSignOut}
                                            >
                                                <BiLogOut />
                                                <Label>Logout</Label>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Popover>
                                </Dropdown>
                            </div>
                        )}

                    </div>

                    {/* MOBILE BUTTONS */}
                    <div className="md:hidden flex items-center gap-3">

                        {user && (
                            <Dropdown>
                                <Dropdown.Trigger className="rounded-full">
                                    <Avatar size="sm">
                                        <Avatar.Image
                                            src={user?.image}
                                            alt={user?.name}
                                            referrerPolicy="no-referrer"
                                        />
                                        <Avatar.Fallback>
                                            {user?.name?.charAt(0)}
                                        </Avatar.Fallback>
                                    </Avatar>
                                </Dropdown.Trigger>

                                <Dropdown.Popover>
                                    <div className="px-3 pt-3 pb-2">
                                        <div className="flex items-center gap-3">
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

                                            <div>
                                                <p className="text-sm font-medium">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Dropdown.Menu>

                                        {/* <Dropdown.Item>
                                            <Link
                                                href={`/dashboard/${user?.role}`}
                                                className="flex items-center gap-2"
                                            >
                                                <MdDashboard />
                                                <Label>Dashboard</Label>
                                            </Link>
                                        </Dropdown.Item> */}


                                        <Dropdown.Item id="new-file" textValue="New file">
                                            <Link
                                                className="flex items-center gap-2"
                                                href={user?.role === "reader" ? "/dashboard/user" : user?.role === "librarian" ? "/dashboard/librarian" : user?.role === "admin" ? "/dashboard/admin" : "/"}
                                            >
                                                <MdDashboard />
                                                <Label>Dashboard</Label>
                                            </Link>
                                        </Dropdown.Item>

                                        {/* <Dropdown.Item>
                                            <div className="flex items-center gap-2">
                                                <CgProfile />
                                                <Label>Profile</Label>
                                            </div>
                                        </Dropdown.Item> */}


                                        <Dropdown.Item>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 w-full"
                                            >
                                                <CgProfile />
                                                <Label>Profile</Label>
                                            </Link>
                                        </Dropdown.Item>
                                        

                                        <Dropdown.Item
                                            variant="danger"
                                            onClick={handleSignOut}
                                        >
                                            <BiLogOut />
                                            <Label>Logout</Label>
                                        </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        )}

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                            className={`relative w-10 h-10 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 border ${
                                isOpen
                                    ? "bg-violet-500/15 border-violet-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                    : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                            }`}
                        >
                            <span
                                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    isOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    isOpen ? "opacity-0 scale-x-0" : "opacity-100"
                                }`}
                            />
                            <span
                                className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${
                                    isOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                            />
                        </button>

                    </div>

                </div>
            </div>


            {/* PROFESSIONAL ANIMATED MOBILE MENU */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden overflow-hidden border-t border-white/10 bg-[#0D0D0D]/98 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative"
                    >
                        {/* Ambient subtle glow */}
                        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-l from-violet-600/15 to-transparent blur-2xl pointer-events-none" />

                        <div className="px-4 py-5 space-y-2 relative z-10">
                            {/* Routes */}
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    pathname === "/"
                                        ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white border border-violet-500/25 shadow-sm"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`p-2 rounded-lg transition-colors ${
                                        pathname === "/" ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-slate-400 group-hover:text-white"
                                    }`}>
                                        <Home size={16} />
                                    </span>
                                    <span>Home</span>
                                </div>
                                {pathname === "/" ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                ) : (
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition" />
                                )}
                            </Link>

                            <Link
                                href="/all-books"
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    pathname === "/all-books"
                                        ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white border border-violet-500/25 shadow-sm"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`p-2 rounded-lg transition-colors ${
                                        pathname === "/all-books" ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-slate-400 group-hover:text-white"
                                    }`}>
                                        <BookOpen size={16} />
                                    </span>
                                    <span>Browse Books</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 font-medium border border-violet-500/20">
                                        Catalog
                                    </span>
                                    {pathname === "/all-books" ? (
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                    ) : (
                                        <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition" />
                                    )}
                                </div>
                            </Link>

                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className={`group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                    pathname === "/about"
                                        ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/10 text-white border border-violet-500/25 shadow-sm"
                                        : "text-slate-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`p-2 rounded-lg transition-colors ${
                                        pathname === "/about" ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-slate-400 group-hover:text-white"
                                    }`}>
                                        <Info size={16} />
                                    </span>
                                    <span>About</span>
                                </div>
                                {pathname === "/about" ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                ) : (
                                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition" />
                                )}
                            </Link>

                            {/* Divider */}
                            <div className="my-3 border-t border-white/10" />

                            {/* User Section or Auth Buttons */}
                            {user ? (
                                <div className="pt-1 space-y-2">
                                    {/* Compact User Card */}
                                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar size="sm">
                                                <Avatar.Image src={user?.image} alt={user?.name} referrerPolicy="no-referrer" />
                                                <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                                            </Avatar>
                                            <div className="leading-tight overflow-hidden">
                                                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                                                <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                                                    {user?.role}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            href={user?.role === "reader" ? "/dashboard/user" : user?.role === "librarian" ? "/dashboard/librarian" : user?.role === "admin" ? "/dashboard/admin" : "/"}
                                            onClick={() => setIsOpen(false)}
                                            className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                                        >
                                            <MdDashboard size={13} />
                                            <span>Dashboard</span>
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1">
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
                                        >
                                            <CgProfile size={14} />
                                            <span>Profile</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                handleSignOut();
                                            }}
                                            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 flex items-center justify-center gap-2 transition cursor-pointer"
                                        >
                                            <BiLogOut size={14} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-2 flex flex-col gap-2.5">
                                    <Link
                                        href="/signin"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full"
                                    >
                                        <button className="w-full rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 py-3 text-xs sm:text-sm font-medium text-white flex items-center justify-center gap-2 transition">
                                            <LogIn size={15} />
                                            <span>Login</span>
                                        </button>
                                    </Link>

                                    <Link
                                        href="/signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full"
                                    >
                                        <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition">
                                            <UserPlus size={15} />
                                            <span>Create Account</span>
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </nav>
    );
};

export default Navbar;