import { getUser } from "@/app/actions/user";
import DriverRegistrationForm from "@/components/driver/driverRegistrationForm";

import React from "react";
export const metadata = {
  title: "become a driver",
  description: "Sign up to become a driver on EasyRides.",
};

export default async function page() {
  const user = await getUser();
  return (
    <div className="container mx-auto p-4">
      <div className="flex w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-3xl">
          <DriverRegistrationForm user={user} />
        </div>
      </div>
    </div>
  );
}
