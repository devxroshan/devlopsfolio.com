"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";

// API
import { LoginAPI } from "@/app/api/auth.api";
import { AxiosError } from "axios";
import { IAPIError } from "@/app/config/api.config";

const SignInPage = () => {
  // useStates
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<{
    email_or_username: string;
    password: string;
  }>({ email_or_username: "", password: "" });
  const [signInError, setSignInError] = useState<IAPIError>({} as IAPIError);

  const loginMutation = useMutation({
    mutationFn: LoginAPI,
    onSuccess: (data) => {
      console.log("Login Successful:", data);
    },
    onError: (error: IAPIError) => {
      setSignInError(error);
    },
  });

  return (
    <>
      <Link href={"/"} className="absolute font-medium ml-6 -mt-26 select-none">
        Back to Home
      </Link>

      <div className="bg-white border border-gray-300 shadow-md rounded-lg h-[75vh] w-[25vw] mx-auto mt-30 flex flex-col items-center justify-start py-5 px-5 gap-3 select-none">
        <span className="font-medium text-2xl mb-6">Welcome Back</span>

        <div className="w-full flex flex-col items-center justify-center gap-1">
          <div className="w-full h-fit flex flex-col gap-1 items-start justify-center">
            <div className="flex w-full items-center gap-2">
              <label htmlFor="email">Email or Username*</label>
              {signInError.status == 404 && <span className="text-red-700 font-medium text-xs">{signInError.msg}</span>}
            </div>
            <input
              type="text"
              name="email"
              className="bg-white outline-none border border-gray-300 shadow-sm rounded-lg w-full px-2 py-1 text-lg"
              value={loginForm.email_or_username}
              onChange={(e) =>
                setLoginForm({
                  ...loginForm,
                  email_or_username: e.target.value,
                })
              }
            />
          </div>

          <div className="w-full h-fit flex flex-col gap-1 items-start justify-center">
            <div className="flex w-full items-center gap-2">
              <label htmlFor="email">Password*</label>
              {signInError.status == 400 && <span className="text-red-700 font-medium text-xs">{signInError.msg}</span>}
            </div>
            <div className="flex w-full h-fit items-center justify-end gap-1">
              <input
                type={passwordVisibility ? "text" : "password"}
                name="password"
                className="bg-white outline-none border border-gray-300 shadow-sm rounded-lg w-full px-2 py-1 text-lg"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
              <button
                className="fixed pr-2 cursor-pointer text-gray-900 hover:text-black"
                onClick={(e) => setPasswordVisibility(!passwordVisibility)}
              >
                {passwordVisibility ? "Hide" : "Show"}
              </button>
            </div>
            <button className="ml-auto font-medium text-gray-800 cursor-pointer hover:text-black transition-all duration-300">
              Forgot Password
            </button>
          </div>

          <button
            className={`hover:bg-gray-900 transition-all duration-300 text-white font-medium rounded-lg w-full py-2 mt-4 ${
              loginMutation.isPending
                ? "bg-gray-900 cursor-default"
                : "bg-black cursor-pointer"
            }`}
            onClick={() => {
              if(loginForm.email_or_username && loginForm.password && !loginMutation.isPending) {
                loginMutation.mutate(loginForm);
                setSignInError({} as IAPIError);
              }
            }}
          >
            {loginMutation.isPending ? "Wait..." : "Sign In"}
          </button>
        </div>

        <div className="w-40 bg-gray-400 rounded-lg h-0.5 mt-5"></div>

        <button className="bg-black rounded-lg font-medium w-full duration-300 transition-all hover:bg-gray-900 cursor-pointer text-white py-2 mt-4">
          Continue With Google
        </button>

        <div className="w-full h-fit flex items-center justify-center">
          <span>Don't have an account?</span>
          <Link
            href={"/auth/signup"}
            className="text-purple-700 hover:font-medium transition-all duration-300 cursor-pointer"
          >
            Sign-Up
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
