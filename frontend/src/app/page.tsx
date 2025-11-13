export default function Home() {
  return (
    <>
    <main className="w-full h-fit py-12 flex flex-col items-center justify-center gap-12">
      <div className="flex flex-col items-center justify-center gap-4 select-none">  
        <span className="font-extrabold text-8xl">Showcase Your Skills</span>
        <span className="font-extrabold text-8xl">Get Hired</span>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button className="bg-black text-white rounded-xl w-72 py-2 hover:bg-gray-900 transition-all duration-500 cursor-pointer shadow-md outline-none">Join as Developer</button>
        <button className="bg-gray-900 text-white rounded-xl w-72 py-2 hover:bg-gray-900 transition-all duration-500 cursor-pointer shadow-md outline-none">Hire Developer</button>
      </div>
    </main>
    </>
  );
}
