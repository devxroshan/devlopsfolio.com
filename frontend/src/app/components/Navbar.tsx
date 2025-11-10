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

  return (
    <></>
  )
};

export default Navbar;
