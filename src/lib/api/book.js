
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (books) => {
    const res = await fetch(
        `${baseUrl}/librarian/books`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(books)
        }
    );
    const data = await res.json()
    return data;

}


// ALl book show
export const getBooks = async () => {
    const res = await fetch(`${baseUrl}/librarian/books`, {
        cache: "no-store",
    });

    return res.json();
};


// Edit Modal
export const updateBook = async (id, updatedBook) => {
    const res = await fetch(
        `${baseUrl}/librarian/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedBook),
        }
    );

    return res.json();
};


//             );