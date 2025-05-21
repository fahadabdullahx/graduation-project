import React from "react";
import Avatar from "./avatar";
import ProfileForm from "./profileForm";

export default function UserProfile({ myProfile }) {
  return (
    <div className="grid grid-cols-6 gap-5 container mx-auto p-4">
      <div className=" relative w-full aspect-square rounded-lg bg-secondary overflow-hidden col-start-2 col-end-6 max-w-60 col-span-2 lg:col-span-1">
        <Avatar avatar_url={myProfile.avatar_url} uid={myProfile.id} />
      </div>
      <div className="col-span-full lg:col-span-5">
        <ProfileForm myProfile={myProfile} />
      </div>
    </div>
  );
}
