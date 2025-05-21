import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Button } from "@/components/ui/button";

import RoutingMachine from "./RoutingMachine";

import { EndIcon, StartIcon, StopIcon } from "./mapIcons";

function MapClickHandler({
  startPoint,
  endPoint,
  setStartPoint,
  setEndPoint,
  setStopPoints,
}) {
  useMapEvents({
    click(e) {
      if (!startPoint) {
        setStartPoint(e.latlng);
      } else if (!endPoint) {
        setEndPoint(e.latlng);
      }
      if (startPoint && endPoint) {
        setStopPoints((prev) => [...prev, e.latlng]);
      }
    },
  });

  return null;
}

export default function Map({
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  stopPoints,
  setStopPoints,
  setRouteInfo,
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
    return (
      <>
        <Marker position={searchResults} icon={StartIcon}>
          <Popup>You are here Set as start point</Popup>
        </Marker>
      </>
    );
  }

  return (
    <MapContainer
      center={[20.173762, 41.633162]}
      zoom={3}
      className="h-full w-full z-10"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
        url="https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
      />
      <AddOSRMAttribution />
      <ShowSearchResults />

      {startPoint && (
        <Marker
          position={startPoint}
          icon={StartIcon}
          draggable={true} // Make it draggable
          eventHandlers={{
            dragend: (e) => {
              setStartPoint(e.target.getLatLng()); // Update state on drag end
            },
          }}
        >
          <Popup>
            Start point
            <br />
            <Button
              variant="destructive"
              onClick={() => {
                setTimeout(() => {
                  setStartPoint(null);
                }, 10);
              }}
            >
              Remove
            </Button>
          </Popup>
        </Marker>
      )}
      {endPoint && (
        <Marker
          position={endPoint}
          icon={EndIcon}
          draggable={true} // Make it draggable
          eventHandlers={{
            dragend: (e) => {
              setEndPoint(e.target.getLatLng()); // Update state on drag end
            },
          }}
        >
          <Popup>
            End point
            <br />
            <Button
              variant="destructive"
              onClick={() => {
                setTimeout(() => {
                  setEndPoint(null);
                }, 10);
              }}
            >
              Remove
            </Button>
          </Popup>
        </Marker>
      )}
      {/* Stop Points */}
      {stopPoints.map((point, index) => (
        <Marker
          key={index}
          position={point}
          icon={StopIcon}
          draggable={true} // Make it draggable
          eventHandlers={{
            dragend: (e) => {
              setStopPoints((prev) =>
                prev.map((p, i) => (i === index ? e.target.getLatLng() : p))
              );
            },
          }}
        >
          <Popup>
            Stop point {index + 1}
            <br />
            <Button
              variant="destructive"
              //   className="mt-2 font-black text-black py-1 rounded-lg w-full bg-red-600"
              onClick={() => {
                setTimeout(() => {
                  setStopPoints((prev) => prev.filter((_, i) => i !== index));
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
        setStartPoint={setStartPoint}
        setEndPoint={setEndPoint}
        setStopPoints={setStopPoints}
      />
    </MapContainer>
  );
}
