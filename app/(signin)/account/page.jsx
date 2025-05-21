import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { GetMyProfile } from "@/app/actions/user";

import MyRequests from "@/components/driver/myRequests";
import MyCar from "@/components/driver/myCar";
import UserProfile from "@/components/user/userProfile";
import MyReviews from "@/components/user/myReviews";

export const metadata = {
  title: "Account",
};
export default async function page({ searchParams }) {
  const { s } = await searchParams;
  const sectionList = [
    {
      name: "Profile",
      hash: "profile",
      for: ["*"],
    },
    {
      name: "My Cars",
      hash: "my-cars",
      for: ["driver"],
    },
    {
      name: "My Requests",
      hash: "my-requests",
      for: ["*"],
    },
    {
      name: "My Reviews",
      hash: "my-reviews",
      for: ["*"],
    },
  ];
  const myProfile = await GetMyProfile();
  return (
    <div className="container mx-auto p-4 pt-0 grid gap-0 md:grid-cols-[200px_1fr] grid-rows-1 md:min-h-[calc(100vh-200px)]">
      <Card className="py-2 rounded-t-none -mt-1 row-span-full overflow-auto">
        <CardContent className="flex flex-row md:flex-col gap-2 px-2">
          {sectionList.map((section, i) => {
            if (
              section.for.includes(myProfile?.usertype) ||
              section.for.includes("*")
            ) {
              return (
                <Link
                  href={`?s=${section.hash}`}
                  className={`*:hover:bg-primary/10 rounded-sm p-2 text-nowrap hover:bg-primary/10 ${
                    s === section.hash || (s === undefined && i === 0)
                      ? "bg-primary/10"
                      : ""
                  }`}
                  key={i + 1}
                >
                  {section.name}
                </Link>
              );
            } else return null;
          })}
        </CardContent>
      </Card>
      <div className="overflow-auto">
        <div className="w-full border-b-2 ">
          <h2 className="text-2xl font-bold h-10 px-3 text-primary mb-2.5 flex justify-between items-center">
            {s === undefined
              ? sectionList[0].name
              : sectionList.find((section) => section.hash === s)?.name ||
                "Error"}
          </h2>
        </div>
        <div className="mt-3 px-2">
          {(s === "profile" || s === undefined) && (
            <UserProfile myProfile={myProfile} />
          )}
          {s === "my-cars" && <MyCar />}
          {s === "my-requests" && <MyRequests />}
          {s === "my-reviews" && <MyReviews myRating={myProfile.rating} />}
        </div>
      </div>
    </div>
  );
}
