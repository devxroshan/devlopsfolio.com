"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
    <Link href={'/'} className="absolute mt-4 ml-6 font-medium">Back to Home</Link>
      <section className="w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="bg-white rounded-xl w-[60vw] h-[87vh] border border-primary-border shadow-md flex justify-start items-center px-6 py-3 select-none">
          <div className="w-full h-full flex flex-col select-none items-start justify-center">
            <span className="text-xl font-extrabold">
              Create and Show Your,
            </span>
            <span className="text-7xl font-extrabold">Portfolio</span>
          </div>

          <div className="w-full h-full flex flex-col items-center justify-start">
            <div className="w-full h-fit flex items-center justify-start">
              <span className="font-medium text-xl">Sign Up</span>
            </div>

            <div className="w-full h-fit flex flex-col gap-2 mt-2">
              <div className="flex flex-col w-full h-fit justify-center items-start">
                <label htmlFor="username">Username*</label>
                <input
                  type="text"
                  name="username"
                  className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                />
              </div>
              <div className="flex flex-col w-full h-fit justify-center items-start">
                <label htmlFor="name">Name*</label>
                <input
                  type="text"
                  name="name"
                  className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                />
              </div>
              <div className="flex flex-col w-full h-fit justify-center items-start">
                <label htmlFor="email">Email*</label>
                <input
                  type="text"
                  name="email"
                  className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                />
              </div>
              <div className="flex flex-col w-full h-fit justify-center items-start">
                <label htmlFor="password">Password*</label>
                <div className="flex w-full h-full items-center justify-end">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                  />
                  <button
                    className="hover:text-gray-900 font-medium text-sm fixed transition-all duration-500 cursor-pointer outline-none mr-1.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="flex flex-col w-full h-fit justify-center items-start">
                <label htmlFor="role">Role*</label>
                <select
                  name="role"
                  className="outline-none border border-primary-border px-2 py-1.5 w-full rounded-lg shadow-sm"
                >
                  <option value="developer">Developer</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <button className="bg-black cursor-pointer transition-all duration-500 text-white py-2 rounded-lg mt-2 hover:bg-gray-900">
                Sign Up
              </button>
            </div>

            <div className="w-[20vw] h-0.5 bg-gray-400 mt-5 rounded-xl"></div>

            <button className="bg-black cursor-pointer transition-all duration-500 text-white py-2 rounded-lg mt-4 hover:bg-gray-900 w-full">
              Continue with Google
            </button>

            <span className="mt-3">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-purple-600 hover:font-medium transition-all duration-300"
              >
                Log-In
              </Link>
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
