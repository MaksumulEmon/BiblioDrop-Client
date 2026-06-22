"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { Loader2, Users, ShieldAlert, Trash2, Ban, CheckCircle } from "lucide-react";
import { Avatar } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [usersList, setUsersList] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const loadUsers = async () => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token.token}` }
            });
            const data = await res.json();
            setUsersList(data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            router.push("/signin");
            return;
        }
        loadUsers();
    }, [user, isPending, router]);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/users/role/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                toast.success(`Role updated to ${newRole}`);
                setUsersList(prev =>
                    prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
                );
            } else {
                toast.error("Failed to update role");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        }
    };

    const handleBlockToggle = async (userId, currentlyBlocked) => {
        const nextBlocked = !currentlyBlocked;
        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/users/block/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.token}`
                },
                body: JSON.stringify({ isBlocked: nextBlocked })
            });

            if (res.ok) {
                toast.success(nextBlocked ? "User blocked" : "User unblocked");
                setUsersList(prev =>
                    prev.map(u => u._id === userId ? { ...u, isBlocked: nextBlocked, banned: nextBlocked } : u)
                );
            } else {
                toast.error("Failed to update block status");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

        try {
            const { data: token } = await authClient.token();
            if (!token) return;

            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token.token}` }
            });

            if (res.ok) {
                toast.success("User deleted successfully");
                setUsersList(prev => prev.filter(u => u._id !== userId));
            } else {
                toast.error("Failed to delete user");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
        }
    };

    if (isPending || loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-white">Manage Users</h1>
                <p className="text-slate-400 mt-2">Change account permissions, block disruptive users, or delete accounts.</p>
            </div>

            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-xl overflow-hidden">
                {usersList.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No user accounts found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-slate-400 text-sm">
                                    <th className="pb-4 font-bold">User Details</th>
                                    <th className="pb-4 font-bold">Role</th>
                                    <th className="pb-4 font-bold">Status</th>
                                    <th className="pb-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {usersList.map((usr) => {
                                    const isSelf = usr.email === user.email;
                                    const isBlocked = usr.isBlocked || usr.banned || false;

                                    return (
                                        <tr key={usr._id} className="text-slate-300 hover:bg-white/5 transition-colors">
                                            <td className="py-4 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                                    <Avatar>
                                                        <Avatar.Image src={usr.image} alt={usr.name} referrerPolicy="no-referrer" />
                                                        <Avatar.Fallback>{usr.name?.charAt(0)}</Avatar.Fallback>
                                                    </Avatar>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white flex items-center gap-2">
                                                        {usr.name} {isSelf && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-slate-400">YOU</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{usr.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                {isSelf ? (
                                                    <span className="capitalize text-slate-400 font-semibold">{usr.role}</span>
                                                ) : (
                                                    <select
                                                        value={usr.role}
                                                        onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                                                        className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-purple-600"
                                                    >
                                                        <option value="reader">user (reader)</option>
                                                        <option value="librarian">librarian</option>
                                                        <option value="admin">admin</option>
                                                    </select>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                                                    isBlocked 
                                                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                                                        : "bg-green-500/10 border-green-500/20 text-green-400"
                                                }`}>
                                                    {isBlocked ? "BLOCKED" : "ACTIVE"}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right">
                                                {!isSelf && (
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleBlockToggle(usr._id, isBlocked)}
                                                            className={`p-2.5 border rounded-xl transition cursor-pointer ${
                                                                isBlocked 
                                                                    ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20"
                                                                    : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20"
                                                            }`}
                                                            title={isBlocked ? "Unblock user" : "Block user"}
                                                        >
                                                            {isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(usr._id)}
                                                            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 transition cursor-pointer"
                                                            title="Delete user"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
