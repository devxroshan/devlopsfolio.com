"use client";
import React from "react";
import Image from "next/image";

interface IProjectCard {
  projectName: string;
  projectImg: string;
  description: string;
  techUsed: string[];
  like: number;
  views: number;
  developerPic: string;
  developerName: string;
  developerUsername: string;
}

const ProjectCard = ({
  projectImg,
  projectName,
  description,
  techUsed,
  like,
  views,
  developerPic,
  developerName,
  developerUsername,
}: IProjectCard) => {
  return (
    <div className="bg-white rounded-xl border border-primary-border shadow-md flex flex-col gap-2 items-center justify-start w-[25vw] h-fit max-h-[80vh]">
      <Image
        src={projectImg}
        alt="Project Img"
        width={350}
        height={200}
        className="rounded-t-xl"
      />

      <div className="flex flex-col gap-2 items-start justify-center px-3 py-1 w-full">
        <span className="text-2xl font-bold">{projectName}</span>

        <span className="w-full text-wrap text-sm font-medium">
          {description}{" "}
        </span>

        <div className="flex gap-2 w-full items-center justify-start">
          {techUsed.map((tech, index) => (
            <span
              key={index}
              className="bg-white font-medium border border-primary-border shadow-md rounded-full px-3 py-1 text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-start w-full gap-3">
          <div className="flex gap-2 items-center justify-center">
            <Image
              src={"/heart-icon.png"}
              alt="Heart Icon"
              width={25}
              height={25}
            />
            <span className="font-medium">{like >= 1000?`${like/1000}K`:like}</span>
          </div>

          <div className="flex gap-2 items-center justify-center">
            <Image
              src={"/view-icon.png"}
              alt="View Icon"
              width={25}
              height={25}
            />
            <span className="font-medium">{views >= 1000?`${views/1000}K`:views}</span>
          </div>
        </div>

        <div className="w-full h-full flex gap-2 items-center justify-between mt-3 mb-2">
          <div className="flex gap-2 items-center justify-center">
            <Image
              src={"/profile.png"}
              alt="Profile Pic"
              width={45}
              height={45}
              className="rounded-full border-2 border-primary-border shadow-lg"
            />

            <div className="flex flex-col items-start justify-center">
              <span className="font-medium">{developerName}</span>
              <span className="font-medium text-sm">@{developerUsername}</span>
            </div>
          </div>

          <button className="bg-black px-9 py-1 rounded-lg cursor-pointer hover:bg-gray-900 transitiona-all duration-500 outline-none shadow-lg text-white">
            Hire
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
