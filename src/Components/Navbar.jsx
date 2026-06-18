"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Menu, X } from "lucide-react";
import { Button } from "@heroui/react";
import Link from "next/link";
import NavLink from "./NavLink";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

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

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/browse">Browse Books</NavLink>
                            <NavLink href="/about">About</NavLink>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="hidden md:flex items-center space-x-4">

                        {/* Dark Mode */}
                        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">
                            <Moon className="w-5 h-5" />
                        </button>

                        {/* Login Button */}
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium px-5 hover:scale-105 transition">
                            Log In
                        </Button>

                    </div>

                    {/* MOBILE BUTTON */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-slate-300 hover:text-white"
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
                <div className="md:hidden bg-[#111111] border-t border-white/10 px-4 py-4 space-y-2">

                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 font-medium ${pathname === "/"
                                ? "text-blue-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Home
                    </Link>

                    <Link
                        href="/browse"
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 font-medium ${pathname === "/browse"
                                ? "text-blue-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Browse Books
                    </Link>

                    <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className={`block py-2 font-medium ${pathname === "/about"
                                ? "text-blue-400"
                                : "text-slate-400 hover:text-white"
                            }`}
                    >
                        About
                    </Link>

                    <div className="pt-3 border-t border-white/10">
                        <button className="flex items-center gap-2 text-slate-400">
                            <Moon className="w-4 h-4" />
                            Dark Mode
                        </button>
                    </div>

                    <Button className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Log In
                    </Button>

                </div>
            )}
        </nav>
    );
};

export default Navbar;