'use client';

import React from 'react';
import Link from 'next/link';
import { FaFacebook } from 'react-icons/fa';
import { BsInstagram, BsTwitter } from 'react-icons/bs';
import { GiThunderBlade } from 'react-icons/gi';
import { Mail, MapPin, Phone } from 'lucide-react';


const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 font-sans text-gray-600">
            {/* মেইন ফুটার কন্টেন্ট */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* ১ নম্বর কলাম: ব্র্যান্ড লোগো ও বর্ণনা */}
                    <div className="space-y-4">
                        <Link href="/" className="text-[#003399] font-bold text-xl tracking-tight">
                            BiblioDrop
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your ultimate digital library companion. Discover, borrow, and manage your favorite books seamlessly anytime, anywhere.
                        </p>
                        {/* সোশ্যাল মিডিয়া আইকনসমূহ */}
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-[#003399] transition-colors">
                                <FaFacebook className="w-5 h-5" /> 
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#003399] transition-colors">
                                <BsTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#003399] transition-colors">
                                <BsInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#003399] transition-colors">
                                <GiThunderBlade className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* ২ নম্বর কলাম: কুইক লিংকস */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/" className="hover:text-[#003399] transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/browse" className="hover:text-[#003399] transition-colors">Browse Books</Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-[#003399] transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#003399] transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* ৩ নম্বর কলাম: ক্যাটাগরি / রিসোর্স */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Resources
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link href="/help" className="hover:text-[#003399] transition-colors">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-[#003399] transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[#003399] transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[#003399] transition-colors">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* ৪ নম্বর কলাম: কন্টাক্ট ইনফো */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-[#003399] shrink-0 mt-0.5" />
                                <span>123 Library Avenue, Knowledge City, BD</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-[#003399] shrink-0" />
                                <span>+880 1234-567890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-[#003399] shrink-0" />
                                <span>support@bibliodrop.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* নিচের ছোট কপিরাইট অংশ */}
            <div className="bg-gray-50 border-t border-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 space-y-3 sm:space-y-0">
                    <div>
                        &copy; {new Date().getFullYear()} BiblioDrop. All rights reserved.
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:underline">Privacy</a>
                        <a href="#" className="hover:underline">Terms</a>
                        <a href="#" className="hover:underline">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;