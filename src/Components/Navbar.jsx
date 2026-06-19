"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Menu, X } from "lucide-react";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Link from "next/link";
import NavLink from "./NavLink";
import { authClient } from "@/lib/auth-client";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
    // const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    console.log(user)

    const handleSignOut = async () => {
        await authClient.signOut();
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
                            className="text-2xl font-bold tracking-tight"
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
                        <NavLink href="/browse">Browse Books</NavLink>
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
                                                    href={`/dashboard/${user?.role}/overview`}
                                                >
                                                    <MdDashboard />
                                                    <Label>Dashboard</Label>
                                                </Link>
                                            </Dropdown.Item>

                                            <Dropdown.Item id="copy-link" textValue="Copy link">
                                                <CgProfile />
                                                <Label>Profile</Label>
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

                    {/* MOBILE BUTTON */}
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

                                        <Dropdown.Item>
                                            <Link
                                                href={`/dashboard/${user?.role}`}
                                                className="flex items-center gap-2"
                                            >
                                                <MdDashboard />
                                                <Label>Dashboard</Label>
                                            </Link>
                                        </Dropdown.Item>

                                        <Dropdown.Item>
                                            <div className="flex items-center gap-2">
                                                <CgProfile />
                                                <Label>Profile</Label>
                                            </div>
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
                            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white hover:bg-white/10 transition"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>

                    </div>

                </div>
            </div>


            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-[#0D0D0D]/95 backdrop-blur-xl">

                    <div className="px-4 py-5 space-y-2">

                        {/* Routes */}
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className={`block rounded-xl px-4 py-3 transition ${pathname === "/"
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/browse"
                            onClick={() => setIsOpen(false)}
                            className={`block rounded-xl px-4 py-3 transition ${pathname === "/browse"
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            Browse Books
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className={`block rounded-xl px-4 py-3 transition ${pathname === "/about"
                                ? "bg-blue-500/10 text-blue-400"
                                : "text-slate-300 hover:bg-white/5"
                                }`}
                        >
                            About
                        </Link>

                        {/* Divider */}
                        <div className="my-4 border-t border-white/10" />

                        {/* USER LOGIC */}
                        {!user && (

                            <>
                                <Link
                                    href="/signin"
                                    onClick={() => setIsOpen(false)}
                                    className="block"
                                >
                                    <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-white hover:bg-white/10">
                                        Login
                                    </button>
                                </Link>

                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block"
                                >
                                    <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 font-medium text-white hover:opacity-90">
                                        Signup
                                    </button>
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            )}


        </nav>
    );
};

export default Navbar;