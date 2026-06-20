
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (books) => {
    const res = await fetch(
        `${baseUrl}/librarian/books`,
        {
            method: 'POST',
            headers: {
                'Context-Type': 'application/json'
            },
            body: JSON.stringify(books)
        }
    );
    const data = await res.json()
    return data;

}