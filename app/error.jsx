"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      {/* <p className="text-gray-600 mb-4">{error.message}</p> */}
      <Button
        onClick={() => reset()}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Try again
      </Button>
      <Button className="mt-4">
        <Link href={"/"}>Go to home</Link>
      </Button>
    </div>
  );
}
