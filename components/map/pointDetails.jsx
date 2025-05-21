"use client";

import { useEffect, useState } from "react";
import { fetchLocationDetails } from "@/utils/mapUtils";

export default function PointDetails({ point, detail, setDetail }) {
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    if (!point) return;
    setIsFetching(true);
    fetchLocationDetails(point.lat, point.lng).then((data) => {
      setDetail(data);
      setIsFetching(false);
    });
  }, [point, setDetail]);

  if (!point) return "Not set";

  const formattedCoords = `Lat: ${point.lat}, Lng: ${point.lng}`;
  const name = detail?.name || detail?.address?.road;
  // || "Unnamed location";
  const city =
    detail?.address?.neighbourhood ||
    detail?.address?.county ||
    detail?.address?.city ||
    detail?.address?.town ||
    detail?.address?.village ||
    "";

  const country = detail?.address?.country || "";

  return (
    <div>
      {isFetching ? (
        <>
          <div className="flex flex-col gap-1 ">
            <span className="h-[18px] w-full bg-black/10 rounded-sm animate-pulse"></span>
            <span className="h-[18px] w-full bg-black/10 rounded-sm animate-pulse"></span>
          </div>
        </>
      ) : (
        <div className="text-sm">
          <p className="font-medium">{name}</p>
          <p>{detail?.display_name}</p>
        </div>
      )}
    </div>
  );
}
