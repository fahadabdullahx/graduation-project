"use client";

import { Card, CardContent } from "@/components/ui/card";
import Map from "./map";

export default function CreateTripMap({
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  stopPoints,
  setStopPoints,
  setRouteInfo,
  searchResults,
}) {
  return (
    <Card className="h-fit p-0 z-10">
      <CardContent className="p-0 h-[400px] md:h-[600px] w-full rounded-lg overflow-hidden">
        <Map
          startPoint={startPoint}
          setStartPoint={setStartPoint}
          endPoint={endPoint}
          setEndPoint={setEndPoint}
          stopPoints={stopPoints}
          setStopPoints={setStopPoints}
          setRouteInfo={setRouteInfo}
          searchResults={searchResults}
        />
      </CardContent>
    </Card>
  );
}
