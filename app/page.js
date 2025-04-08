import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-black/80 w-screen h-screen">
      <div className="flex flex-col items-center justify-center w-full text-center h-full">
      <button className="bg-green-400 rounded-lg cursor-pointer px-4 py-2 hover:bg-yellow-400">
        Login With Google
      </button>
      
      </div>
    </div>
  );
}
