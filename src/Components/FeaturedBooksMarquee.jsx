import Marquee from "react-fast-marquee";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import Bookcard from "./Bookcard";
import { getBooks } from "@/lib/api/book";

const FeaturedBooksMarquee = async () => {
    const books = await getBooks({
        page: 1,
    });

    const featuredBooks = books?.data?.slice(0, 12) || [];

    if (!featuredBooks.length) return null;

    return (
        <section className="py-10 overflow-hidden">

            {/* Heading */}
            <div className="max-w-7xl mx-auto px-5 mb-10">

                <div className="flex items-center justify-between flex-wrap gap-5">

                    <div>
                        <span className="text-violet-400 text-sm font-semibold uppercase tracking-[3px]">
                            Featured Collection
                        </span>

                        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-white">
                            Discover Popular Books
                        </h2>

                        <p className="mt-4 max-w-2xl text-slate-400">
                            Explore our hand-picked collection of the most
                            popular books available for delivery. Browse,
                            discover, and enjoy your next favorite read.
                        </p>
                    </div>

               

                </div>

            </div>

            {/* Marquee */}

            <Marquee
                speed={45}
                pauseOnHover
                gradient={true}
                gradientColor="#020617"
                gradientWidth={120}
            >

                {featuredBooks.map((book) => (

                    <div
                        key={book._id}
                        className="w-60 mx-4 shrink-0"
                    >
                        <Bookcard bookData={book} />
                    </div>

                ))}

            </Marquee>

        </section>
    );
};

export default FeaturedBooksMarquee;