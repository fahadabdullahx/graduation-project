"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function GoogleMapDirections({
  origin,
  destination,
  waypoints = [], // Optional waypoints; defaults to empty array
  ...props
}) {
  const handleClick = () => {
    // Format coordinates as "lat,lng"
    const originParam = `${origin.lat},${origin.lng}`;
    const destinationParam = `${destination.lat},${destination.lng}`;

    // Build the URL with origin and destination
    let url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(originParam)}` +
      `&destination=${encodeURIComponent(destinationParam)}`;

    // If waypoints are provided, format them and append to the URL
    if (waypoints.length > 0) {
      const waypointsParam = waypoints
        .map((wp) => `${wp.lat},${wp.lng}`)
        .join("|");
      url += `&waypoints=${encodeURIComponent(waypointsParam)}`;
    }

    // Open the URL in a new tab
    window?.open(url, "_blank");
  };

  return (
    <Button {...props} onClick={handleClick}>
      Open In Google Maps
    </Button>
  );
}
