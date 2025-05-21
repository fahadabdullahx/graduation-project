import { SignupForm } from "@/components/auth/signupForm";
export const metadata = {
  title: "Sign Up",
};
export default function SignUp() {
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
