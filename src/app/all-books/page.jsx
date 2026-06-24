

import Bookcard from '@/Components/Bookcard';
import BookCardSkeleton from '@/Components/BookCardSkeleton';

import { getBooks } from '@/lib/api/book';
import { Pagination, Table } from '@heroui/react';
import Link from 'next/link';
;
import React from 'react';

const AllBooks = async ({ searchParams }) => {
    const params = await searchParams;
    console.log(params)

    // const books = await getBooks(params.page);
    // console.log(books)


    const books = await getBooks({
        page: params.page || 1,
        search: params.search || "",
        category: params.category || "",
        minFee: params.minFee || "",
        maxFee: params.maxFee || "",
        availability: params.availability || "",
    });


    const page = Number(params.page) || 1;
    const pages = []
    const totalPages = books.totalPage;
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    console.log(pages)
    // console.log(page, totalPage, "emon")


    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-3xl mx-5 md:mx-0 pt-3 font-bold mb-8 text-transparent text-white drop-shadow-lg">
                Explore All Books
            </h1>


            <form
                action="/all-books"
                className="mb-8 mx-5 md:mx-0"
            >
                <div className="flex flex-col sm:flex-row gap-3">

                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search books by title..."
                            defaultValue={params?.search || ""}
                            className=" w-full h-11 md:h-12 px-4 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm md:text-base placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"/>

                    </div>

                    {/* Category */}
                    <select
                        name="category"
                        defaultValue={params?.category || ""}
                        className="w-full sm:w-20  md:w-52 h-11 md:h-12 px-4 rounded-xl md:rounded-2xl
                bg-slate-900
                border border-slate-800
                text-slate-300
                text-sm md:text-base
                focus:outline-none
                focus:border-violet-500
                focus:ring-2
                focus:ring-violet-500/20
                transition-all
            "
                    >
                        <option value="">All Categories</option>
                        <option value="Novel">Novel</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Biography">Biography</option>
                        <option value="Technology">Technology</option>
                    </select>

                    {/* Button */}
                    <button
                        type="submit"
                        className=" w-full
                sm:w-auto
                h-11 md:h-12
                px-6
                rounded-xl md:rounded-2xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                text-white
                text-sm md:text-base
                font-semibold
                shadow-lg
                shadow-violet-500/20
                hover:scale-[1.02]
                hover:shadow-violet-500/30
                transition-all
                duration-300
            "
                    >
                        Search
                    </button>

                </div>
            </form>

            <div className="grid mx-5 md:mx-0  md:grid-cols-2  lg:grid-cols-4  gap-6">

                {/* {books.data.map((book) => (
                    <Bookcard
                        key={book._id}
                        bookData={book}
                    />
                ))} */}



                {
                    books?.data?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">

                            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                                📚
                            </div>

                            <h2 className="text-2xl font-bold text-white">
                                No Books Found
                            </h2>

                            <p className="text-slate-400 mt-3 max-w-md">
                                We couldn't find any books matching your search or filters.
                                Try changing the book name or selecting a different category.
                            </p>

                            <Link
                                href="/all-books"
                                className="
                    mt-6
                    px-6
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    text-white
                    font-semibold
                    hover:scale-105
                    transition-all
                    duration-300
                "
                            >
                                Browse All Books
                            </Link>

                        </div>
                    ) : (
                        books.data.map((book) => (
                            <Bookcard
                                key={book._id}
                                bookData={book}
                            />
                        ))
                    )
                }


            </div>




            <Table.Footer className="mt-8 mb-5">
                <Pagination
                    size="sm"
                    className="w-full justify-center"
                >
                    <Pagination.Content className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">

                        {/* Previous */}
                        <Pagination.Item>
                            <Pagination.Previous
                                isDisabled={page === 1}
                                className="
                        h-9 md:h-10
                        rounded-xl
                        border border-slate-800
                        bg-slate-900
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                        transition-all duration-300
                    "
                            >
                                <Link
                                    href={`/all-books?page=${page - 1}`}
                                    className="flex items-center gap-1 md:gap-2 px-1 md:px-2"
                                >
                                    <Pagination.PreviousIcon />
                                    <span className="hidden sm:block">
                                        Previous
                                    </span>
                                </Link>
                            </Pagination.Previous>
                        </Pagination.Item>

                        {/* First Page */}
                        <Pagination.Item>
                            <Link href={`/all-books?page=1`}>
                                <Pagination.Link
                                    isActive={page === 1}
                                    className={
                                        page === 1
                                            ? `
                                    min-w-8 md:min-w-10
                                    h-8 md:h-10
                                    bg-gradient-to-r
                                    from-blue-600
                                    to-purple-600
                                    text-white
                                    shadow-lg
                                    border-none
                                  `
                                            : `
                                    min-w-8 md:min-w-10
                                    h-8 md:h-10
                                    bg-slate-900
                                    border border-slate-800
                                    text-slate-400
                                    hover:bg-slate-800
                                    hover:text-white
                                  `
                                    }
                                >
                                    1
                                </Pagination.Link>
                            </Link>
                        </Pagination.Item>

                        {/* Left Ellipsis */}
                        {page > 3 && (
                            <Pagination.Item>
                                <Pagination.Ellipsis className="text-slate-500" />
                            </Pagination.Item>
                        )}

                        {/* Dynamic Pages */}
                        {pages
                            .filter((p) => p !== 1 && p !== totalPages)
                            .map((p) => (
                                <Pagination.Item key={p}>
                                    <Link href={`/all-books?page=${p}`}>
                                        <Pagination.Link
                                            isActive={p === page}
                                            className={
                                                p === page
                                                    ? `
                                            min-w-8 md:min-w-10
                                            h-8 md:h-10
                                            bg-gradient-to-r
                                            from-blue-600
                                            to-purple-600
                                            text-white
                                            shadow-lg
                                            border-none
                                          `
                                                    : `
                                            min-w-8 md:min-w-10
                                            h-8 md:h-10
                                            bg-slate-900
                                            border border-slate-800
                                            text-slate-400
                                            hover:bg-slate-800
                                            hover:text-white
                                          `
                                            }
                                        >
                                            {p}
                                        </Pagination.Link>
                                    </Link>
                                </Pagination.Item>
                            ))}

                        {/* Right Ellipsis */}
                        {page < totalPages - 2 && (
                            <Pagination.Item>
                                <Pagination.Ellipsis className="text-slate-500" />
                            </Pagination.Item>
                        )}

                        {/* Last Page */}
                        {totalPages > 1 && (
                            <Pagination.Item>
                                <Link href={`/all-books?page=${totalPages}`}>
                                    <Pagination.Link
                                        isActive={page === totalPages}
                                        className={
                                            page === totalPages
                                                ? `
                                        min-w-8 md:min-w-10
                                        h-8 md:h-10
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-purple-600
                                        text-white
                                        shadow-lg
                                        border-none
                                      `
                                                : `
                                        min-w-8 md:min-w-10
                                        h-8 md:h-10
                                        bg-slate-900
                                        border border-slate-800
                                        text-slate-400
                                        hover:bg-slate-800
                                        hover:text-white
                                      `
                                        }
                                    >
                                        {totalPages}
                                    </Pagination.Link>
                                </Link>
                            </Pagination.Item>
                        )}

                        {/* Next */}
                        <Pagination.Item>
                            <Pagination.Next
                                isDisabled={page === totalPages}
                                className="
                        h-9 md:h-10
                        rounded-xl
                        border border-slate-800
                        bg-slate-900
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                        transition-all duration-300
                    "
                            >
                                <Link
                                    href={`/all-books?page=${page + 1}`}
                                    className="flex items-center gap-1 md:gap-2 px-1 md:px-2"
                                >
                                    <span className="hidden sm:block">
                                        Next
                                    </span>
                                    <Pagination.NextIcon />
                                </Link>
                            </Pagination.Next>
                        </Pagination.Item>

                    </Pagination.Content>
                </Pagination>
            </Table.Footer>
        </div>
    );
};

export default AllBooks;