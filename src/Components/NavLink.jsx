import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ href, children }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`relative pb-1 text-sm font-medium transition-colors ${isActive
                ? 'text-[#003399] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#003399]'
                : 'text-gray-600 hover:text-gray-900'
                }`}
        >
            {children}
        </Link>
    );
};


export default NavLink;