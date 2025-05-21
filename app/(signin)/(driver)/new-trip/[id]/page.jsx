"use client";
import { GetMyCars } from "@/app/actions/driver";
import { GetTripById } from "@/app/actions/trips";
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

export default function page(props) {
  const params = use(props.params);

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [trip, setTrip] = useState(null);
  const [myCars, setMyCars] = useState([]);

  async function getTrip() {
    const data = await GetTripById(params.id);

    setTrip(data);
  }
  useEffect(() => {
    getTrip();
    const fetchMyCars = async () => {
      const data = await GetMyCars();
      setMyCars(data);
    };
    fetchMyCars();
  }, []);

  useEffect(() => {
    if (trip) {
      setStartPoint({
        lat: trip.start_latitude,
        lng: trip.start_longitude,
      });
      setEndPoint({
        lat: trip.end_latitude,
        lng: trip.end_longitude,
      });
      setStopPoints(
        trip.stop_points.map((stopPoint) => ({
          lat: stopPoint.latitude,
          lng: stopPoint.longitude,
        }))
      );
      setRouteInfo({
        distance: trip.distance,
        duration: trip.duration,
      });
    }
  }, [trip]);
  if (!trip) return null;
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
          price={trip?.price}
          myCars={myCars}
          car={trip?.car.id}
          oldAmenities={trip?.amenities}
          tripId={trip?.id}
          dateTime={trip?.departure_time}
          seat={trip?.offered_seat}
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
