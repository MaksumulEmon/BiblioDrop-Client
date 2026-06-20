"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit, Trash, Eye, EyeOff } from "lucide-react";
import { deleteBook, updateBookStatus } from "@/lib/api/book";
import { EditModal } from "@/Components/EditModal";


export default function InventoryTable({ userId }) {
    const [books, setBooks] = useState([]);


    useEffect(() => {
        fetch(`http://localhost:5000/librarian/books?userId=${userId}`)
            .then(res => res.json())
            .then(data => setBooks(data));
    }, [userId]);

    const handleDelete = async (id) => {
        await deleteBook(id);
        toast.success("Deleted");
        setBooks(prev => prev.filter(b => b._id !== id));
    };

    // const handleUpdate = (book) => {
    //     setEditingBook(book);
    //     setIsEditOpen(true);
    // };



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

    const statusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-500";
            case "approved": return "bg-blue-500";
            case "published": return "bg-green-500";
            case "unpublished": return "bg-gray-500";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 text-white">

            <h1 className="text-3xl font-bold mb-6">
                Manage Inventory
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left border border-white/10 rounded-xl overflow-hidden">

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

                                <td>
                                    <span className={`px-3 py-1 rounded-full text-xs ${statusColor(book.status)}`}>
                                        {book.status}
                                    </span>
                                </td>

                                <td>{book.category}</td>
                                <td>${book.deliveryFee}</td>

                                <td className="flex gap-2 p-3">

                                    {/* Edit */}
                                    {/* <button
                                        onClick={() => handleUpdate(book._id)}
                                        className="p-2 bg-blue-600 rounded-lg">
                                        <Edit size={16} />
                                    </button> */}

                                 

                                    <EditModal book={book} />

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(book._id)}
                                        className="p-2 bg-red-600 rounded-lg"
                                    >
                                        <Trash size={16} />
                                    </button>

                                    {/* Toggle Publish */}
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

        </div>
    );
}