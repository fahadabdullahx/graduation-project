"use client";
import { GetMyCars } from "@/app/actions/driver";
import MapForm from "@/components/map/mapForm";
import { Card, CardContent } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { use, useEffect, useState } from "react";

// Dynamically load the MapComponent with SSR disabled
const CreateTripMap = dynamic(() => import("@/components/map/createTripMap"), {
  ssr: false,

  loading: () => (
    <Card className=" h-fit">
      <CardContent className="p-0">
        <div className="h-[600px] w-full rounded-lg overflow-hidden flex items-center justify-center font-black text-3xl animate-pulse bg-black/5">
          LOADING MAP
        </div>
      </CardContent>
    </Card>
  ),
});

export default function NewTrip() {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState("");
  const [searchResults, setSearchResults] = useState();
  const [myCars, setMyCars] = useState([]);
  useEffect(() => {
    const fetchMyCars = async () => {
      const data = await GetMyCars();
      setMyCars(data);
    };
    fetchMyCars();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
        <MapForm
          startPoint={startPoint}
          setStartPoint={setStartPoint}
          endPoint={endPoint}
          setEndPoint={setEndPoint}
          stopPoints={stopPoints}
          setStopPoints={setStopPoints}
          routeInfo={routeInfo}
          setRouteInfo={setRouteInfo}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          myCars={myCars}
        />
        <CreateTripMap
          startPoint={startPoint}
          setStartPoint={setStartPoint}
          endPoint={endPoint}
          setEndPoint={setEndPoint}
          stopPoints={stopPoints}
          setStopPoints={setStopPoints}
          routeInfo={routeInfo}
          setRouteInfo={setRouteInfo}
          searchResults={searchResults}
        />
      </div>
    </div>
  );
}
