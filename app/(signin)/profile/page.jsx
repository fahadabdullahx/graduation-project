import React from "react";
import Avatar from "@/components/user/avatar";
import { GetMyProfile } from "@/app/actions/user";
import ProfileForm from "@/components/user/profileForm";
export const metadata = {
  title: "Profile",
};
export default async function page() {
  const myProfile = await GetMyProfile();
  if (myProfile?.errors) {
    return <div>{myProfile?.errors}</div>;
  }
  return (
    <div className="grid grid-cols-6 gap-5 container mx-auto p-4">
      <div className="relative w-full aspect-square rounded-lg bg-secondary overflow-hidden col-start-3 col-end-5 col-span-2 lg:col-span-1">
        <Avatar avatar_url={myProfile.avatar_url} uid={myProfile.id} />
      </div>
      <div className="col-span-full lg:col-span-5">
        <ProfileForm myProfile={myProfile} />
      </div>
    </div>
  );
}
