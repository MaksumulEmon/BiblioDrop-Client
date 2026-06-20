"use client";

import { deleteBook } from "@/lib/api/book";
import { AlertDialog, Button } from "@heroui/react";
import { Trash } from "lucide-react";
// import { useRouter } from "next/router";

// import { useRouter } from "next/router";
import toast from "react-hot-toast";


export function DeleteAlert({ book }) {

    // const router = useRouter();

    // const handleDelete = async () => {
    //     try {
    //         const data = await deleteBook(book._id);

    //         if (data.deletedCount > 0) {
    //             toast.success(`${book.title} Deleted!`);

    //             router.push("/all-books");
    //             router.refresh();
    //         }

    //     } catch (error) {
    //         toast.error("Delete Failed");
    //     }
    // };

    const handleDelete = async () => {
        try {
            const data = await deleteBook(book._id);

            console.log(data);

            if (data.deletedCount > 0) {
                toast.success(`${book.title} Deleted!`);

                // router.push("/all-books");

                window.location.href = "/all-books";




            }

        } catch (error) {
            console.error(error);
            toast.error("Delete Failed");
        }
    };



    return (
        <AlertDialog>

            {/* 

            {/* Trigger Button */}
            <AlertDialog.Trigger>

                <button className="px-6 py-3 bg-red-600 hover:bg-red-700  rounded-xl font-semibold transition">
                    Delete Book
                </button>
            </AlertDialog.Trigger>


            <AlertDialog.Backdrop>
                <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-100">
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                            <AlertDialog.Icon status="danger" />
                            <AlertDialog.Heading> {book.title} Delete this book permanently?</AlertDialog.Heading>
                        </AlertDialog.Header>
                        {/* <AlertDialog.Body>
              <p>
                This will permanently delete <strong>My Awesome Project</strong> and all of its
                data. This action cannot be undone.
              </p>
            </AlertDialog.Body> */}
                        <AlertDialog.Footer>
                            <Button slot="close" variant="tertiary">
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} slot="close" variant="danger">
                                Delete
                            </Button>
                        </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
        </AlertDialog>
    );
}