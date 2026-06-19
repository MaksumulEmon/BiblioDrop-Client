
'use client'
import React from 'react';
import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa';
import { BsInstagram, BsTwitter } from 'react-icons/bs';
import { GiThunderBlade } from 'react-icons/gi';
import { Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {

    const pathname = usePathname()
    if (pathname.includes('dashboard')) {
        return null;
    }
    return (
        <footer className="bg-white dark:bg-[#0B0B0F]/80 border-t border-gray-200 dark:border-zinc-800/80 font-sans text-gray-600 dark:text-zinc-400 transition-colors duration-200 backdrop-blur-sm">
            {/* মেইন ফুটার কন্টেন্ট */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* ১ নম্বর কলাম: ব্র্যান্ড লোগো ও বর্ণনা */}
                    <div className="space-y-4">
                        <Link href="/" className="text-[#003399] dark:text-blue-500 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity">
                            BiblioDrop
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
                            Your ultimate digital library companion. Discover, borrow, and manage your favorite books seamlessly anytime, anywhere.
                        </p>
                        {/* সোশ্যাল মিডিয়া আইকনসমূহ */}
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 dark:text-zinc-500 hover:text-[#003399] dark:hover:text-blue-500 transition-colors">
                                <FaFacebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 dark:text-zinc-500 hover:text-[#003399] dark:hover:text-blue-500 transition-colors">
                                <BsTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 dark:text-zinc-500 hover:text-[#003399] dark:hover:text-blue-500 transition-colors">
                                <BsInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 dark:text-zinc-500 hover:text-[#003399] dark:hover:text-blue-500 transition-colors">
                                <GiThunderBlade className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* ২ নম্বর কলাম: কুইক লিংকস */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-200 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/browse" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Browse Books</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* ৩ নম্বর কলাম: ক্যাটাগরি / রিসোর্স */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-200 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/help" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[#003399] dark:hover:text-blue-400 transition-colors">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* ৪ নম্বর কলাম: কন্টাক্ট ইনফো */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-200 uppercase tracking-wider mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-zinc-400">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-[#003399] dark:text-blue-500 shrink-0 mt-0.5" />
                                <span>123 Library Avenue, Knowledge City, BD</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-[#003399] dark:text-blue-500 shrink-0" />
                                <span>+880 1234-567890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-[#003399] dark:text-blue-500 shrink-0" />
                                <span>support@bibliodrop.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* নিচের ছোট কপিরাইট অংশ */}
            <div className="bg-gray-50 dark:bg-[#06060A]/90 border-t border-gray-100 dark:border-zinc-900/60 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 dark:text-zinc-500 space-y-3 sm:space-y-0">
                    <div>
                        &copy; {new Date().getFullYear()} BiblioDrop. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:underline hover:text-gray-600 dark:hover:text-zinc-300">Privacy</a>
                        <a href="#" className="hover:underline hover:text-gray-600 dark:hover:text-zinc-300">Terms</a>
                        <a href="#" className="hover:underline hover:text-gray-600 dark:hover:text-zinc-300">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
