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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submitButton";
import { SignUpAction } from "@/app/actions/user";
import { useActionState } from "react";
import Link from "next/link";
const initialState = {
  errors: {},
  error: "",
  success: false,
};

export function SignupForm({ error, note, className, ...props }) {
  const [state, formAction] = useActionState(SignUpAction, initialState);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Creat an account new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid grid-cols-2 gap-6">
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
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
                {state?.errors?.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" type="text" name="full_name" required />
                {state?.errors?.full_name && (
                  <p className="text-sm text-red-500">
                    {state.errors.full_name[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  type="number"
                  name="phone_number"
                  required
                />
                {state?.errors?.phone_number && (
                  <p className="text-sm text-red-500">
                    {state.errors.phone_number[0]}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"></div>

              {state?.error && (
                <div variant="destructive">
                  <div className="h-4 w-4" />
                  <div>{state.error}</div>
                </div>
              )}

              <div className="col-span-full">
                <SubmitButton
                  // formAction={SignUpAction}
                  pendingText="Signing up..."
                  className="w-full"
                >
                  Sign up
                </SubmitButton>
                <div className="mt-4 text-center text-sm">
                  I have an account?{" "}
                  <Link href="sign-in" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
