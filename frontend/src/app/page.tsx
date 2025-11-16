'use client';
import { redirect, useSearchParams } from "next/navigation";


import DeveloperCard from "./components/DeveloperCard";
import { useEffect } from 'react';


export default function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('accessToken')) {
      document.cookie = `accessToken=${searchParams.get('accessToken')}; path=/; max-age=${30 * 24 * 60 * 60}; secure: true`; // 30 days
      redirect('/dashboard');
    }
  }, [searchParams.get('accessToken')])
  

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
    </>
  );
}
