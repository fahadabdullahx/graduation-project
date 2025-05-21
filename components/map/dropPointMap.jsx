"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EndIcon,
  StopIcon,
  DropIcon,
  PickupIcon,
} from "@/components/map/mapIcons";

function RoutingMachine({ start, end, stopPoints }) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    // Function to clean up routing control
    const cleanupRoutingControl = () => {
      setTimeout(() => {
        if (routingControlRef.current) {
          try {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
          } catch (error) {
            console.warn("Error removing routing controlsssssssssss:", error);
          }
        }
      }, 5000);
    };

    cleanupRoutingControl(); // Clean up any existing routing control

    // Define waypoints including stopPoints
    const waypoints = [
      L.latLng(start.lat, start.lng),
      ...stopPoints.map((point) => L.latLng(point.lat, point.lng)),
      L.latLng(end.lat, end.lng),
    ];

    const routingControl = L.Routing.control({
      waypoints,
      lineOptions: { styles: [{ color: "#1c1c1c", weight: 5 }] },
      show: false,
      addWaypoints: false,
      routeWhileDragging: true,
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

    return () => {
      if (routingControlRef.current) {
        cleanupRoutingControl();
      }
    };
  }, [map, start, end, stopPoints]);

  return null;
}

function MapClickHandler({ startPoint, endPoint, setNewPoint, pointType }) {
  useMapEvents({
    click(e) {
      if (!startPoint) {
        return;
      } else if (!endPoint) {
        return;
      }
      if (startPoint && endPoint) {
        setNewPoint((prev) => [
          ...prev,
          { lat: e.latlng.lat, lng: e.latlng.lng, type: pointType },
        ]);
      }
    },
  });

  return null;
}

export default function DropPointMap({
  startPoint,
  endPoint,
  stopPoints,
  setRouteInfo,
  newPoint,
  setNewPoint,
  pointType,
  searchResults,
}) {
  const AddOSRMAttribution = () => {
    const map = useMap();
    useEffect(() => {
      map.attributionControl.addAttribution(
        'Routing powered by <a href="http://project-osrm.org" target="_blank" rel="noopener noreferrer">Project OSRM</a>'
      );
    }, [map]);
    return null;
  };

  function ShowSearchResults() {
    if (!searchResults) return null;

    const map = useMap();
    let loc = { lat: searchResults.lat, lng: searchResults.lon };

    map.flyTo(loc, 15, {
      animate: false,
      duration: 1.5,
      easeLinearity: 2,
    });
    return null;
    // return (
    //   <>
    //     <Marker position={searchResults} icon={startIcon}>
    //       {/* <Popup>You are here Set as start point</Popup> */}
    //     </Marker>
    //   </>
    // );
  }

  return (
    <div className="flex flex-col gap-2 z-10">
      <Card className=" h-fit p-0">
        <CardContent className="p-0">
          <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[20.173762, 41.633162]}
              zoom={3}
              className="h-full w-full z-10"
            >
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
                url="https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
              />
              <AddOSRMAttribution />
              <ShowSearchResults />

              {/* <LocationMarker /> */}
              {startPoint && (
                <Marker position={startPoint} icon={StopIcon} draggable={false}>
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
                <Marker
                  key={index}
                  position={point}
                  icon={StopIcon}
                  draggable={false}
                >
                  <Popup>Drop point</Popup>
                </Marker>
              ))}
              {newPoint.map((point, index) => (
                <Marker
                  key={index}
                  position={point}
                  icon={point.type == "drop" ? DropIcon : PickupIcon}
                  draggable={true} // Make it draggable
                  eventHandlers={{
                    dragend: (e) => {
                      setNewPoint((prev) =>
                        prev.map((p, i) =>
                          i === index ? e.target.getLatLng() : p
                        )
                      );
                    },
                  }}
                >
                  <Popup>
                    Drop point {index + 1}
                    <br />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setTimeout(() => {
                          setNewPoint((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }, 10);
                      }}
                    >
                      Remove
                    </Button>
                  </Popup>
                </Marker>
              ))}

              {/* Routing Machine */}
              {startPoint && endPoint && (
                <RoutingMachine
                  start={startPoint}
                  stopPoints={stopPoints}
                  end={endPoint}
                  setRouteInfo={setRouteInfo}
                />
              )}

              <MapClickHandler
                startPoint={startPoint}
                endPoint={endPoint}
                newPoint={newPoint}
                setNewPoint={setNewPoint}
                pointType={pointType}
              />
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
