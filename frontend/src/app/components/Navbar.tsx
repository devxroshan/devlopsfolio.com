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
    <></>
  )
};

export default Navbar;
