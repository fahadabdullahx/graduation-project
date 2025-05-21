"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, requiredRole = [] }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user || null);
      setIsLoading(false);
    };
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (user && requiredRole === "user") {
    return <>{children}</>;
  }

  if (!user || !requiredRole.includes(user?.user_metadata.usertype)) {
    return (
      <div className="px-2 flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
        <h1 className="text-6xl font-bold">401</h1>
        <h2 className="text-2xl mt-4">Unauthorizeds</h2>
        <p className="mt-2 text-gray-600">
          Sorry, you are not authorized to access this page. Please sign in.
        </p>
        <div className="flex flex-row gap-2 items-center mt-4">
          <Link
            href="/sign-in"
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  return user ? <>{children}</> : null;
}
