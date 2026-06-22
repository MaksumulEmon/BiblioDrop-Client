"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2, User, Mail, Shield, CheckCircle } from "lucide-react";
import { Avatar } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    if (isPending) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!user) {
        router.push("/signin");
        return null;
    }

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-extrabold text-white">My Profile</h1>
                <p className="text-slate-400 mt-2">View your personal details and account settings.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
                {/* Background Glow */}
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-purple-500/10 blur-2xl rounded-full" />
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-500/10 blur-2xl rounded-full" />

                {/* Avatar */}
                <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/30 mb-6 shadow-xl">
                    <Avatar className="w-full h-full">
                        <Avatar.Image 
                            src={user?.image} 
                            alt={user?.name}
                            referrerPolicy="no-referrer"
                        />
                        <Avatar.Fallback className="bg-purple-600 text-white text-2xl font-bold">
                            {user?.name?.charAt(0)}
                        </Avatar.Fallback>
                    </Avatar>
                </div>

                <h2 className="text-2xl font-bold text-white relative z-10">{user?.name}</h2>
                <span className="mt-1 px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider rounded-full relative z-10">
                    {user?.role === "reader" ? "Reader" : user?.role === "librarian" ? "Librarian" : "Administrator"}
                </span>

                {/* Details Section */}
                <div className="w-full mt-8 space-y-4 text-left border-t border-white/5 pt-6 relative z-10">
                    <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                        <span className="p-2 bg-white/5 rounded-xl border border-white/10 text-slate-400">
                            <User size={18} />
                        </span>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Full Name</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                        <span className="p-2 bg-white/5 rounded-xl border border-white/10 text-slate-400">
                            <Mail size={18} />
                        </span>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Email Address</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                        <span className="p-2 bg-white/5 rounded-xl border border-white/10 text-slate-400">
                            <Shield size={18} />
                        </span>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">System Role</p>
                            <p className="text-sm font-semibold text-white mt-0.5 capitalize">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle size={14} className="text-green-500" />
                    <span>Account verified and active via BiblioDrop Auth</span>
                </div>
            </div>
        </div>
    );
}
