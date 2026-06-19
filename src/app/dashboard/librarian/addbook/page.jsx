import React from 'react';

const AddBook = () => {
    return (
        <div className="max-w-5xl mx-auto">

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                    Add New Book
                </h2>
                <p className="text-slate-400 mt-2">
                    Add a new book to your inventory. Books will require admin approval before publication.
                </p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl">

                <form className="space-y-6">

                    {/* Book Cover */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Book Cover
                        </label>

                        <label className="flex items-center justify-center w-full h-56 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-purple-600 transition">
                            <div className="text-center">
                                <p className="text-slate-300 font-medium">
                                    Upload Book Cover
                                </p>
                                <p className="text-sm text-slate-500 mt-1">
                                    PNG, JPG up to 5MB
                                </p>
                            </div>

                            <input
                                type="file"
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Book Title
                            </label>

                            <input
                                type="text"
                                placeholder="Atomic Habits"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Author Name
                            </label>

                            <input
                                type="text"
                                placeholder="James Clear"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Category
                            </label>

                            <select className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600">
                                <option>Fiction</option>
                                <option>Academic</option>
                                <option>Science</option>
                                <option>Biography</option>
                                <option>History</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-2">
                                Delivery Fee
                            </label>

                            <input
                                type="number"
                                placeholder="50"
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-600"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm text-slate-300 mb-2">
                            Description
                        </label>

                        <textarea
                            rows="6"
                            placeholder="Write book description..."
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:outline-none focus:border-purple-600"
                        />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                        <p className="text-sm text-yellow-300">
                            All newly submitted books will be marked as
                            <span className="font-semibold">
                                {' '}Pending Approval
                            </span>
                            {' '}until reviewed by an administrator.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:opacity-90 transition cursor-pointer"
                    >
                        Add Book
                    </button>

                </form>

            </div>

        </div>
    );
};

export default AddBook;