import L from "leaflet";

export const StartIcon = new L.Icon({
  iconUrl: "/StartIcone.svg",
  iconSize: [30, 30],
  popupAnchor: [0, 0],
});

export const EndIcon = new L.Icon({
  iconUrl: "/EndIcone.svg",
  iconSize: [30, 30],
  popupAnchor: [0, 0],
});
export const StopIcon = new L.Icon({
  iconUrl: "/StopIcone.svg",
  iconSize: [30, 30],
  popupAnchor: [0, -20],
  iconAnchor: [15, 30],
});

export const DropIcon = new L.Icon({
  iconUrl: "/DropIcone.svg",
  iconSize: [30, 30],
  popupAnchor: [0, -20],
  iconAnchor: [15, 30],
});

export const PickupIcon = new L.Icon({
  iconUrl: "/PickupIcon.svg",
  iconSize: [30, 30],
  popupAnchor: [0, -20],
  iconAnchor: [15, 30],
});
