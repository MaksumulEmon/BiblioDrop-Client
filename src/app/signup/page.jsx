
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

// ─── Left Panel: purely decorative, no logic ───────────────────────────────

const LeftPanel = () => (
    <div className="hidden lg:flex flex-col items-center justify-center w-full h-full relative overflow-hidden select-none px-10 py-12 border-r border-white/10">


        <div className="relative z-10 flex flex-col items-center text-center gap-6">

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
            </div>

            {/* Brand */}
            <div className="space-y-2">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Create Your Account
                </h2>
                <p className="text-slate-400 text-sm text-center items-center leading-relaxed ">
                    Your knowledge, beautifully organised.
                </p>
            </div>

            {/* Divider */}
            <div className="w-12 h-px bg-white/10" />

            {/* Features */}
            <div className="flex flex-col gap-3 w-full">
                {[
                    { icon: "📚", label: "Organised Study Materials" },
                    { icon: "📊", label: "Progress Tracking" },
                    { icon: "🔒", label: "Secure & Private" },
                ].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                        <span>{icon}</span>
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ─── Original Signup Component — UNTOUCHED ─────────────────────────────────
const Signup = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmError, setConfirmError] = useState("");

    const brandGradient =
        "bg-gradient-to-r from-blue-600 to-purple-600";

    const validatePassword = (password) => {
        if (password.length < 6) return "Min 6 characters required";
        if (!/[A-Z]/.test(password)) return "At least 1 uppercase letter";
        if (!/[a-z]/.test(password)) return "At least 1 lowercase letter";
        return "";
    };



    const onSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const user = Object.fromEntries(formData.entries());


            if (user.password !== confirmPassword) {
                setConfirmError("Passwords do not match");
                return;
            }

            const errorMsg = validatePassword(user.password);
            if (errorMsg) {
                setPasswordError(errorMsg);
                setLoading(false);
                return;
            }

            const { data, error } = await authClient.signUp.email({
                email: user.email,
                password: user.password,
                name: user.name,
                image: user.photoUrl,
            });

            if (data) {
                await authClient.signOut();
                toast.success("Account created successfully");
                router.push("/signin");
            }

            if (error) {
                toast.error(error.message);
            }

        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };



    const handleGoogleSignup = async () => {
        setGoogleLoading(true);

        try {
            await authClient.signIn.social({
                provider: "google",
            });
        } catch (error) {
            toast.error("Google Sign In Failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4 relative overflow-hidden">

            {/* Glow */}
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
            <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

            {/* ── Two-column wrapper ── */}
            <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

                {/* Left decorative panel */}
                <LeftPanel />

                {/* Right: original form card — markup identical */}
                <div className="w-full p-8">
                    <h2 className="text-3xl pb-2 md:hidden  text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Create Your Account
                    </h2>

                    <form onSubmit={onSubmit} className="space-y-5">

                        {/* Name */}
                        <input
                            name="name"
                            placeholder="Full Name"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                            required
                        />

                        {/* Email */}
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                            required
                        />

                        {/* Photo URL */}
                        <input
                            name="photoUrl"
                            placeholder="Photo URL (Optional)"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 outline-none"
                        />

                        {/* Password */}
                        <div className="relative">

                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                onChange={(e) =>
                                    setPasswordError(validatePassword(e.target.value))
                                }
                                className={`w-full bg-white/5 border rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none pr-12 ${passwordError
                                    ? "border-red-500"
                                    : "border-white/10 focus:border-blue-500"
                                    }`}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? <Eye /> : <EyeOff />}
                            </button>
                        </div>

                        {passwordError && (
                            <p className="text-red-400 text-xs">
                                {passwordError}
                            </p>
                        )}


                        {/* Confirm Password */}
                        <div>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm your Password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmError("");
                                }}
                                className={`w-full bg-white/5 border rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 outline-none pr-12 ${passwordError
                                    ? "border-red-500"
                                    : "border-white/10 focus:border-blue-500"
                                    }`}
                                required
                            />

                            {confirmError && (
                                <p className="text-red-500 text-xs mt-2">
                                    {confirmError}
                                </p>
                            )}
                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`${brandGradient} w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-70`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Logging in...
                                </>
                            ) : (
                                "Signup"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6 text-slate-500 text-sm">
                        <div className="flex-1 h-px bg-white/10" />
                        OR
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Google */}

                    <button disabled={googleLoading}
                        onClick={handleGoogleSignup}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-3 rounded-2xl hover:bg-white/10 transition"
                    >
                        {googleLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Signing up...
                            </>
                        ) : (
                            <>
                                <FcGoogle className="text-xl" />
                                Continue with Google
                            </>
                        )}
                    </button>


                    {/* Login */}
                    <p className="text-center text-slate-400 text-sm mt-6">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="text-blue-400 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;