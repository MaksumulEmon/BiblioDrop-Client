

import Bookcard from '@/Components/Bookcard';
import { getBooks } from '@/lib/api/book';
import React from 'react';

const AllBooks = async () => {

    // const res = await fetch(
    //     "http://localhost:5000/librarian/books",
    //     {
    //         cache: "no-store"
    //     }
    // );
        const books = await getBooks();


  

    return (
        <div  className='max-w-7xl mx-auto'>

            <h1 className="text-3xl font-bold mb-8">
                All Books
            </h1>

            <div className="grid mx-5 md:mx-0 md:grid-cols-2  lg:grid-cols-3  gap-6">

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