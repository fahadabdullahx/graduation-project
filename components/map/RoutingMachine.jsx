import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function RoutingMachine({
  start,
  end,
  setRouteInfo,
  stopPoints,
}) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

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

    // Clean up existing route before creating new one
    cleanupRoutingControl();

    try {
      // Include stopPoints in waypoints array
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
        routeWhileDragging: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        createMarker: () => null,
        router: new L.Routing.OSRMv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "car",
          useHints: false,
          suppressDemoServerWarning: true,
        }),
      });

      // Add control to map and store reference
      routingControlRef.current = routingControl;
      routingControl.addTo(map);

      const routeHandler = (e) => {
        const routes = e.routes;
        if (routes.length > 0) {
          const summary = routes[0].summary;
          setRouteInfo({
            distance: summary.totalDistance / 1000,
            time: summary.totalTime / 60,
          });
        }
      };

      routingControl.on("routesfound", routeHandler);
    } catch (error) {
      console.error("Error setting up route:", error);
    }

    // Cleanup function
    return () => {
      cleanupRoutingControl();
    };
  }, [map, start, end, setRouteInfo, stopPoints]);

  return null;
}
