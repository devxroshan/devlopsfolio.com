'use client';
import React from "react";
import Link from "next/link";

interface ILink {
    path: string;
    pathName: string;
}

const Navbar = () => {
    const links: ILink[] = [
        {
            path: '/projects',
            pathName: 'Projects'
        },
        {
            path: '/find-devs',
            pathName: 'Find Devs'
        },
        {
            path: '/contact',
            pathName: 'Contact'
        },
        {
            path: '/about',
            pathName: 'About'
        }
    ]

  return <nav className="w-[100vw] py-2 px-5 h-14 flex items-center justify-center gap-96 bg-white/10 backdrop-blur-xl fixed select-none top-0">
    <Link href={'/'} className="text-white font-medium text-lg">devlopsfolio</Link>

    <div className="flex items-center justify-between gap-6">
        {links.map((link, index) => (
            <Link key={index} href={link.path} className="text-white/80 hover:text-white transition-all duration-150 font-medium ease-in-out">{link.pathName}</Link>
        ))}
    </div>
    

    <Link href={'/auth/signin'} className="text-black hover:bg-white/80 transition-all duration-250 font-medium ease-in-out bg-white px-6 py-2 rounded-full ">Sign In
    </Link>
  </nav>;
};

export default Navbar;
