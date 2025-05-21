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
import StarRating from "@/components/starRating";
import StopPoints from "./stopPoints";
export default function TripBookingList({ bookings, stopPoints, sp, ep }) {
  const numberOfBooking = bookings.filter(
    (booking) => booking.status !== "canceled"
  ).length;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative cursor-pointer w-full hover:drop-shadow-lg"
        >
          Booking List <span>({numberOfBooking})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 gap-1 w-full md:max-w-[1000px]">
        <DialogHeader className="w-full px-6 border-b pb-2">
          <div className="flex flex-row items-start gap-2">
            <div>
              <DialogTitle>Booking List</DialogTitle>
              <DialogDescription>
                List of bookings for this trip ({numberOfBooking})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit">
          <table className="w-full text-sm text-center text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  full name
                </th>
                <th scope="col" className="px-6 py-3">
                  gender
                </th>
                <th scope="col" className="px-6 py-3">
                  seat
                </th>
                <th scope="col" className="px-6 py-3">
                  rating
                </th>

                <th scope="col" className="px-6 py-3">
                  status
                </th>
                <th scope="col" className="px-6 py-3">
                  stop points
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const bookingStopPoints = stopPoints.filter(
                  (stopPoint) => stopPoint.booking_id == booking.id
                );
                return (
                  <tr
                    className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
                    key={booking.id}
                  >
                    <th
                      scope="row"
                      className="px-2 py-2 font-medium text-gray-900"
                    >
                      {booking.profile.full_name}
                    </th>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      {booking.profile.gender}
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      {booking.seat}
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      <StarRating
                        readOnly
                        initialRating={booking.profile.rating || 0}
                      />
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      {booking.status}
                    </td>
                    <td className="px-2 py-2 font-medium text-gray-900">
                      {bookingStopPoints.length > 0 ? (
                        <div>
                          {bookingStopPoints[0].status == "pending" ? (
                            <StopPoints
                              stopPoints={bookingStopPoints || []}
                              sp={sp || []}
                              ep={ep || []}
                              bookingId={booking.id}
                            />
                          ) : (
                            <div>{bookingStopPoints[0].status}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">~</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
