"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash, Eye, EyeOff } from "lucide-react";
import { deleteBook, updateBookStatus } from "@/lib/api/book";
import { EditModal2 } from "@/Components/EditModal2";

export default function ManageInventory({ userId }) {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET BOOKS
    useEffect(() => {
        if (!userId) return;

        setLoading(true);

        fetch(`http://localhost:5000/librarian/my-books/${userId}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));

    }, [userId]);

    // DELETE
    const handleDelete = async (id) => {
        await deleteBook(id);
        toast.success("Deleted");
        setBooks(prev => prev.filter(b => b._id !== id));
    };

    // STATUS TOGGLE
    const handleToggle = async (book) => {
        let newStatus = "";

        if (book.status === "approved") newStatus = "published";
        else if (book.status === "published") newStatus = "unpublished";
        else return;

        await updateBookStatus(book._id, newStatus);

        setBooks(prev =>
            prev.map(b =>
                b._id === book._id ? { ...b, status: newStatus } : b
            )
        );

        toast.success("Status Updated");
    };

    // 🎨 STATUS COLOR FUNCTION
    const statusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500 text-black";

            case "approved":
                return "bg-blue-500 text-white";

            case "published":
                return "bg-green-500 text-white";

            case "unpublished":
                return "bg-gray-500 text-white";

            default:
                return "bg-gray-700 text-white";
        }
    };

    // UI
    if (loading) {
        return <p className="text-gray-400 p-6">Loading...</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">

            <h1 className="text-3xl font-bold mb-6">
                Manage Inventory
            </h1>

            {books.length === 0 ? (
                <p className="text-gray-400">No books found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-white/10 rounded-xl">

                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4">Title</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Fee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.map(book => (
                                <tr key={book._id} className="border-t border-white/10">

                                    <td className="p-4">{book.title}</td>

                                    {/* STATUS BADGE */}
                                    <td>
                                        <span className={`px-3 py-1 text-xs rounded-full ${statusColor(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </td>

                                    <td>{book.category}</td>
                                    <td>${book.deliveryFee}</td>

                                    <td className="flex gap-2 p-3">

                                        <EditModal2 book={book} />

                                        <button
                                            onClick={() => handleDelete(book._id)}
                                            className="p-2 bg-red-600 rounded-lg"
                                        >
                                            <Trash size={16} />
                                        </button>

                                        {book.status !== "pending" && (
                                            <button
                                                onClick={() => handleToggle(book)}
                                                className="p-2 bg-green-600 rounded-lg"
                                            >
                                                {book.status === "published" ? (
                                                    <EyeOff size={16} />
                                                ) : (
                                                    <Eye size={16} />
                                                )}
                                            </button>
                                        )}

                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

        </div>
    );
}