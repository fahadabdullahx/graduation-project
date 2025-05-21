"use client";
import TripCard from "@/components/trip/tripCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownZA, Clock, Star } from "lucide-react";
import { useState } from "react";
export default function SearchResult({ result }) {
  const [sortBy, setSortBy] = useState("");

  result &&
    result?.sort((a, b) => {
      if (sortBy === "lowestPrice") {
        return a.price - b.price;
      }
      if (sortBy === "highestPrice") {
        return b.price - a.price;
      }
      if (sortBy === "earliestTime") {
        return new Date(a.departure_time) - new Date(b.departure_time);
      }
      if (sortBy === "latestTime") {
        return new Date(b.departure_time) - new Date(a.departure_time);
      }
      if (sortBy === "highestRating") {
        return b.driver.rating - a.driver.rating;
      }
      if (sortBy === "lowestRating") {
        return a.driver.rating - b.driver.rating;
      }
      return 0;
    });

  return (
    <>
      <div>
        <div className=" flex flex-row items-start gap-1 mt-2">
          <div className="ms-auto mb-4">
            <Select name="sortBy" id="sortBy" onValueChange={setSortBy}>
              <SelectTrigger className="w-full " id="sortBy">
                <SelectValue placeholder="Sort by" />
                <ArrowDownZA />
              </SelectTrigger>
              <SelectContent className="*:cursor-pointer">
                <SelectGroup>
                  <SelectLabel className="test-2xl font-bold bg-primary/10 text-primary rounded-sm flex items-center gap-1">
                    <img src="/SAR.svg" alt="sarIcon" className="w-3 h-3" />
                    price
                  </SelectLabel>
                  <SelectItem value="lowestPrice">Lowest price</SelectItem>
                  <SelectItem value="highestPrice">Highest price</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="test-2xl font-bold bg-primary/10 text-primary rounded-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time
                  </SelectLabel>
                  <SelectItem value="earliestTime">Earliest time</SelectItem>
                  <SelectItem value="latestTime">Latest time</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="test-2xl font-bold bg-primary/10 text-primary rounded-sm flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Rating
                  </SelectLabel>
                  <SelectItem value="highestRating">Highest rating</SelectItem>
                  <SelectItem value="lowestRating">Lowest rating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2  xl:grid-cols-3">
        {result?.map((trip, i) => (
          <TripCard data={trip} key={Math.random()} />
        ))}
      </div>
    </>
  );
}
