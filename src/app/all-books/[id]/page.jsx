
import { EditModal } from "@/Components/EditModal";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";

const DetailsPage = async ({ params }) => {
    const { id } = await params;

    const res = await fetch(
        `http://localhost:5000/librarian/${id}`,
        {
            cache: "no-store",
        }
    );

    const book = await res.json();


    const session = await auth.api.getSession({
        headers: await headers()
    });


    const isOwner = book.userId === session?.user?.id;


    return (
        <div className="min-h-screen bg-slate-950 text-white py-10">
            <div className="max-w-7xl mx-auto px-4">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Book Cover */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
                            <Image
                                src={book.image}
                                alt={book.title}
                                width={50}
                                height={50}
                                className="w-full rounded-2xl object-cover"
                            />
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="lg:col-span-2">

                        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8">

                            <div className="flex flex-wrap gap-3 mb-5">

                                <span className="px-4 py-1 rounded-full bg-violet-600 text-sm">
                                    {book.category}
                                </span>

                                <span
                                    className={`px-4 py-1 rounded-full text-sm ${book.status === "approved"
                                        ? "bg-green-500"
                                        : book.status === "rejected"
                                            ? "bg-red-500"
                                            : "bg-yellow-500 text-black"
                                        }`}
                                >
                                    {book.status}
                                </span>

                            </div>

                            <h1 className="text-5xl font-bold mb-2">
                                {book.title}
                            </h1>

                            <p className="text-slate-400 text-lg mb-8">
                                By {book.author}
                            </p>

                            <div className="bg-slate-800 rounded-2xl p-6 mb-8">

                                <h3 className="text-sm text-slate-400 mb-2">
                                    Delivery Fee
                                </h3>

                                <h2 className="text-4xl font-bold text-violet-400">
                                    ${book.deliveryFee}
                                </h2>

                            </div>
                            {
                                isOwner ? (
                                    <div className="grid md:grid-cols-3 gap-3">

                                         <EditModal book={book} />
                                      
{/* 
                                        <button className="bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-xl font-semibold transition">
                                            Unpublish
                                        </button> */}

                                        <button className="bg-red-600 hover:bg-red-700 py-4 rounded-xl font-semibold transition">
                                            Delete Book
                                        </button>
                                    </div>
                                ) : (
                                    <button className="w-full bg-violet-600 hover:bg-violet-700 transition py-4 rounded-xl font-semibold">
                                        Request Delivery
                                    </button>
                                )
                            }
                        </div>

                    </div>

                </div>

                {/* Description */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        Description
                    </h2>

                    <p className="text-slate-300 leading-8">
                        {book.description}
                    </p>

                </div>

                {/* Librarian Info */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 mt-8">

                    <h2 className="text-2xl font-bold mb-5">
                        Added By
                    </h2>

                    <div className="space-y-2">
                        <p>
                            <span className="text-slate-500">
                                Name:
                            </span>{" "}
                            {book.userName}
                        </p>

                        <p>
                            <span className="text-slate-500">
                                Email:
                            </span>{" "}
                            {book.userEmail}
                        </p>

                        <p>
                            <span className="text-slate-500">
                                Published:
                            </span>{" "}
                            {new Date(book.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DetailsPage;