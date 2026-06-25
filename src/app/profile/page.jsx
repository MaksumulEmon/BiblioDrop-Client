"use client";


import Editprofile from "@/Components/Editprofile";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";


export default function ProfilePage() {

    const { data: session } = authClient.useSession();

    const user = session?.user;

    return (
        <div className="min-h-screen pt-20 max-w-3xl mx-auto ">

            <div className= "mx-5 md:mx-0 bg-slate-900 border border-slate-800 rounded-3xl p-8">

                <div className="flex flex-col items-center">

                    <Avatar className="w-24 h-24">
                        <Avatar.Image
                            src={user?.image}
                            alt={user?.name}
                        />
                        <Avatar.Fallback>
                            {user?.name?.charAt(0)}
                        </Avatar.Fallback>
                    </Avatar>

                    <h1 className="text-2xl font-bold text-white mt-4">
                        {user?.name}
                    </h1>

                    <p className="text-slate-400">
                        {user?.email}
                    </p>

                    <p className="text-violet-400 mt-2 capitalize">
                        {user?.role}
                    </p>

                    <Editprofile user={user} />

                </div>

            </div>

        </div>
    );
}