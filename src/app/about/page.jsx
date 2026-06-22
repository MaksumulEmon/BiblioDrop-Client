import React from "react";
import {
    BookOpen,
    Users,
    ShieldCheck,
    Truck,
    Library,
    Sparkles,
} from "lucide-react";

const AboutPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-5 py-12">

            {/* Hero Section */}
            <div className="text-center mb-20">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                    <Sparkles size={16} />
                    About BiblioDrop
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                    Bringing Books
                    <span className="text-purple-500"> Closer </span>
                    To Readers
                </h1>

                <p className="max-w-3xl mx-auto mt-6 text-slate-400 text-lg leading-8">
                    BiblioDrop is a modern online book borrowing and delivery
                    management platform designed to connect readers, librarians,
                    and administrators through a seamless digital experience.
                </p>
            </div>

            {/* Mission */}
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 mb-12">

                <h2 className="text-3xl font-bold text-white mb-4">
                    Our Mission
                </h2>

                <p className="text-slate-400 leading-8">
                    Our mission is to make books more accessible for everyone.
                    We help libraries manage their inventory digitally while
                    enabling readers to discover, request, and receive books
                    conveniently at their doorstep.
                </p>

            </div>

            {/* Features */}
            <div className="mb-20">

                <h2 className="text-3xl font-bold text-white text-center mb-10">
                    Platform Features
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <BookOpen className="text-purple-500 mb-4" size={32} />
                        <h3 className="text-white font-semibold mb-2">
                            Book Collection
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Browse thousands of books from different categories.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <Truck className="text-purple-500 mb-4" size={32} />
                        <h3 className="text-white font-semibold mb-2">
                            Home Delivery
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Request books and receive them at your doorstep.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <Library className="text-purple-500 mb-4" size={32} />
                        <h3 className="text-white font-semibold mb-2">
                            Inventory Management
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Librarians can manage books efficiently.
                        </p>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <ShieldCheck className="text-purple-500 mb-4" size={32} />
                        <h3 className="text-white font-semibold mb-2">
                            Secure System
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Protected authentication and role-based access.
                        </p>
                    </div>

                </div>

            </div>

            {/* Roles */}
            <div className="mb-20">

                <h2 className="text-3xl font-bold text-white text-center mb-10">
                    User Roles
                </h2>

                <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-indigo-400 mb-4">
                            Reader
                        </h3>

                        <ul className="space-y-2 text-slate-400">
                            <li>• Browse Books</li>
                            <li>• Request Delivery</li>
                            <li>• Track Requests</li>
                            <li>• Manage Borrowed Books</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-pink-400 mb-4">
                            Librarian
                        </h3>

                        <ul className="space-y-2 text-slate-400">
                            <li>• Add New Books</li>
                            <li>• Manage Inventory</li>
                            <li>• Update Book Status</li>
                            <li>• Monitor Requests</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                        <h3 className="text-xl font-bold text-yellow-400 mb-4">
                            Admin
                        </h3>

                        <ul className="space-y-2 text-slate-400">
                            <li>• Approve Books</li>
                            <li>• Manage Users</li>
                            <li>• Monitor Activities</li>
                            <li>• System Control</li>
                        </ul>
                    </div>

                </div>

            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-20">

                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center">
                    <h3 className="text-4xl font-black text-purple-500">
                        10K+
                    </h3>
                    <p className="text-slate-400 mt-2">
                        Books Available
                    </p>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center">
                    <h3 className="text-4xl font-black text-purple-500">
                        500+
                    </h3>
                    <p className="text-slate-400 mt-2">
                        Active Readers
                    </p>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center">
                    <h3 className="text-4xl font-black text-purple-500">
                        50+
                    </h3>
                    <p className="text-slate-400 mt-2">
                        Librarians
                    </p>
                </div>

                <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 text-center">
                    <h3 className="text-4xl font-black text-purple-500">
                        1200+
                    </h3>
                    <p className="text-slate-400 mt-2">
                        Deliveries
                    </p>
                </div>

            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-3xl p-10 text-center">

                <Users
                    size={50}
                    className="mx-auto text-purple-400 mb-4"
                />

                <h2 className="text-3xl font-bold text-white mb-4">
                    Join The Reading Community
                </h2>

                <p className="text-slate-400 max-w-2xl mx-auto">
                    Discover books, connect with libraries, and enjoy a
                    smarter reading experience through BiblioDrop.
                </p>

            </div>

        </div>
    );
};

export default AboutPage;