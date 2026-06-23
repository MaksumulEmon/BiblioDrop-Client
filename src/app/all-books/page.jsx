

import Bookcard from '@/Components/Bookcard';
import BookCardSkeleton from '@/Components/BookCardSkeleton';
import { getBooks } from '@/lib/api/book';
import React from 'react';

const AllBooks = async () => {


    const books = await getBooks();



    return (
        <div className='max-w-7xl mx-auto'>
            <h1 className="text-3xl mx-5 md:mx-0 pt-3 font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-200 drop-shadow-lg">
                Explore All Books
            </h1>

            <div className="grid mx-5 md:mx-0  md:grid-cols-2  lg:grid-cols-4  gap-6">

                {books.map((book) => (
                    <Bookcard
                        key={book._id}
                        book={book}
                    />
                ))}



            </div>

        </div>
    );
};

export default AllBooks;