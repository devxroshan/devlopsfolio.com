'use client';
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from 'react';
import Link from "next/link";


import DeveloperCard from "./components/DeveloperCard";
import ProjectCard from "./components/ProjectCard";
import { useToast } from "./hooks/useToast";

export default function Home() {
  const searchParams = useSearchParams();
  const toastsController = useToast()


  useEffect(() => {
    if (searchParams.get('accessToken')) {
      document.cookie = `accessToken=${searchParams.get('accessToken')}; path=/; max-age=${30 * 24 * 60 * 60}; secure: true`; // 30 days
      redirect('/dashboard');
    }
  }, [searchParams.get('accessToken'), toastsController.toasts])


  return (
    <>
      <section className="w-full h-fit py-12 flex flex-col gap-6 select-none items-center justify-center">
        <h2 className="font-extrabold text-8xl">Showcase Your Skills</h2>
        <span className="font-extrabold text-6xl">Get Hired</span>

        <div className="flex items-center justify-between gap-12">
          <button className="w-56 rounded-xl shadow-lg outline-none bg-black text-white font-medium cursor-pointer hover:bg-gray-900 tranisition-all duration-500 py-2">
            Join as Developer
          </button>

          <button className="w-56 rounded-xl shadow-lg outline-none bg-gray-900 text-white font-medium cursor-pointer hover:bg-black tranisition-all duration-500 py-2">
            Hire Developer
          </button>
        </div>
      </section>

      <section className="w-full h-fit flex flex-col gap-6 select-none items-start justify-center py-6 px-6">
        <span className="text-2xl font-medium">Popular Developers</span>

        <div className="w-full flex flex-wrap gap-12 items-center justify-center">
          <DeveloperCard
            name="Roshan Kewat"
            username="devxroshan"
            avatarUrl="/profile.png"
            bio="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia corporis animi quisquam dolore, accusamus sunt itaque adipisci a, ipsa exercitationem facilis doloribus quam perferendis vitae"
            skills={["JavaScript", "React", "Node.js", "CSS", "HTML", "C++"]}
            socialLinks={[
              "https://github.com",
              "https://youtube.com",
              "https://instagram.com",
            ]}
          />
          <DeveloperCard
            name="Roshan Kewat"
            username="devxroshan"
            avatarUrl="/profile.png"
            bio="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia corporis animi quisquam dolore, accusamus sunt itaque adipisci a, ipsa exercitationem facilis doloribus quam perferendis vitae"
            skills={["JavaScript", "React", "Node.js", "CSS", "HTML", "C++"]}
            socialLinks={[
              "https://github.com",
              "https://youtube.com",
              "https://instagram.com",
            ]}
          />
          <DeveloperCard
            name="Roshan Kewat"
            username="devxroshan"
            avatarUrl="/profile.png"
            bio="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia corporis animi quisquam dolore, accusamus sunt itaque adipisci a, ipsa exercitationem facilis doloribus quam perferendis vitae"
            skills={["JavaScript", "React", "Node.js", "CSS", "HTML", "C++"]}
            socialLinks={[
              "https://github.com",
              "https://youtube.com",
              "https://instagram.com",
            ]}
          />
        </div>
      </section>

      <section className="w-full h-fit flex flex-col gap-6 select-none items-start justify-center py-6 px-6">
        <span className="text-2xl font-medium">Projects</span>

        <div className="w-full flex flex-wrap gap-12 items-center justify-center">
          <ProjectCard projectImg="/test.jpg" projectName="CrewNeuro.ai" description='Lorem ipsum dolor sit amet consectetur adipisicing elit. At ipsam dolores blanditiis illum voluptatum odit voluptatibus est. Provident, quae. Rerum ratione aliquam facere qui, velit doloribus' techUsed={['ExpressJS', 'Python', 'C++']} like={2000} views={2000} developerName="Roshan Kewat" developerUsername="devxroshan" developerPic="profile.png"/>
          <ProjectCard projectImg="/test.jpg" projectName="CrewNeuro.ai" description='Lorem ipsum dolor sit amet consectetur adipisicing elit. At ipsam dolores blanditiis illum voluptatum odit voluptatibus est. Provident, quae. Rerum ratione aliquam facere qui, velit doloribus' techUsed={['ExpressJS', 'Python', 'C++']} like={2000} views={2000} developerName="Roshan Kewat" developerUsername="devxroshan" developerPic="profile.png"/>
          <ProjectCard projectImg="/test.jpg" projectName="CrewNeuro.ai" description='Lorem ipsum dolor sit amet consectetur adipisicing elit. At ipsam dolores blanditiis illum voluptatum odit voluptatibus est. Provident, quae. Rerum ratione aliquam facere qui, velit doloribus' techUsed={['ExpressJS', 'Python', 'C++']} like={2000} views={2000} developerName="Roshan Kewat" developerUsername="devxroshan" developerPic="profile.png"/>
        </div>
      </section>

      <section className="flex flex-col w-full gap-2 items-start justify-center px-6">
        <span className="text-2xl font-bold">About</span>

        <p className="font-medium text-2xl select-none">At Devlopsfolio, we believe every developer deserves a place to show their work and get discovered. Our platform lets you create a stunning portfolio, add your projects, and showcase your skills. Recruiters can search by experience, tech stack, or availability, making it easy to find the right developer for any role or project.</p>
      </section>

      <footer className="bg-black w-full flex flex-col items-center justify-center py-6 mt-12">
        <div className="w-full flex flex-col items-center justify-center gap-4 pb-7 border-b border-gray-700">
          <span className="font-bold text-4xl text-white">devlopsfolio.com</span>

          <div className="flex w-full gap-16 items-center justify-center">
            <Link href={'#'} className="text-white font-medium text-xl">Developers</Link>
            <Link href={'#'} className="text-white font-medium text-xl">Projects</Link>
            <Link href={'#'} className="text-white font-medium text-xl">About</Link>
          </div>
        </div>

        <div className="w-full flex items-center justify-center py-3 border-t border-gray-700">
          <span className="text-gray-400">2025 Devlopsfolio - Developers Portfolio</span>
        </div>
      </footer>
    </>
  );
}
