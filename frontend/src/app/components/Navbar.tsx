'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ILink {
    path: string;
    pathName: string;
}

const Navbar = () => {
    const omittedPathnames = ['/auth/signin', '/auth/signup'];
    const pathname = usePathname();

    const links: ILink[] = [
        {
            path: '/developers',
            pathName: 'Developers'
        },
        {
            path: '/projects',
            pathName: 'Projects'
        },
        {
            path: '/about',
            pathName: 'About'
        }
    ]

  return (
    <nav className={`w-full h-[8vh] bg-white shadow-md ${omittedPathnames.includes(pathname)?'hidden':'flex'} items-center justify-between px-8`}>
        <span className="font-medium text-lg">devlopsfolio</span>

        <div className="flex items-center justify-center gap-5">
            {links.map((link, index) => (
                <Link key={index} href={link.path} className="text-black hover:text-gray-900 hover:font-medium transition-all duration-200">
                    {link.pathName}
                </Link>
            ))}
        </div>

        <div className="flex items-center justify-center gap-3">
            <Link href={'/auth/signup'} className="text-black hover:text-white rounded-lg hover:bg-gray-900 transition-all duration-500 py-1 px-5">Sign Up</Link>
            
            <Link href={'/auth/signin'} className="bg-black text-white rounded-lg hover:bg-gray-900 transition-all duration-500 py-1 px-5">Sign In</Link>
        </div>
    </nav>
  )
};

export default Navbar;
