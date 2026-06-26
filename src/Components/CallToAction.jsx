import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
    return (
        <section className="relative py-20 px-5 overflow-hidden">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 blur-3xl" />

            <div className="relative max-w-6xl mx-auto">

                <div
                    className="
                        rounded-[32px]
                        border border-white/10
                        bg-gradient-to-br
                        from-slate-900
                        via-slate-950
                        to-black
                        p-10 md:p-16
                        text-center
                        overflow-hidden
                    "
                >

                    <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full" />

                    <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
                        📚 Join BiblioDrop Today
                    </span>

                    <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
                        Ready To Discover
                        <br />
                        Your Next Favorite Book?
                    </h2>

                    <p className="mt-6 text-slate-400 max-w-2xl mx-auto leading-8">
                        Browse thousands of books shared by our trusted librarians.
                        Request delivery, explore different categories, and enjoy
                        a seamless reading experience with BiblioDrop.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

                        <Link
                            href="/all-books"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                bg-gradient-to-r
                                from-blue-600
                                to-purple-600
                                px-8
                                py-4
                                font-semibold
                                text-white
                                hover:scale-105
                                transition
                            "
                        >
                            Browse Books
                            <FaArrowRight />
                        </Link>

                        <Link
                            href="/signup"
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-2xl
                                border
                                border-white/10
                                bg-white/5
                                px-8
                                py-4
                                text-white
                                font-semibold
                                hover:bg-white/10
                                transition
                            "
                        >
                            Become a Member
                        </Link>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default CallToAction;