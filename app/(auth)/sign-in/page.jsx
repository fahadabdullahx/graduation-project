import React from "react";
import { LoginForm } from "@/components/auth/loginForm";
import { TriangleAlert } from "lucide-react";
export const metadata = {
  title: "Sign In",
};
export default async function SignIn({ searchParams }) {
  const { conform } = await searchParams;
  return (
    <>
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {conform && (
            <div
              className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-800 flex flex-nowrap items-start justify-start gap-2.5"
              role="alert"
            >
              <TriangleAlert className="inline min-h-6 min-w-6 w-6 h-6" />
              <span className="font-medium">
                {conform === "email" &&
                  "A confirmation email has been sent to your email address. Please check your inbox and follow the instructions to complete the sign-in process."}
              </span>
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </>
  );
}
