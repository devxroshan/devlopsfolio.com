"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { redirect, useSearchParams } from "next/navigation";

// Custom Hooks
import { useToast } from "@/app/hooks/useToast";

// APIs
import { SignUpAPI } from "@/app/api/auth.api";
import { IAPIError } from "@/app/config/api.config";

// Utils
import { SchemaValidator } from "@/app/utils/schema-validator";
import { SignUpSchema } from "@/app/schemas/signup.schema";

const SignUp = () => {
  // Hooks
  const searchParams = useSearchParams();

  // useStates
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [signUpForm, setSignUpForm] = useState<{
    username: string;
    name: string;
    email: string;
    password: string;
    role: string;
    authParty: string | undefined;
  }>({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "developer",
    authParty: undefined,
  });
  const [isSignedUp, setSignedUp] = useState<boolean>(false);

  // Custom Hooks
  const toastsController = useToast();

  // Mutations
  const signUpMutation = useMutation({
    mutationFn: SignUpAPI,
    onSuccess: (data) => {
      setSignedUp(data.ok);
    },
    onError: (error: IAPIError) => {
      toastsController.addToast({
        title: error.rawError?.message || "An unknown error",
        msg: error.msg,
        icon: "/profile.png",
      });
    },
  });

  // Handlers
  const signUpHanlder = () => {
    if (searchParams.get("authParty") === "google") {
      setSignUpForm({
        ...signUpForm,
        name: searchParams.get("name") ?? "",
        email: searchParams.get("email") ?? "",
        authParty: "google",
      });
    }

    const signUpValidation: { msg: string; path: string }[] | true =
      SchemaValidator(SignUpSchema, signUpForm);

    if (signUpValidation === true) {
      signUpMutation.mutate(signUpForm);
    } else {
      signUpValidation.map((error) =>
        toastsController.addToast({
          title: "Form validation error.",
          msg: error.msg,
          icon: "/profile.png",
        })
      );
    }
  };

  useEffect(() => {
    if (isSignedUp) {
      redirect("/dashboard");
    }
  }, [isSignedUp]);

  return (
    <>
      <Link href={"/"} className="absolute mt-4 ml-6 font-medium">
        Back to Home
      </Link>
      <section className="w-[100vw] h-[100vh] flex justify-center items-center">
        {searchParams.get("authParty") != "google" && (
          <div
            className="bg-white rounded-xl w-[60vw] h-[87vh] border border-primary-border shadow-md flex justify-start items-center px-6 py-3 select-none"
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                signUpHanlder();
              }
            }}
          >
            <div className="w-full h-full flex flex-col select-none items-start justify-center">
              <span className="text-xl font-extrabold">
                Create and Show Your,
              </span>
              <span className="text-7xl font-extrabold">Portfolio</span>
            </div>
            {!isSignedUp && signUpForm.authParty == undefined && (
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
                      value={signUpForm.username}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full h-fit justify-center items-start">
                    <label htmlFor="name">Name*</label>
                    <input
                      type="text"
                      name="name"
                      className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                      value={signUpForm.name}
                      onChange={(e) =>
                        setSignUpForm({ ...signUpForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full h-fit justify-center items-start">
                    <label htmlFor="email">Email*</label>
                    <input
                      type="text"
                      name="email"
                      className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                      value={signUpForm.email}
                      onChange={(e) =>
                        setSignUpForm({
                          ...signUpForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full h-fit justify-center items-start">
                    <label htmlFor="password">Password*</label>
                    <div className="flex w-full h-full items-center justify-end">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="outline-none border border-primary-border rounded-lg px-2 py-1 w-full shadow-sm"
                        value={signUpForm.password}
                        onChange={(e) =>
                          setSignUpForm({
                            ...signUpForm,
                            password: e.target.value,
                          })
                        }
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
                      value={signUpForm.role}
                      onChange={(e) =>
                        setSignUpForm({ ...signUpForm, role: e.target.value })
                      }
                    >
                      <option value="developer">Developer</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                  </div>

                  <button
                    className={`${
                      signUpMutation.isPending
                        ? "bg-gray-900 cursor-default"
                        : "bg-black cursor-pointer"
                    } transition-all duration-500 text-white py-2 rounded-lg mt-2 hover:bg-gray-900`}
                    disabled={signUpMutation.isPending}
                    onClick={signUpHanlder}
                  >
                    {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
                  </button>
                </div>

                <div className="w-[20vw] h-0.5 bg-gray-400 mt-5 rounded-xl"></div>

                <Link
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google-consent`}
                  className="bg-black cursor-pointer text-center transition-all duration-500 text-white py-2 rounded-lg mt-4 hover:bg-gray-900 w-full"
                >
                  Continue with Google
                </Link>

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
            )}

            {isSignedUp && signUpForm.authParty == undefined && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <span className="text-2xl font-semibold">
                  Sign Up Successful!
                </span>
                <span className="text-center">
                  Your account has been created successfully. Please check your
                  email to verify your account.
                </span>
                <Link
                  href="https://gmail.com"
                  target="_blank"
                  className="bg-black cursor-pointer transition-all duration-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-gray-900"
                >
                  Go to Gmail
                </Link>
              </div>
            )}
          </div>
        )}

        {searchParams.get("authParty") == "google" && (
          <div className="w-[40vw] flex rounded-xl bg-white border border-primary-border shadow-lg h-[50vh] items-center justify-center px-6 py-3 select-none gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-6xl font-extrabold">Google</span>
              <span className="text-5xl font-extrabold">Auth</span>
            </div>

            <div className="flex flex-col w-full h-full gap-3 items-center justify-center">
              <div className="flex flex-col items-start justify-center w-full">
                <label htmlFor="username">
                  Username*{" "}
                  <span className="text-xs">- help in credential login</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className="w-full py-1 px-2 rouned-lg outline-none rounded-lg shadow-sm border border-primary-border"
                  value={signUpForm.username}
                  onChange={(e) => {
                    setSignUpForm({ ...signUpForm, username: e.target.value });
                  }}
                />
              </div>

              <div className="flex flex-col items-start justify-center w-full">
                <label htmlFor="password">
                  Password*{" "}
                  <span className="text-xs">- help in credential login</span>
                </label>
                <div className="flex w-full items-center justify-end">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full py-1 px-2 rouned-lg outline-none rounded-lg shadow-sm border border-primary-border"
                    value={signUpForm.password}
                    onChange={(e) => {
                      setSignUpForm({
                        ...signUpForm,
                        password: e.target.value,
                      });
                    }}
                  />

                  <button
                    className="hover:text-gray-900 font-medium text-sm fixed transition-all duration-500 cursor-pointer outline-none mr-1.5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center w-full">
                <label htmlFor="role">Role*</label>
                <select
                  name="role"
                  className="outline-none border border-primary-border px-2 py-1.5 w-full rounded-lg shadow-sm"
                  value={signUpForm.role}
                  onChange={(e) =>
                    setSignUpForm({ ...signUpForm, role: e.target.value })
                  }
                >
                  <option value="developer">Developer</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>

              <button
                className={`w-full ${
                  signUpMutation.isPending
                    ? "bg-gray-900 cursor-default"
                    : "bg-black cursor-pointer"
                } cursor-pointer transition-all duration-500 text-white hover:bg-gray-900 py-2 rounded-lg`}
                disabled={signUpMutation.isPending}
                onClick={() => signUpHanlder()}
              >
                {signUpMutation.isPending ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default SignUp;
