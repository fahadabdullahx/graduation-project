import CarRegistrationForm from "@/components/driver/carRegistrationForm";
import CarRequests from "@/components/driver/carRequests";
import DriverRegistrationForm from "@/components/driver/driverRegistrationForm";
import DriverRequests from "@/components/driver/driverRequests";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
export const metadata = {
  title: "Drivers",
};
export default async function page({ searchParams }) {
  const { s } = await searchParams;
  const sectionList = [
    { name: "New Driver", hash: "new-driver" },
    { name: "New Car", hash: "new-car" },
    { name: "Driver Requests", hash: "driver-requests" },
    { name: "Cars Requests", hash: "cars-requests" },
  ];
  return (
    <div className="grid gap-0 md:grid-cols-[200px_1fr] grid-rows-1 md:min-h-[calc(100vh-200px)]">
      <Card className="py-2 rounded-t-none -mt-1 row-span-full overflow-auto">
        <CardContent className="flex flex-row md:flex-col gap-2 px-2">
          {sectionList.map((section, i) => (
            <Link
              href="?"
              hash={section.hash}
              as={`?s=${section.hash}`}
              className={`*:hover:bg-primary/10 rounded-sm p-2 text-nowrap hover:bg-primary/10 ${
                s === section.hash || (s === undefined && i === 0)
                  ? "bg-primary/10"
                  : ""
              }`}
              key={i + 1}
            >
              {section.name}
            </Link>
          ))}
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
          {(s === "new-driver" || s === undefined) && (
            <DriverRegistrationForm />
          )}
          {s === "driver-requests" && <DriverRequests />}
          {s === "new-car" && <CarRegistrationForm />}
          {s === "cars-requests" && <CarRequests />}
        </div>
      </div>
    </div>
  );
}
