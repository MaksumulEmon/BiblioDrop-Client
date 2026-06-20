
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (books) => {
    const res = await fetch(
        `${baseUrl}/librarian/books`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(books),
        }
    );

    return await res.json();
};