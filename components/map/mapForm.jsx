import React, { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateTrip } from "@/app/actions/trips";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submitButton";
import PointDetails from "@/components/map/pointDetails";
import { calculatePrice } from "@/utils/mapUtils";

import SearchLocation from "@/components/map/searchLocation";
import { DefaultAmenitiesList } from "@/components/trip/amenitiesList";

export default function MapForm({
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  stopPoints,
  setStopPoints,
  routeInfo,
  setRouteInfo,
  setSearchResults,
  searchResults,
  myCars,
  // edte
  price,
  dateTime,
  car,
  oldAmenities,
  tripId,
  seat,
  //
}) {
  const [startPointDetails, setStartPointDetails] = useState(null);
  const [endPointDetails, setEndPointDetails] = useState(null);
  const [selectedCar, setSelectedCar] = useState(car || "");
  const [offeredSeat, setOfferedSeat] = useState(seat || 0);
  const [amenities, setAmenities] = useState(
    DefaultAmenitiesList.map((amenity) => ({
      ...amenity,
      //if amenity.key is in oldAmenities set value to true else false
      value: oldAmenities?.includes(amenity.key) ? true : false,
    }))
  );

  const [state, formAction] = useActionState(CreateTrip, {});
  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setRouteInfo({});
    setStartPointDetails(null);
    setEndPointDetails(null);
    setSelectedCar("");
    setStopPoints([]);
    setSuggestedPrice(0);
    setAmenities(
      DefaultAmenitiesList.map((amenity) => ({
        ...amenity,
        value: oldAmenities?.includes(amenity.key) ? true : false,
      }))
    );
  };

  const [suggestedPrice, setSuggestedPrice] = useState(0);

  useEffect(() => {
    if (routeInfo?.distance && routeInfo?.time && selectedCar) {
      setSuggestedPrice(
        calculatePrice({
          distance: routeInfo.distance,
          time: routeInfo.time,
          carType: myCars?.find((car) => car.id === selectedCar)?.type,
          // carType: "luxury",
          // carType: "standard",
          // carType: "economy",
          seat: offeredSeat,
        })
      );
    }
  }, [routeInfo, amenities, selectedCar, offeredSeat]);

  return (
    <Card className="order-1 lg:order-0">
      <CardHeader className="pb-2">
        <CardTitle className="font-bold text-lg">Trip Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" action={formAction}>
          <input
            type="text"
            name="tripId"
            id="tripId"
            value={tripId || undefined}
            readOnly
            hidden
          />
          <input
            type="text"
            hidden
            readOnly
            name="startPoint"
            value={JSON.stringify(startPoint) || ""}
            required
          />
          <input
            type="text"
            hidden
            readOnly
            name="endPoint"
            value={JSON.stringify(endPoint) || ""}
            required
          />

          <div className="space-y-4">
            {/* Start Point */}
            <div className="flex flex-row gap-2 justify-center items-center">
              <div className="flex flex-col gap-2 w-full">
                <div className="grid gap-2">
                  <Label>
                    Start Point{" "}
                    {state.errors?.startPointDetails && (
                      <>
                        <span className="text-sm text-red-500">Required</span>
                      </>
                    )}
                  </Label>
                  <div className="text-sm text-muted-foreground flex items-start justify-between gap-2 relative">
                    <PointDetails
                      point={startPoint}
                      detail={startPointDetails}
                      setDetail={setStartPointDetails}
                    />
                    <SearchLocation
                      setSearchResults={setSearchResults}
                      startPoint={startPoint}
                      setStartPoint={setStartPoint}
                      endPoint={endPoint}
                      setEndPoint={setEndPoint}
                      setStopPoints={setStopPoints}
                      searchResults={searchResults}
                    />
                  </div>

                  <input
                    type="text"
                    value={JSON.stringify(startPointDetails)}
                    hidden
                    readOnly
                    required
                    name="startPointDetails"
                  />
                </div>
                {/* <span>stop points {stopPoints.length}</span> */}
                {/* End Point */}
                <input
                  type="text"
                  value={JSON.stringify(stopPoints)}
                  hidden
                  readOnly
                  required
                  name="stopPoints"
                />

                <div className="grid gap-2">
                  <Label>
                    End Point{" "}
                    {state.errors?.endPointDetails && (
                      <>
                        <span className="text-sm text-red-500">Required</span>
                      </>
                    )}
                  </Label>
                  <div className="text-sm text-muted-foreground flex items-start justify-between gap-2 relative">
                    <PointDetails
                      point={endPoint}
                      detail={endPointDetails}
                      setDetail={setEndPointDetails}
                    />
                    <SearchLocation
                      setSearchResults={setSearchResults}
                      startPoint={startPoint}
                      setStartPoint={setStartPoint}
                      endPoint={endPoint}
                      setEndPoint={setEndPoint}
                      setStopPoints={setStopPoints}
                      searchResults={searchResults}
                    />
                  </div>
                  <input
                    type="text"
                    value={JSON.stringify(endPointDetails)}
                    hidden
                    readOnly
                    required
                    name="endPointDetails"
                  />
                </div>
              </div>
            </div>
            {/* Distance and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="me-auto">
                <Label>Total Distance</Label>
                <div className="text-sm text-muted-foreground">
                  {routeInfo?.distance
                    ? `${routeInfo?.distance?.toFixed(2)} km`
                    : "0.00 km"}
                </div>
              </div>
              <div className="ms-auto">
                <Label>Estimated Time</Label>
                <div className="text-sm text-muted-foreground">
                  {routeInfo?.time
                    ? `${routeInfo?.time?.toFixed(1)} min`
                    : "0.00 min"}
                </div>
              </div>
            </div>
            {/* Date & Time */}
            <div className="grid gap-2">
              <Label htmlFor="dataTime">
                Date&Time{" "}
                {state.errors?.datatime && (
                  <>
                    <span className="text-sm text-red-500">Required</span>
                  </>
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  name="dateTime"
                  id="dataTime"
                  className="flex-1"
                  defaultValue={dateTime}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="car">
                Car{" "}
                {state.errors?.car && (
                  <>
                    <span className="text-sm text-red-500">Required</span>
                  </>
                )}
              </Label>
              {myCars?.length > 0 ? (
                <Select
                  name="car"
                  value={selectedCar}
                  onValueChange={(value) => {
                    setSelectedCar(value);
                  }}
                  required
                  id="car"
                >
                  <SelectTrigger className="w-full" id="car">
                    <SelectValue placeholder="Select car" id="car" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCars?.map((car) => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.model} ({car.year}) - {car.color} - {car.seat}{" "}
                        seats
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex flex-col gap-2 w-full text-sm text-muted-foreground">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    No cars available, please add a car first
                  </span>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="offeredSeat">
                Offered Seat{" "}
                {state.errors?.offeredSeat && (
                  <>
                    <span className="text-sm text-red-500">Required</span>
                  </>
                )}
              </Label>
              <Input
                type="number"
                id="offeredSeat"
                name="offeredSeat"
                defaultValue={
                  myCars?.find((car) => car.id === selectedCar)?.seat
                }
                value={offeredSeat}
                onChange={(e) => setOfferedSeat(e.target.value)}
                required
                min={1}
                max={myCars?.find((car) => car.id === selectedCar)?.seat}
                disabled={!selectedCar}
              />
              <div className="text-sm text-muted-foreground">
                {selectedCar &&
                  `Maximum ${
                    myCars?.find((car) => car.id === selectedCar)?.seat
                  }`}
              </div>
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price{" "}
                {state.errors?.price && (
                  <>
                    <span className="text-sm text-red-500">Required</span>
                  </>
                )}
              </Label>
              <Input
                type="number"
                id="price"
                name="price"
                // placeholder={price || suggestedPrice}
                defaultValue={price || 0}
                min={0}
                step={0.1}
                disabled={!suggestedPrice}
              />
              <div className="text-sm text-muted-foreground">
                {suggestedPrice ? (
                  <div>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      suggested price is{" "}
                      <span className="text-[15px] font-extrabold text-[#474143]">
                        {suggestedPrice.toFixed(2)}
                      </span>
                      <img src="/SAR.svg" alt="logo" className="w-4" />
                      per seat
                    </span>
                  </div>
                ) : (
                  "suggested price will be calculated based on the distance, time and car type"
                )}
              </div>
              <span className="text-sm font-bold text-muted-foreground">
                Note: You can set the price to 0 if you want to offer a free
                ride.
              </span>
            </div>
            {/* amenities */}
            <div className="space-y-4">
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-5">
                {amenities.map((amenity) => (
                  <div
                    key={amenity.key}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={amenity.key}
                      name="amenities"
                      value={amenity.key}
                      checked={amenity.value}
                      onCheckedChange={(checked) => {
                        setAmenities((prev) =>
                          prev.map((item) =>
                            item.key === amenity.key
                              ? { ...item, value: checked }
                              : item
                          )
                        );
                      }}
                    />
                    <label
                      htmlFor={amenity.key}
                      className="text-sm font-medium leading-none"
                    >
                      {amenity.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Reset Points Button */}
          <div className="flex gap-2 w-full ">
            <SubmitButton className="w-full">Submit</SubmitButton>
            <Button
              variant="destructive"
              type="button"
              className="w-fit"
              onClick={resetPoints}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
