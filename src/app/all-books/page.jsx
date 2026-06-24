

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

            <Table.Footer>
                <Pagination size="sm">
                    <Pagination.Summary>
                        {/* {start} to {end} of {users.length} results */}
                    </Pagination.Summary>
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous
                                isDisabled={page === 1}

                            >
                                <Pagination.PreviousIcon />
                                Prev
                            </Pagination.Previous>
                        </Pagination.Item>
                        {pages.map((p) => (
                            <Pagination.Item key={p}>
                                <Link href={`/all-books?page=${p}`}>
                                    <Pagination.Link
                                        className={p === page ? "bg-blue-500 text-white" : ""}
                                        isActive={p === page}
                                    >
                                        {p}
                                    </Pagination.Link>
                                </Link>
                            </Pagination.Item>
                        ))}
                        <Pagination.Item>
                            <Pagination.Next
                                isDisabled={page === totalPages}

                            >
                                Next
                                <Pagination.NextIcon />
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
            </Table.Footer>

        </div>
    );
};

export default AllBooks;