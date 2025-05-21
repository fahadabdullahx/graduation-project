import {
  Accessibility,
  Cat,
  Cigarette,
  CircleSlash2,
  Coffee,
  Music,
  Utensils,
  Wifi,
  Wind,
} from "lucide-react";
import React from "react";
export const DefaultAmenitiesList = [
  { icon: Wifi, name: "Wifi", key: "wifi" },
  { icon: Coffee, name: "Food&Drink", key: "food" },
  { icon: Music, name: "Music", key: "music" },
  { icon: Cigarette, name: "Smoking", key: "smoking" },
  { icon: Cat, name: "Pets", key: "pets" },
  { icon: Wind, name: "Air Conditioning", key: "air_conditioning" },
  { icon: Accessibility, name: "Accessibility", key: "accessibility" },
];

export function AmenitiesList() {
  return DefaultAmenitiesList;
}

export function TripAmenities({ amenities }) {
  return (
    <div className="flex flex-col items-start justify-between">
      <span className="font-bold text-lg -mb-1.5">Amenities</span>
      <div className="flex flex-col justify-start items-start gap-2 flex-wrap">
        {/* Show available amenities first */}
        {DefaultAmenitiesList.map((amenity, index) => {
          const isAvailable = amenities.includes(amenity.key);
          if (isAvailable)
            return (
              <span
                key={index}
                className="flex gap-2 items-center justify-center"
              >
                <amenity.icon size={20} strokeWidth={1.5} />
                {amenity.name}
              </span>
            );
        })}
        {/* Then show unavailable amenities */}
        {DefaultAmenitiesList.map((amenity, index) => {
          const isAvailable = amenities.includes(amenity.key);
          if (!isAvailable)
            return (
              <span
                key={index}
                className="flex gap-2 items-center justify-center opacity-80"
              >
                <span className="relative">
                  <amenity.icon size={20} strokeWidth={1.5} />
                  <CircleSlash2
                    size={25}
                    strokeWidth={1.5}
                    className="absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 text-red-500 opacity-50"
                  />
                </span>
                {amenity.name} not available
              </span>
            );
        })}
      </div>
    </div>
  );
}
