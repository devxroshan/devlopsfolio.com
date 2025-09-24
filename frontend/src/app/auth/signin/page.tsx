import React from "react";

const SignInPage = () => {
  return (
    <div className="text-white flex items-center justify-center w-[100vw] h-[100vh]">
      <section className="bg-foreground flex items-start justify-start py-3 px-4 border border-white/5 rounded-lg w-[60vw] h-[70vh]">
        <div className="w-[50%] h-[100%] select-none flex flex-col gap-3 items-center justify-center">
          <span className="text-5xl font-semibold">devlopsfolio</span>
          <span className="text-3xl font-semibold">Welcome Back</span>
        </div>

        <div className="flex flex-col gap-3 select-none items-center justify-start w-[50%] h-[100%]">
          <span className="text-xl font-medium">Sign In</span>

          <input type="text" placeholder="Username" className="w-full outline-none border border-white/5 px-3 py-1 rounded-lg"/>
          <input type="text" placeholder="Name" className="w-full outline-none border border-white/5 px-3 py-1 rounded-lg"/>
          <input type="text" placeholder="Email" className="w-full outline-none border border-white/5 px-3 py-1 rounded-lg"/>
          <input type="password" placeholder="Password" className="w-full outline-none border border-white/5 px-3 py-1 rounded-lg"/>
        </div>
      </section>
    </div>
  );
};

export default SignInPage;
