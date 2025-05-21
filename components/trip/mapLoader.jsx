"use client";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import React from "react";
import GoogleMapDirections from "@/components/trip/googleMapDirections";
const TripMap = dynamic(() => import("@/components/map/tripMap"), {
  ssr: false,

  loading: () => (
    <Card className="h-fit p-0">
      <CardContent className="p-0">
        <div className="h-[200px] w-full rounded-lg overflow-hidden flex items-center justify-center font-black text-3xl animate-pulse bg-black/5">
          LOADING MAP
        </div>
      </CardContent>
    </Card>
  ),
});
export default function Map({ sp, ep, stopPoints }) {
  if (!sp?.lat && !sp?.lon) return;
  if (!ep?.lat && !ep?.lon) return;
  // list of stopPoints with status is not pending or cancelled
  const filteredStopPoints = stopPoints?.filter(
    (stopPoint) =>
      stopPoint.status !== "pending" && stopPoint.status !== "cancelled"
  );

  return (
    <div className="relative h-[200px]">
      <TripMap
        startPoint={{ lat: sp?.lat, lon: sp?.lon }}
        endPoint={{ lat: ep?.lat, lon: ep?.lon }}
        stopPoints={filteredStopPoints?.map((stopPoints) => ({
          lat: stopPoints.lat,
          lon: stopPoints.lng,
        }))}
      />
      <GoogleMapDirections
        className=" absolute top-0 left-0 z-30"
        origin={{
          lat: sp?.lat,
          lng: sp?.lon,
        }}
        destination={{
          lat: ep?.lat,
          lng: ep?.lon,
        }}
        waypoints={filteredStopPoints?.map((stopPoints) => ({
          lat: stopPoints.lat,
          lng: stopPoints.lng,
        }))}
      />
    </div>
  );
}
