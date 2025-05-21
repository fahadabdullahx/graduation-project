"use client";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import Link from "next/link";
import StarRating from "@/components/starRating";

export default function TripCard({ data }) {
  return (
    <div
      key={data.id}
      className={`border w-full h-full p-2 rounded-lg hover:shadow-md max-h-fit relative`}
      id="trip-card"
    >
      <Link href={`/trip/${data.id.replaceAll("-", "")}`} prefetch={true}>
        <div className="flex flex-col justify-between">
          <div className="flex items-center gap-1 font-bold ">
            <MapPin size={25} strokeWidth={2} />
            <div className="flex flex-col gap-0">
              <span className="-mb-3 text-base font-light">From</span>
              <p className="line-clamp-1">{data?.start_location}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 font-bold ">
            <MapPin size={25} strokeWidth={2} />
            <div className="flex flex-col gap-0">
              <span className="-mb-3 text-base font-light">To</span>
              <p className="line-clamp-1">{data?.end_location}</p>
            </div>
          </div>
        </div>
        <hr className="mt-1" />
        <div className="flex flex-row justify-between flex-wrap md:flex-nowrap text-lg mt-2">
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <img src="/SAR.svg" alt="logo" className="w-4" />
            <p id="price">{data?.price ? data?.price?.toFixed(2) : "FREE"}</p>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <CalendarDays size={20} strokeWidth={2} />
            <p>{new Date(data.departure_time).toLocaleDateString("en-US")}</p>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <Clock size={20} strokeWidth={2} />
            <p>
              {new Date(data.departure_time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex flex-row gap-0.5 items-center justify-center">
            <Users size={20} strokeWidth={2} />
            <p>
              {data.offered_seat -
                data.bookings.filter((booking) => booking.status !== "canceled")
                  .length}{" "}
              seats left
            </p>
          </div>
        </div>
        {data?.driver ? (
          <>
            <hr className="mt-1" />
            <div className="flex flex-row justify-between text-sm">
              <div className="flex flex-row gap-0.5 justify-between items-center w-full">
                <div>
                  <h2 className="font-bold text-lg line-clamp-1">
                    {data?.driver?.full_name}
                    <span className="ms-1 font-medium text-base">
                      {data?.driver?.gender}
                    </span>
                  </h2>
                  <div className="flex">
                    <StarRating
                      initialRating={Math.round(data?.driver?.rating) || 0}
                      readOnly
                    />
                    <span className="text-xs">
                      {Math.round(data?.driver?.rating) || 0}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Link>
    </div>
  );
}
