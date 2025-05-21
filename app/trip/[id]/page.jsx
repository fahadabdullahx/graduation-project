import {
  Ban,
  CalendarDays,
  Car,
  CircleCheckBigIcon,
  Clock,
  EllipsisVertical,
  MapPin,
  Sparkle,
} from "lucide-react";
import StarRating from "@/components/starRating";
import Chat from "@/components/trip/chat";
import Review from "@/components/trip/review";
import { Card, CardContent } from "@/components/ui/card";

import { GetTripById } from "@/app/actions/trips";
import Map from "@/components/trip/mapLoader";
import BookTrip from "@/components/trip/bookTrip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TripAmenities } from "@/components/trip/amenitiesList";
import Avatar from "@/components/user/avatar";
import { createClient } from "@/lib/supabase/server";
import UpdeteTripStatus from "@/components/trip/updeteTripStatus";
import CancelBooking from "@/components/trip/cancelBooking";
import TripBookingList from "@/components/trip/tripBookingList";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await GetTripById(id);

  if (data.errors) {
    return {
      title: "Trip Not Found",
      description: "The requested trip could not be found.",
    };
  }

  const departureDate = new Date(data.departure_time).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const departureTime = new Date(data.departure_time).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const availableSeats =
    data.offered_seat -
    data.bookings.filter((booking) => booking.status !== "canceled").length;

  return {
    title: `Trip: ${data.start_location} to ${data.end_location}`,
    description: `Trip from ${data.start_location} to ${data.end_location}. Departing on ${departureDate} at ${departureTime}. ${availableSeats} seats available. Price: ${data.price} SAR per seat. Vehicle: ${data.car.model} (${data.car.year} - ${data.car.color})`,
    openGraph: {
      title: `Trip: ${data.start_location} to ${data.end_location}`,
      description: `Trip from ${data.start_location} to ${data.end_location}. Departing on ${departureDate} at ${departureTime}. ${availableSeats} seats available.`,
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;
  const data = await GetTripById(id);
  if (data.errors) {
    return (
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="m-auto">
          <h1 className="text-3xl font-bold">Trip Not Found</h1>
          <p className="text-lg text-muted-foreground">
            The requested trip could not be found.
          </p>
          <Link href="/search" className="text-blue-500 hover:underline">
            Search for trips
          </Link>
        </div>
      </div>
    );
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isDriver = data.driver.id === user?.id;

  const isPassenger = data.bookings.some(
    (booking) => booking.user_id === user?.id && booking.status !== "canceled"
  );

  const myBooking = isPassenger
    ? data.bookings.find(
        (booking) =>
          booking.user_id === user?.id && booking.status !== "canceled"
      ) || null
    : null;
  return (
    <div className="container mx-auto p-4 md:min-h-[calc(100vh-200px)]">
      <div className="flex flex-col md:flex-row  gap-2 mb-4">
        <TripStatus status={data?.status} />
        <BookingStatus status={myBooking?.status} />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_400px] grid-rows-1">
        <div className="flex flex-col gap-5">
          <Card className=" h-fit p-0">
            <CardContent className="p-0">
              <Map
                sp={{
                  lat: data.start_latitude,
                  lon: data.start_longitude,
                }}
                ep={{
                  lat: data.end_latitude,
                  lon: data.end_longitude,
                }}
                stopPoints={data.stop_points.map((stopPoint) => ({
                  lat: stopPoint.latitude,
                  lng: stopPoint.longitude,
                  status: stopPoint.status,
                  id: stopPoint.id,
                  user: stopPoint.user_id,
                }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                <div className="flex items-start justify-start gap-2 ">
                  <MapPin strokeWidth={2} size={30} className="mt-1.5 " />
                  <div className="flex flex-col items-start justify-between">
                    <span className="font-bold text-lg -mb-1.5">From</span>
                    <span className="line-clamp-2">{data.start_location}</span>
                  </div>
                </div>

                <div className="flex items-start justify-start gap-2 ">
                  <MapPin strokeWidth={2} size={30} className="mt-1.5 " />
                  <div className="flex flex-col items-start justify-between">
                    <span className="font-bold text-lg -mb-1.5">
                      Disyination
                    </span>
                    <span className="line-clamp-2">{data.end_location}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="h-fit p-2">
            <CardContent className="p-2 h-fit">
              <div className="flex items-start justify-start gap-2 ">
                <Sparkle
                  strokeWidth={0}
                  size={25}
                  fill="#000"
                  className="mt-1.5"
                />
                <TripAmenities amenities={data.amenities} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div
          className={`flex flex-col gap-5 ${
            isDriver ? "-order-1 md:order-none " : ""
          }`}
        >
          <Card className="h-fit p-2 ">
            <CardContent className="p-2 h-fit">
              <div className="flex flex-row justify-between items-start gap-2">
                <Link href={`/profile/${data.driver.id} `}>
                  <div className="flex justify-center items-start gap-2">
                    <div className="h-15 w-15 rounded-full overflow-hidden">
                      <Avatar
                        avatar_url={data.driver.avatar_url}
                        uid="Driver avatar"
                        noUpload={true}
                      />
                    </div>

                    <div className="flex flex-col items-start">
                      <h2 className="font-extrabold text-2xl">
                        {data.driver.full_name}
                      </h2>
                      <div className="flex items-center justify-center gap-2">
                        <StarRating
                          readOnly
                          initialRating={data.driver.rating || 0}
                        />
                        <span className="text-sm font-bold text-muted-foreground">
                          {Math.round(data.driver.rating * 2) / 2 || 0}/5
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* <Report /> */}
                {isDriver && data?.status !== "completed" && (
                  <Option
                    id={data.id}
                    departure_time={data.departure_time}
                    status={data?.status}
                  />
                )}
              </div>
              {isDriver && (
                <div className="mt-2">
                  <TripBookingList
                    bookings={data.bookings}
                    stopPoints={data.stop_points}
                    sp={{
                      lat: data.start_latitude,
                      lon: data.start_longitude,
                    }}
                    ep={{
                      lat: data.end_latitude,
                      lon: data.end_longitude,
                    }}
                  />
                </div>
              )}

              {isPassenger || isDriver ? (
                <div className="mt-2">
                  <Chat
                    tripId={data.id}
                    passengers={
                      //only return the passengers that are not canceled
                      data.bookings.filter(
                        (booking) =>
                          booking.user_id !== user?.id &&
                          booking.status !== "canceled"
                      ) || []
                    }
                    isDriver={isDriver}
                    isPassenger={isPassenger}
                    user={user}
                    driver={data.driver}
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="h-fit p-2 ">
            <CardContent className="p-2 h-fit grid grid-cols-2">
              <div className="flex items-start justify-start gap-2">
                <img
                  src="/SAR.svg"
                  className="min-w-[30] w-[30px] h-[20px] mt-1.5 "
                />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">Price</span>
                  {data.price === 0 ? (
                    <span className="text-sm font-bold text-muted-foreground">
                      Free
                    </span>
                  ) : (
                    data.price + " per seat"
                  )}{" "}
                </h2>
              </div>
              <div className="flex items-start justify-start gap-2">
                <MapPin
                  strokeWidth={2}
                  className="min-w-[30] w-[30px] mt-1.5 "
                />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">Stop Point</span>
                  {data.stop_points.length || 0}
                </h2>
              </div>
              <div className="flex items-start justify-start gap-2">
                <Clock
                  strokeWidth={2}
                  className="min-w-[30] w-[30px] mt-1.5 "
                />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">Time</span>
                  {new Date(data.departure_time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </h2>
              </div>

              <div className="flex items-start justify-start gap-2">
                <CalendarDays
                  strokeWidth={2}
                  className="min-w-[30] w-[30px] mt-1.5 "
                />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">Date</span>
                  {new Date(data.departure_time).toLocaleDateString("en-US", {
                    formatMatcher: "best fit",
                  })}
                </h2>
              </div>
              <div className="flex items-start justify-start gap-2">
                <Car strokeWidth={2} className="min-w-[30] w-[30px] mt-1.5 " />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">Vehicle</span>
                  {data.car.model}
                  <span className="text-sm font-bold text-muted-foreground">{`(${data.car.year} - ${data.car.color})`}</span>
                </h2>
              </div>
              <div className="flex items-start justify-start gap-2">
                <Car strokeWidth={2} className="min-w-[30] w-[30px] mt-1.5 " />
                <h2 className="flex flex-col items-start justify-between">
                  <span className="font-bold text-lg -mb-1.5">
                    Available Seats
                  </span>
                  {data.offered_seat -
                    data.bookings.filter(
                      (booking) => booking.status !== "canceled"
                    ).length}
                </h2>
              </div>
            </CardContent>
          </Card>

          {(!isDriver || data.status == "completed") && (
            <Card className="h-fit p-0">
              <CardContent className="p-0">
                <div className="flex justify-end items-center p-2 md:p-0">
                  {!isPassenger && !isDriver && (
                    <BookTrip
                      data={data}
                      buttonClass={"h-11 text-2xl"}
                      user={user}
                    />
                  )}
                  {isPassenger &&
                    new Date(data.departure_time) - new Date() >
                      5 * 60 * 60 * 1000 &&
                    data.status === "offer" && (
                      <CancelBooking
                        bookingId={myBooking.id}
                        title="cancel booking"
                      />
                    )}

                  {data.status == "completed" && (isDriver || isPassenger) && (
                    <Review
                      tripId={data.id}
                      driver_id={data.driver.id}
                      isDriver={isDriver}
                      myReview={
                        data.reviews.filter(
                          (review) => review.user_id === user?.id
                        ) || null
                      }
                      booking={
                        data.bookings.filter(
                          (booking) =>
                            booking.user_id !== user?.id &&
                            booking.status !== "canceled"
                        ) || []
                      }
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Option({ id, departure_time, status }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="">
        <Card className="border-0 shadow-none p-0 gap-2">
          <CardContent className="flex flex-col gap-2 p-2 text-start">
            {new Date(departure_time) - new Date() > 5 * 60 * 60 * 1000 &&
              status === "offer" && (
                <Button
                  variant="outline"
                  className="text-left w-full cursor-pointer"
                >
                  <Link
                    href={`/new-trip/${id}`}
                    className="w-full flex flex-row justify-start items-center gap-3 font-black rounded-lg"
                  >
                    Edit Trip
                  </Link>
                </Button>
              )}
            {status === "offer" && (
              <UpdeteTripStatus
                status={"active"}
                tripId={id}
                title={"Start Trip"}
                buttonVariant="outline"
              />
            )}
            {status === "active" && (
              <UpdeteTripStatus
                status={"completed"}
                tripId={id}
                title={"Complete Trip"}
                buttonVariant="outline"
              />
            )}
            {new Date(departure_time) - new Date() > 5 * 60 * 60 * 1000 &&
              status == "offer" && (
                <UpdeteTripStatus
                  status={"canceled"}
                  tripId={id}
                  title={"Cancel"}
                  buttonVariant="destructive"
                />
              )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

function TripStatus({ status }) {
  if (status === "offer") return null;
  if (status === "active") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <Clock size={70} strokeWidth={2.5} className="stroke-yellow-600" />
            <h1 className="text-3xl font-bold">Trip Started</h1>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (status === "completed") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <CircleCheckBigIcon
              size={70}
              strokeWidth={2.5}
              className="stroke-green-600"
            />
            <h1 className="text-3xl font-bold">Trip Completed</h1>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "canceled") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <Ban size={70} strokeWidth={2.5} className="stroke-red-600" />
            <h1 className="text-3xl font-bold">Trip Canceled</h1>
          </div>
        </CardContent>
      </Card>
    );
  }
}
function BookingStatus({ status }) {
  if (status === undefined) return null;
  if (status === "pending") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <Clock size={70} strokeWidth={2.5} className="stroke-yellow-600" />
            <h1 className="text-3xl font-bold">your booking is pending</h1>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (status === "confirmed") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <CircleCheckBigIcon
              size={70}
              strokeWidth={2.5}
              className="stroke-green-600"
            />
            <h1 className="text-3xl font-bold">your booking is confirmed</h1>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === "canceled") {
    return (
      <Card className="p-1 h-40 -mt-4x mb-4 rounded-t-nonex flex justify-center items-center w-full">
        <CardContent>
          <div className="text-center flex flex-col items-center justify-center gap-2">
            <Ban size={70} strokeWidth={2.5} className="stroke-red-600" />
            <h1 className="text-3xl font-bold">your booking is canceled</h1>
          </div>
        </CardContent>
      </Card>
    );
  }
}
