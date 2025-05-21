"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SubmitButton } from "@/components/submitButton";
import { AcceptStopPointAction } from "@/app/actions/trips";
const TripMap = dynamic(() => import("@/components/map/tripMap"), {
  ssr: false,

  loading: () => (
    <Card className="h-fit p-0">
      <CardContent className="p-0">
        <div className="h-[200px] w-full rounded-lg overflow-hidden flex items-center justify-center font-black text-3xl animate-pulse bg-black/5">
          LOADING MAP
        </div>
      </CardContent>
    </Card>
  ),
});

export default function StopPoints({ stopPoints, sp, ep, bookingId }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer w-full hover:drop-shadow-lg"
        >
          Map
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 gap-1 w-full md:max-w-[800px]">
        <DialogHeader className="w-full px-6 border-b pb-2">
          <div className="flex flex-row items-start gap-2">
            <div>
              <DialogTitle>Stop points map</DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit *:h-[500px]">
          <TripMap
            startPoint={{ lat: sp?.lat, lon: sp?.lon }}
            endPoint={{ lat: ep?.lat, lon: ep?.lon }}
            stopPoints={stopPoints?.map((stopPoints) => ({
              lat: stopPoints.latitude,
              lon: stopPoints.longitude,
            }))}
          />
        </div>
        <form action={AcceptStopPointAction}>
          <input
            type="hidden"
            name="bookingId"
            hidden
            readOnly
            value={bookingId}
          />
          <SubmitButton className="w-full mt-4" variant="outline" type="submit">
            Accept
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
