

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

    const books = await getBooks(params.page);
    console.log(books)


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
            <h1 className="text-3xl mx-5 md:mx-0 pt-3 font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-200 drop-shadow-lg">
                Explore All Books
            </h1>

            <div className="grid mx-5 md:mx-0  md:grid-cols-2  lg:grid-cols-4  gap-6">

                {books.data.map((book) => (
                    <Bookcard
                        key={book._id}
                        bookData={book}
                    />
                ))}

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