import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-14">
      <section className="w-full select-none mt-28 flex flex-col items-center justify-center gap-6 pt-6">
        <h1 className="text-primary-text font-semibold text-7xl">Find Developers With Ease.</h1>
        <span className="text-primary-text font-semibold text-6xl">Get Your App Ready.</span>

        <div className="flex mt-8 gap-3 w-full items-center justify-center">
          <button className="bg-white rounded-full hover:bg-white/85 transition-all duration-250 w-[25vw] cursor-pointer py-3 font-medium text-lg">Join as Developer</button>

          <Link href={'/auth/signin'} className="hover:bg-white rounded-full text-center border border-white cursor-pointer transition-all text-primary-text hover:text-black duration-250 w-[25vw] py-3 font-medium text-lg">Sign In</Link>
        </div>
      </section>
    </div>
  );
}
