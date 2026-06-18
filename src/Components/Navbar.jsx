'use client';

import React, { useState } from 'react';
// import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {  Moon, Menu, X } from 'lucide-react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import NavLink from './NavLink';



// ২. মূল Navbar কম্পোনেন্ট
const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনুর জন্য স্টেট

    return (
        <nav className="bg-white border-b border-gray-200 font-sans sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* বাম পাশ: লোগো এবং ডেক্সটপ মেনু লিংক */}
                    <div className="flex items-center space-x-8">
                        <Link href="/" className="text-[#003399] font-bold text-xl tracking-tight shrink-0">
                            BiblioDrop
                        </Link>

                        {/* ডেক্সটপ লিংকসমূহ */}
                        <div className="hidden md:flex items-center space-x-6">
                            <NavLink href="/">Home</NavLink>
                            <NavLink href="/browse">Browse Books</NavLink>
                            <NavLink href="/about">About</NavLink>
                        </div>
                    </div>

                    {/* ডান পাশ: সার্চ বার এবং ডার্ক মোড আইকন */}
                    <div className="hidden md:flex items-center space-x-5">


                        {/* ডার্ক মোড আইকন */}
                        <button className="text-gray-700 hover:text-black p-1">
                            <Moon className="w-5 h-5 transform rotate-[-15deg]" />
                        </button>

                        <div>
                            <Button variant='danger'>Log in</Button>
                        </div>
                    </div>

                    {/* মোবাইল মেনু বাটন */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-[#003399] focus:outline-none p-2"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* মোবাইল ড্রয়ার মেনু */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-3 shadow-inner">
             
                    {/* মোবাইল লিংকসমূহ */}
                    <Link href="/" className={`block font-semibold text-base py-1 ${pathname === '/' ? 'text-[#003399]' : 'text-gray-600'}`}>Home</Link>
                    <Link href="/browse" className={`block font-semibold text-base py-1 ${pathname === '/browse' ? 'text-[#003399]' : 'text-gray-600'}`}>Browse Books</Link>
                    <Link href="/about" className={`block font-semibold text-base py-1 ${pathname === '/about' ? 'text-[#003399]' : 'text-gray-600'}`}>About</Link>

                    {/* ডার্ক মোড বাটন */}
                    <div className="border-t border-gray-100 pt-3">
                        <button className="text-gray-600 p-1 flex items-center space-x-2 text-sm w-full">
                            <Moon className="w-4 h-4" /> <span>Dark Mode</span>
                        </button>
                    </div>



                    <div>
                        <Button variant='danger'>Log in</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

