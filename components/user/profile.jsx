"use client";

import { GetImageUrl } from "@/lib/supabase/utils";
import React, { useEffect, useState } from "react";
import StarRating from "../starRating";
import { User2 } from "lucide-react";

export default function Profile({ user }) {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      const image = await GetImageUrl(user.avatar_url);
      setAvatar(image);
    };
    if (user.avatar_url) {
      getImage();
    } else {
      setAvatar(null);
    }
  }, [user.avatar_url]);
  return (
    <div className="grid grid-cols-6 gap-5 container mx-auto p-4">
      <div className="relative w-full aspect-square rounded-lg bg-secondary overflow-hidden col-start-3 col-end-5 col-span-2 lg:col-span-1">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full max-w-[300px] max-h-[300px] "
          />
        ) : (
          <div
            className="w-full h-full max-w-[300px] max-h-[300px] "
            //   style={{ height: size, width: size }}
          >
            <User2 className="w-full h-full border-2" />
          </div>
        )}
      </div>
      <div className="col-span-full flex flex-col gap-2.5 lg:col-span-5">
        <div>
          <div className="text-1xl font-bold">Full Name</div>

          <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm text-2xl font-bold">
            {user.full_name}
          </div>
        </div>
        <div>
          <div className="text-1xl font-bold">Gender</div>
          <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm text-2xl font-bold">
            {user.gender}
          </div>
        </div>
        <div>
          <div className="text-1xl font-bold">Member since</div>

          <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-2xl font-bold">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </div>
        </div>
        <div>
          <div className="text-1xl font-bold">Rating</div>

          <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-2xl font-bold gap-1">
            <StarRating initialRating={Math.round(user.rating) || 0} readOnly />
            <span className="ms-px text-xs">
              {Math.round(user.rating * 2) / 2 || 0}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
