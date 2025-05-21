"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { EndIcon, StartIcon, StopIcon } from "./mapIcons";
function RoutingMachine({ start, end, stopPoints }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Function to clean up routing control
    const cleanupRoutingControl = () => {
      if (routingControlRef.current) {
        try {
          // Remove event listeners first
          if (routingControlRef.current._router) {
            routingControlRef.current.off("routesfound");
          }
          // Clear waypoints
          routingControlRef.current.getPlan().setWaypoints([]);
          // Remove control from map
          map.removeControl(routingControlRef.current);
        } catch (error) {
          // console.warn("Cleanup error:", error);
        } finally {
          routingControlRef.current = null;
        }
      }
    };

    // cleanupRoutingControl(); // Clean up any existing routing control

    // Define waypoints including stopPoints
    const waypoints = [
      L.latLng(start.lat, start.lon),
      ...stopPoints.map((point) => L.latLng(point.lat, point.lon)),
      L.latLng(end.lat, end.lon),
    ];

    const routingControl = L.Routing.control({
      waypoints,
      lineOptions: { styles: [{ color: "#1c1c1c", weight: 5 }] },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
      router: new L.Routing.OSRMv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        suppressDemoServerWarning: true,
      }),
    });

    routingControl.addTo(map);
    routingControlRef.current = routingControl;

    // Handle routes found
    const routeHandler = (e) => {
      if (e.routes.length > 0) {
      }
    };

    routingControl.on("routesfound", routeHandler);

    return () => {
      if (routingControlRef.current) {
        routingControl.off("routesfound", routeHandler);
        cleanupRoutingControl();
      }
    };
  }, [map, start, end, stopPoints]);

  return null;
}

export default function TripMap({ startPoint, endPoint, stopPoints }) {
  const AddOSRMAttribution = () => {
    const map = useMap();
    useEffect(() => {
      map.attributionControl.addAttribution(
        'Routing powered by <a href="http://project-osrm.org" target="_blank" rel="noopener noreferrer">Project OSRM</a>'
      );
    }, [map]);
    return null;
  };
  return (
    <>
      <div className="h-[200px] w-full rounded-lg overflow-hidden z-40">
        <MapContainer
          center={[20.173762, 41.633162]}
          zoom={3}
          className="h-full w-full z-10"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
            url="https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          />
          <AddOSRMAttribution />

          {/* <LocationMarker /> */}
          {startPoint && (
            <Marker position={startPoint} icon={StartIcon} draggable={false}>
              <Popup>Start point</Popup>
            </Marker>
          )}
          {endPoint && (
            <Marker position={endPoint} icon={EndIcon} draggable={false}>
              <Popup>End point</Popup>
            </Marker>
          )}
          {/* Drop Points */}
          {stopPoints.map((point, index) => (
            <Marker key={index} position={point} icon={StopIcon}>
              <Popup>Drop point {index + 1}</Popup>
            </Marker>
          ))}

          {/* Routing Machine */}
          {startPoint && endPoint && (
            <RoutingMachine
              start={startPoint}
              stopPoints={stopPoints}
              end={endPoint}
            />
          )}
        </MapContainer>
      </div>
    </>
  );
}
