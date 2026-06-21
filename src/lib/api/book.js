import { authClient } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (books) => {

    const { data: token } = await authClient.token()
    console.log({token})

    const res = await fetch(
        `${baseUrl}/librarian/books?token=${token.token}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token.token}`
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




// Delete Book
export const deleteBook = async (id) => {
    const res = await fetch(
        `${baseUrl}/librarian/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return res.json();
};



// status update
export const updateBookStatus = async (id, status) => {
    const res = await fetch(`${baseUrl}/librarian/book/status/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    return res.json();
};