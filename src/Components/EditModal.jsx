"use client";

import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button, Modal } from "@heroui/react";
import { Pencil } from "lucide-react";
import { updateBook } from "@/lib/api/book";

export function EditModal({ book }) {

    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const updatedBook = {
            title: form.get("title"),
            image: form.get("image"),
            category: form.get("category"),
            deliveryFee: form.get("deliveryFee"),
            description: form.get("description"),
        };



        try {
    

            const data = await updateBook(book._id, updatedBook);


            if (data.modifiedCount > 0) {
                toast.success("Book updated successfully!");
                window.location.reload();
            }

        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal>

            {/* Trigger Button */}
            <Modal.Trigger>


                <Button className="flex items-center gap-2 px-6 py-5 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition shadow-lg">
                    <Pencil size={18} />
                    Edit Book
                </Button>

            

            </Modal.Trigger>

            <Modal.Backdrop className="bg-black/70 backdrop-blur-sm">

                <Modal.Container placement="center">

                    <Modal.Dialog className="sm:max-w-3xl bg-slate-900 border border-slate-700 text-white rounded-2xl">

                        <Modal.CloseTrigger />

                        {/* HEADER */}
                        <Modal.Header className="border-b border-slate-800 p-6">

                            <Modal.Heading className="text-xl font-bold text-white">
                                Edit Book Details
                            </Modal.Heading>

                            <p className="text-slate-400 text-sm mt-1">
                                Update book information and save changes
                            </p>

                        </Modal.Header>

                        {/* BODY */}
                        <Modal.Body className="p-6">

                            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Title */}
                                <input
                                    name="title"
                                    defaultValue={book.title}
                                    placeholder="Book Title"
                                    className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-violet-500"
                                />

                                {/* Category */}
                                <input
                                    name="category"
                                    defaultValue={book.category}
                                    placeholder="Category"
                                    className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-violet-500"
                                />

                                {/* Image */}
                                <input
                                    name="image"
                                    defaultValue={book.image}
                                    placeholder="Image URL"
                                    className="md:col-span-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-violet-500"
                                />

                                {/* Delivery Fee */}
                                <input
                                    name="deliveryFee"
                                    defaultValue={book.deliveryFee}
                                    placeholder="Delivery Fee"
                                    className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-violet-500"
                                />

                                {/* Description */}
                                <textarea
                                    name="description"
                                    defaultValue={book.description}
                                    placeholder="Description"
                                    rows={4}
                                    className="md:col-span-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-violet-500"
                                />

                                {/* Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="md:col-span-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold transition"
                                >
                                    {loading ? "Updating..." : "Update Book"}
                                </button>

                            </form>

                        </Modal.Body>

                    </Modal.Dialog>

                </Modal.Container>

            </Modal.Backdrop>

        </Modal>
    );
}