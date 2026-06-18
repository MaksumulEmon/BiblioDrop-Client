"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`relative text-sm font-medium transition-all duration-300 ${isActive
                    ? "text-transparent bg-clip-text bg-blue-400"
                    : "text-slate-400 hover:text-white"
                }`}
        >
            {children}

            {/* Active underline */}
            <span
                className={`absolute left-0 -bottom-1 h-[2px] w-full transition-all duration-300 ${isActive
                        ? "bg-blue-500 "
                        : "bg-transparent"
                    }`}
            />
        </Link>
    );
};

export default NavLink;