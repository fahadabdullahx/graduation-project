import React from "react";
import { GetProfile } from "@/app/actions/user";
import Profile from "@/components/user/profile";
export const metadata = {
  title: "Profile ",
};
export default async function page({ params }) {
  const { id } = await params;

  const user = await GetProfile(id);
  if (user?.errors) {
    throw new Error(user?.errors);
  }
  return <Profile user={user} />;
}
