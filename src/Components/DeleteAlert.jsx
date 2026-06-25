"use client";

import { deleteBook } from "@/lib/api/book";
import { AlertDialog, Button } from "@heroui/react";
import toast from "react-hot-toast";
import { RiDeleteBinLine } from "react-icons/ri";


export function DeleteAlert({ book }) {

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

    
            <AlertDialog.Trigger>
                <Button
                    variant="danger"
                    size="sm"
                    className="flex font-semibold px-5 py-5 rounded-xl transition"
                >
                    
                    <RiDeleteBinLine size={18} />
                    Delete Book
                </Button>
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