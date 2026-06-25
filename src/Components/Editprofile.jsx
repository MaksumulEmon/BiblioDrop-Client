"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
// import { authClient } from "@/lib/auth-client";

const Editprofile = ({ user }) => {
    const [open, setOpen] = useState(false);


    const onSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const image = e.target.image.value;



        await authClient.updateUser({
            name,
            image,
          
        });

        setOpen(false);

    };

    return (
        <>
            {/* Open Button */}
            <button
                onClick={() => setOpen(true)}
                className="
                    mt-6
                    px-6
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    font-semibold
                    hover:scale-105
                    transition-all
                    duration-300
                "
            >
                Edit Profile
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                    {/* Overlay */}
                    <div
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <div
                        className="
                            relative
                            w-full
                            max-w-xl
                            rounded-3xl
                            border border-slate-800
                            bg-slate-900
                            shadow-2xl
                            overflow-hidden
                        "
                    >

                        {/* Header */}
                        <div className="p-6 border-b border-slate-800">

                            <div className="flex items-center justify-between">

                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Edit Profile
                                    </h2>

                                    <p className="text-slate-400 text-sm mt-1">
                                        Update your account information
                                    </p>
                                </div>

                                <button
                                    onClick={() => setOpen(false)}
                                    className="
                                        p-2
                                        rounded-xl
                                        hover:bg-slate-800
                                        text-slate-400
                                    "
                                >
                                    <X size={20} />
                                </button>

                            </div>

                        </div>

                        {/* Body */}
                        <form onSubmit={onSubmit} className="p-6 space-y-5">

                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={user?.name}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-2xl
                                        bg-slate-950
                                        border border-slate-800
                                        text-white
                                        outline-none
                                        focus:border-blue-500
                                    "
                                />
                            </div>

                            {/* <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={user?.email}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-2xl
                                        bg-slate-950
                                        border border-slate-800
                                        text-white
                                        outline-none
                                        focus:border-purple-500
                                    "
                                />
                            </div> */}


                            <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    Profile Image
                                </label>

                                <input
                                    type="url"
                                    name="image"
                                    defaultValue={user?.image}
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-2xl
                                        bg-slate-950
                                        border border-slate-800
                                        text-white
                                        outline-none
                                        focus:border-purple-500
                                    "
                                />
                            </div>

                            {/* <div>
                                <label className="block text-sm text-slate-400 mb-2">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-2xl
                                        bg-slate-950
                                        border border-slate-800
                                        text-white
                                        outline-none
                                        focus:border-purple-500
                                    "
                                />
                            </div> */}

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="
                                        px-5
                                        py-3
                                        rounded-2xl
                                        border
                                        border-slate-700
                                        text-slate-300
                                        hover:bg-slate-800
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="
                                        px-6
                                        py-3
                                        rounded-2xl
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-purple-600
                                        text-white
                                        font-semibold
                                        hover:scale-105
                                        transition-all
                                    "
                                >
                                    Save Changes
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}
        </>
    );
};

export default Editprofile;