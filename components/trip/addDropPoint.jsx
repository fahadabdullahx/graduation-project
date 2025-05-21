"use client";
import { MapPin, SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

import { SubmitButton } from "@/components/submitButton";
import searchLocation from "@/components/map/searchLocation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchByNameLocation } from "@/utils/mapUtils";

// Dynamically load the MapComponent with SSR disabled
const DropPointMap = dynamic(() => import("@/components/map/dropPointMap"), {
  ssr: false,

  loading: () => (
    <Card className="h-fit p-0">
      <CardContent className="p-0">
        <div className="h-[400px] w-full rounded-lg overflow-hidden flex items-center justify-center font-black text-3xl animate-pulse bg-black/5">
          LOADING MAP
        </div>
      </CardContent>
    </Card>
  ),
});

export default function AddDropPoint({
  from,
  to,
  stopPoints,
  newPoint,
  setNewPoint,
}) {
  const [pointType, setPointType] = useState("drop");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(false);

  const [routeInfo, setRouteInfo] = useState();
  const search = async (query) => {
    setLoading(true);
    const res = await SearchByNameLocation(query);
    setResults(res);
    setLoading(false);
  };
  // only search when the user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query) return;
      search(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);
  const searchInputRef = useRef(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="font-black w-full">
          {/* add drop/pickup point */}
          Add Drop/Pickup Point <MapPin />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] h-fit max-h-svh overflow-auto">
        <DialogHeader>
          <DialogTitle>add drop Points</DialogTitle>
          <DialogDescription>
            Add your drop points to your trip
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 w-full relative">
          <Label htmlFor="searchLocation">search</Label>
          <div className="w-full bg-white shadow-lg flex flex-col justify-end ">
            <div className="flex justify-between ">
              <Input
                ref={searchInputRef}
                type="text"
                id="searchLocation"
                className="w-full px-1.5 pr-9"
                placeholder="Search for a location"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
              />
              <Button
                variant="ghost"
                type="button"
                size="icon"
                className="absolute right-0 "
                onClick={() => search(query)}
              >
                <SearchIcon />
              </Button>
            </div>
            {open && (
              <div className="w-full absolute top-full z-50 bg-amber-400">
                {loading && <p className="p-2">Loading...</p>}
                {results?.length > 0 ? (
                  <ul>
                    {results.map((result) => (
                      <li key={result.place_id}>
                        <p
                          className="p-2 ho
                          ver:bg-gray-100 cursor-pointer"
                          onMouseEnter={() => {
                            setSearchResults({
                              lat: result.lat,
                              lon: result.lon,
                              pointType: pointType,
                            });
                          }}
                          onMouseLeave={() => {
                            setSearchResults(null);
                          }}
                        >
                          {result.display_name}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </div>
        </div>
        <div className="grid gap-2 ">
          <span>Point Type</span>
          <div>
            <Button
              variant={pointType == "drop" ? "default" : "secondary"}
              onClick={() => {
                setPointType("drop");
              }}
              role="radio"
            >
              Drop Point
            </Button>
            <Button
              variant={pointType == "pickup" ? "default" : "secondary"}
              onClick={() => {
                setPointType("pickup");
              }}
              role="radio"
            >
              pickup Point
            </Button>
          </div>
        </div>
        <DropPointMap
          newPoint={newPoint}
          setNewPoint={setNewPoint}
          startPoint={from}
          endPoint={to}
          stopPoints={stopPoints}
          routeInfo={routeInfo}
          setRouteInfo={setRouteInfo}
          pointType={pointType}
          searchResults={searchResults}
        />

        <DialogFooter className={"flex flex-col gap-2"}>
          <DialogClose asChild>
            <Button variant="default" className="w-full cursor-pointer">
              Save
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={() => setNewPoint([])}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
