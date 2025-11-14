"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface IDeveloperCardProps {
  name: string;
  username: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  socialLinks: string[];
}

const DeveloperCard = ({
  name,
  username,
  avatarUrl,
  bio,
  skills,
  socialLinks,
}: IDeveloperCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-primary-border shadow-md flex flex-col gap-2 items-center justify-start px-4 py-8 w-[25vw] h-[70vh]">
      <Image
        src={avatarUrl ? avatarUrl : "/profile.png"}
        alt="Developer Avatar"
        width={100}
        height={100}
        className="rounded-full border-2 border-primary-border shadow-xl"
      />

      <div className="flex flex-col items-center justify-center">
        <span className="font-semibold text-center text-xl">{name}</span>
        <span className="font-medium text-center">@{username}</span>
      </div>

      <div className="flex w-full h-fit gap-2 py-1 items-center justify-center">
        {socialLinks.map((link, index) => (
          <Link href={link} key={index} target="_blank">
            <Image
              src={"/github-icon.png"}
              alt="Social Link Icon"
              width={30}
              height={30}
              className="cursor-pointer"
            />
          </Link>
        ))}
      </div>

      <span className="font-medium text-left text-sm w-full text-wrap">{bio}</span>

      <div className="w-full h-fit flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-white font-medium border border-primary-border shadow-md rounded-full px-3 py-1 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeveloperCard;
