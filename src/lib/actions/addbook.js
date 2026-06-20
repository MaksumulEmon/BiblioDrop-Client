// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

// export const addBook = async (book) => {
//     const res = await fetch(
//         `${process.env.baseUrl}/librarian/books`,
//         {
//             method: "POST",
//             headers: {
//                 "content-type": "application/json",
//             },
//             body: JSON.stringify(book),
//         }
//     );

//     return res.json();
// };



const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const addBook = async (book) => {
    const res = await fetch(
        `${baseUrl}/librarian/books`,
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(book),
        }
    );

    return await res.json();
};