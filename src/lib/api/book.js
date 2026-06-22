import { authClient } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (books) => {
    try {
        const { data } = await authClient.token();

        if (!data?.token) {
            throw new Error("No token found");
        }

        const res = await fetch(
            `${baseUrl}/api/books`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify(books),
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to add book");
        }

        return await res.json();
    } catch (error) {
        console.error("Add Book Error:", error);
        throw error;
    }
};


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