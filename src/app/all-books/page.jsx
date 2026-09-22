

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


    const buildUrl = (targetPage) => {
        const query = new URLSearchParams();
        if (targetPage) query.set("page", targetPage);
        if (params?.search) query.set("search", params.search);
        if (params?.category) query.set("category", params.category);
        if (params?.minFee) query.set("minFee", params.minFee);
        if (params?.maxFee) query.set("maxFee", params.maxFee);
        return `/all-books?${query.toString()}`;
    };

    const hasActiveFilters = Boolean(
        params?.search || params?.category || params?.minFee || params?.maxFee
    );

    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-2xl sm:text-3xl mx-4 sm:mx-5 md:mx-0 pt-3 font-bold mb-6 sm:mb-8 text-white drop-shadow-lg">
                Explore All Books
            </h1>

            <form
                action="/all-books"
                className="mb-8 mx-5 md:mx-0 bg-slate-950/60 p-4 rounded-2xl md:rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-md"
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">

                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search books by title..."
                            defaultValue={params?.search || ""}
                            className="w-full h-11 md:h-12 px-4 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-white text-sm md:text-base placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Category */}
                    <select
                        name="category"
                        defaultValue={params?.category || ""}
                        className="w-full sm:w-auto lg:w-48 h-11 md:h-12 px-4 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 text-sm md:text-base focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    >
                        <option value="">All Categories</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Biography">Biography</option>
                        <option value="Academic">Academic</option>
                    </select>

                    {/* Delivery Fee Range */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 sm:w-28 md:w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">$</span>
                            <input
                                type="number"
                                name="minFee"
                                min="0"
                                step="any"
                                placeholder="Min Fee"
                                defaultValue={params?.minFee || ""}
                                className="w-full h-11 md:h-12 pl-7 pr-3 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>

                        <span className="text-slate-500 text-sm font-bold">–</span>

                        <div className="relative flex-1 sm:w-28 md:w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">$</span>
                            <input
                                type="number"
                                name="maxFee"
                                min="0"
                                step="any"
                                placeholder="Max Fee"
                                defaultValue={params?.maxFee || ""}
                                className="w-full h-11 md:h-12 pl-7 pr-3 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs md:text-sm placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            type="submit"
                            className="flex-1 sm:flex-none h-11 md:h-12 px-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm md:text-base font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] hover:shadow-violet-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Filter
                        </button>

                        {hasActiveFilters && (
                            <Link
                                href="/all-books"
                                className="h-11 md:h-12 px-4 rounded-xl md:rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-sm font-medium transition shrink-0"
                                title="Reset all filters"
                            >
                                Reset
                            </Link>
                        )}
                    </div>

                </div>

                {/* Active Filter Tags */}
                {hasActiveFilters && (
                    <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">Active Filters:</span>
                        {params?.search && (
                            <span className="px-2.5 py-1 rounded-lg bg-violet-600/10 text-violet-300 border border-violet-500/20">
                                Title: &quot;{params.search}&quot;
                            </span>
                        )}
                        {params?.category && (
                            <span className="px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-300 border border-blue-500/20">
                                Category: {params.category}
                            </span>
                        )}
                        {(params?.minFee || params?.maxFee) && (
                            <span className="px-2.5 py-1 rounded-lg bg-green-600/10 text-green-300 border border-green-500/20 font-medium">
                                Delivery Fee: ${params.minFee || "0"} – ${params.maxFee || "Any"}
                            </span>
                        )}
                    </div>
                )}
            </form>

            <div className="grid mx-5 md:mx-0  md:grid-cols-2  lg:grid-cols-4  gap-6">

        
                {
                    books?.data?.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">

                            <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                                📚
                            </div>

                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                No Matching Books Found
                            </h2>

                            <p className="text-slate-400 mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-md">
                                No books match your current search or selected filters.
                                Try adjusting your search criteria or clear all filters to explore available books.
                            </p>

                            <Link
                                href="/all-books"
                                className="
                    mt-6
                    px-5 sm:px-6
                    py-2.5 sm:py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-violet-600
                    to-indigo-600
                    text-white
                    text-sm sm:text-base
                    font-semibold
                    hover:scale-105
                    transition-all
                    duration-300
                "
                            >
                                Clear Filters
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
                                    href={buildUrl(page - 1)}
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
                            <Link href={buildUrl(1)}>
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
                                    <Link href={buildUrl(p)}>
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
                                <Link href={buildUrl(totalPages)}>
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
                                    href={buildUrl(page + 1)}
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