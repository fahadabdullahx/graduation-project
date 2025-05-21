"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submitButton";
import { SignInAction } from "@/app/actions/user";

import { useActionState } from "react";
import Link from "next/link";

export function LoginForm({ className, redirect, ...props }) {
  const initialState = {
    errors: {},
    error: "",
    redirect: redirect,
    success: false,
  };

  const [state, formAction] = useActionState(SignInAction, initialState);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                />
                {state?.errors?.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              {state?.error && (
                <div variant="destructive">
                  <div className="h-4 w-4" />
                  <div>{state.error}</div>
                </div>
              )}
              <SubmitButton pendingText="Saving..." className="w-full">
                Login
              </SubmitButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
