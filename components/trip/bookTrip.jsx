"use client";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submitButton";
import { BookingAction } from "@/app/actions/trips";
import StarRating from "@/components/starRating";
import { Input } from "@/components/ui/input";
import AddDropPoint from "@/components/trip/addDropPoint";
import { useState } from "react";
import { LoginForm } from "@/components/auth/loginForm";

export default function BookTrip({ data, buttonClass, user }) {
  const [newPoint, setNewPoint] = useState([]);
  const [bookedSeats, setBookedSeats] = useState(1);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={`font-black w-full cursor-pointer ${buttonClass}`}
        >
          Book Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {user ? (
          <>
            <DialogHeader>
              <DialogTitle>Booking</DialogTitle>
              <DialogDescription>Book your seats now</DialogDescription>
            </DialogHeader>
            <div className="grid gap-0 py-0">
              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-1 text-lg font-bold ">
                  <MapPin size={25} strokeWidth={2} />
                  <p className="flex flex-col gap-0">
                    <span className="-mb-3 text-base font-light">From</span>
                    {data.start_location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold ">
                  <MapPin size={25} strokeWidth={2} />
                  <p className="flex flex-col gap-0">
                    <span className="-mb-3 text-base font-light">To</span>
                    {data.end_location}
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between text-lg mt-2">
                <div className="flex flex-row gap-0.5 items-center justify-center">
                  <img src="/SAR.svg" alt="logo" className=" w-4" />
                  <p>{data?.price ? data?.price + " per seat" : "FREE"} </p>
                </div>
                <div className="flex flex-row gap-0.5 items-center justify-center">
                  <CalendarDays size={20} strokeWidth={2} />
                  <p>
                    {new Date(data.departure_time).toLocaleDateString("en-US")}
                  </p>
                </div>
                <div className="flex flex-row gap-0.5 items-center justify-center">
                  <Clock size={20} strokeWidth={2} />
                  <p>
                    {new Date(data.departure_time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-row gap-0.5 items-center justify-center">
                  <User size={20} strokeWidth={2} />
                  <p>
                    {data.offered_seat -
                      data.bookings.filter(
                        (booking) => booking.status !== "canceled"
                      ).length}{" "}
                    seats left
                  </p>
                </div>
              </div>
              <hr className="mt-3" />

              <div className="flex flex-row justify-between text-sm mt-2">
                <div className="flex flex-row gap-0.5 justify-between items-center w-full">
                  <div>
                    <h2 className="font-bold text-lg line-clamp-1">
                      {data?.driver?.full_name}

                      <span className="ms-1 font-medium text-base">
                        {data?.driver?.gender}
                      </span>
                    </h2>
                  </div>
                  <div className="flex">
                    <StarRating
                      initialRating={data.driver.rating || 0 || 0}
                      readOnly
                    />
                    <span className="text-xs">
                      {Math.round(data.driver.rating * 2) / 2 || 0}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <form className="flex flex-col gap-5 items-end w-full">
                <input
                  type="text"
                  hidden
                  className="hidden"
                  value={data.id}
                  name="trip"
                  readOnly
                />
                <div className="flex flex-row w-full items-end gap-2">
                  <div className="flex flex-col w-full max-w-20">
                    <label htmlFor="seat">Seats</label>
                    <Input
                      id="seat"
                      type="number"
                      name="seat"
                      value={bookedSeats}
                      onChange={(e) => {
                        if (e.target.value > 0) {
                          setBookedSeats(e.target.value);
                        } else {
                          setBookedSeats(1);
                        }
                      }}
                      max={
                        data.offered_seat -
                        data.bookings.filter(
                          (booking) => booking.status !== "canceled"
                        ).length
                      }
                      className="w-full h-9 px-2 py-1 border border-gray-300 rounded-md "
                    />
                  </div>
                  <AddDropPoint
                    from={{
                      lat: data.start_latitude,
                      lng: data.start_longitude,
                    }}
                    to={{
                      lat: data.end_latitude,
                      lng: data.end_longitude,
                    }}
                    stopPoints={data.stop_points.map((stopPoint) => ({
                      lat: stopPoint.latitude,
                      lng: stopPoint.longitude,
                    }))}
                    setNewPoint={setNewPoint}
                    newPoint={newPoint}
                  />
                </div>
                <input
                  type="text"
                  name="newStopPoint"
                  id="newStopPoint"
                  value={JSON.stringify(newPoint)}
                  readOnly
                  hidden
                />
                <SubmitButton
                  formAction={BookingAction}
                  pendingText="Saving..."
                  className=" w-full font-black text-3xl"
                  disabled={
                    data.offered_seat -
                      data.bookings.filter(
                        (booking) => booking.status !== "canceled"
                      ).length <=
                    0
                  }
                >
                  Book Now for{" "}
                  {data?.price ? data?.price * bookedSeats + " SAR" : "FREE"}
                </SubmitButton>
              </form>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Login to Book</DialogTitle>
              <DialogDescription>
                Please login to your account to book a trip
              </DialogDescription>
            </DialogHeader>
            <LoginForm redirect={`/trip/${data.id}`} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
