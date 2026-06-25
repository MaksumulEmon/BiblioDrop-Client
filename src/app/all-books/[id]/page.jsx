
import { DeleteAlert } from "@/Components/DeleteAlert";
import { EditModal } from "@/Components/EditModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const DetailsPage = async ({ params }) => {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/librarian/${id}`,
        {
            cache: "no-store",
        }
    );

    const reviewRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/reviews/book/${id}`,
        {
            cache: "no-store",
        }
    );

    const reviews = await reviewRes.json();

    const book = await res.json();

    console.log(book);

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const isOwner = book?.userId === session?.user?.id;
    const isAdmin = session?.user?.role === "admin";

    if (!book || (book.status !== "published" && !isOwner && !isAdmin)) {
        return notFound();
    }


    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">


            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_35%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />


            <div className="relative max-w-7xl mx-auto px-4 py-12">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Book Cover */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-4">
                            <div className="relative w-full h-100 overflow-hidden rounded-2xl">
                                <Image
                                    src={book?.image}
                                    alt={book?.title}
                                    fill
                                    className="object-cover hover:scale-105 transition duration-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="lg:col-span-2">

                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-8">

                            <div className="flex flex-wrap gap-3 mb-5">

                                <span className="px-4 py-1 rounded-full bg-violet-600 text-sm">
                                    {book?.category}
                                </span>

                                <span
                                    className={`px-4 py-1 rounded-full text-sm ${book?.status === "approved"
                                        ? "bg-green-500"
                                        : book?.status === "rejected"
                                            ? "bg-red-500"
                                            : "bg-yellow-500 text-black"
                                        }`}
                                >
                                    {book?.status}
                                </span>

                            </div>
                            <h1 className="text-3xl  font-bold leading-tight  font-extrabold leading-tight bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparentf bg-clip-text text-transparent">
                                {book?.title}
                            </h1>

                            <p className="text-slate-400 text-lg mb-8">
                                By {book?.author}
                            </p>

                            <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 to-indigo-500/10 p-6 ">

                                <h3 className="text-sm text-slate-400 mb-2">
                                    Delivery Fee
                                </h3>

                                <h2 className="text-3xl font-black text-violet-400">
                                    ${book?.deliveryFee}
                                </h2>

                            </div>


                            {
                                isOwner ? (
                                    <div className="grid md:grid-cols-3 gap-3">

                                        <div className="flex gap-2 ">
                                            <EditModal book={book} />

                                            {/*                                             
                                        <button className="bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-xl font-semibold transition">
                                            Unpublish
                                        </button> */}

                                            {/* <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition">
                                            Delete Book
                                        </button> */}

                                            <DeleteAlert book={book} />

                                        </div>
                                    </div>
                                ) : (
                                    session?.user ? (
                                        <form action={'/api/payment'} method="POST">

                                            <input type="hidden" name="price" value={book.deliveryFee} />
                                            <input type="hidden" name="title" value={book.title} />
                                            <input type="hidden" name="productId" value={book._id} />
                                            <button type="submit" className="
w-full
rounded-2xl
py-4
font-semibold
bg-gradient-to-r
from-violet-600
to-indigo-600
hover:from-violet-500
hover:to-indigo-500
transition-all
duration-300
shadow-lg
shadow-violet-500/20 mt-3
">
                                                Request Delivery
                                            </button>
                                        </form>
                                    ) : (
                                        <Link
                                            href="/signin"
                                            className="w-full block text-center bg-violet-600 hover:bg-violet-700 transition py-4 rounded-xl font-semibold"
                                        >
                                            Login to Request Delivery
                                        </Link>
                                    )
                                )
                            }
                        </div>

                    </div>

                </div>

                {/* Description */}
                <div className="
mt-8
rounded-3xl
border border-white/10
bg-slate-900/40
backdrop-blur-xl
p-8
">

                    <h2 className="text-2xl font-bold mb-5">
                        Description
                    </h2>

                    <p className="text-slate-300 leading-8">
                        {book?.description}
                    </p>

                </div>



                <div className="mt-8 bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8">

                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">
                            Reviews ({reviews.length})
                        </h2>

                        <span className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium">
                            Reader Feedback
                        </span>
                    </div>

                    {
                        reviews.length === 0 ? (

                            <div className="flex flex-col items-center justify-center py-16 text-center">

                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl mb-4">
                                    ⭐
                                </div>

                                <h3 className="text-xl font-semibold text-white">
                                    No Reviews Yet
                                </h3>

                                <p className="text-slate-400 mt-2 max-w-md">
                                    This book hasn't received any reviews yet.
                                    Be the first reader to share your experience.
                                </p>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                {reviews.map((review) => (

                                    <div
                                        key={review._id}
                                        className="
                            group
                            relative
                            overflow-hidden
                            rounded-3xl
                            border border-slate-800
                            bg-gradient-to-b
                            from-slate-900
                            to-slate-950
                            p-6
                            transition-all
                            duration-300
                            hover:border-violet-500/30
                            hover:-translate-y-1
                            hover:shadow-[0_15px_40px_rgba(139,92,246,0.15)]
                        "
                                    >

                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />

                                        <div className="relative">

                                            <div className="flex items-center justify-between mb-4">

                                                <div>
                                                    <h4 className="font-bold text-white">
                                                        {review.userName}
                                                    </h4>

                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {new Date(
                                                            review.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-semibold">
                                                    ⭐ {review.rating}/5
                                                </div>

                                            </div>

                                            <p className="text-slate-300 leading-7 line-clamp-4">
                                                {review.comment}
                                            </p>

                                        </div>

                                    </div>

                                ))}
                            </div>

                        )
                    }

                </div>
            </div>




        </div>
    );
};

export default DetailsPage;