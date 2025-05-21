"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SendNotification } from "./admin";

export async function CreateTrip(prevState, formData) {
  const startPointDetails = JSON.parse(formData.get("startPointDetails"));
  const endPointDetails = JSON.parse(formData.get("endPointDetails"));
  const stopPoints = JSON.parse(formData.get("stopPoints"));
  const datatime = formData.get("dateTime");
  const car = formData.get("car");
  const offeredSeat = formData.get("offeredSeat");
  const price = formData.get("price");
  const amenities = formData.getAll("amenities");
  const tripId = formData.get("tripId");
  let errors = {};
  if (
    !startPointDetails ||
    !endPointDetails ||
    !datatime ||
    !car ||
    !offeredSeat ||
    !price
  ) {
    if (!startPointDetails) {
      errors.startPointDetails = "Start point is required";
    }
    if (!endPointDetails) {
      errors.endPointDetails = "End point is required";
    }
    if (!datatime) {
      errors.datatime = "Date and time is required";
    }
    if (!car) {
      errors.car = "Car is required";
    }
    if (!offeredSeat) {
      errors.offeredSeat = "Offered seat is required";
    }
    if (!price) {
      errors.price = "Price is required";
    }
    return { errors };
  }

  // return;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (tripId) {
    const { data: trip, error } = await supabase
      .from("trips")
      .update({
        start_location: startPointDetails.display_name,
        end_location: endPointDetails.display_name,
        start_latitude: startPointDetails.lat,
        start_longitude: startPointDetails.lon,
        end_latitude: endPointDetails.lat,
        end_longitude: endPointDetails.lon,
        departure_time: datatime,
        status: "offer",
        offered_seat: offeredSeat,
        price: price,
        car: car,
        amenities: amenities,
      })
      .eq("id", tripId)
      .select("id")
      .single();
    if (!error) {
      const stopPointsFormet = stopPoints.map((stopPoint) => ({
        latitude: stopPoint.lat,
        longitude: stopPoint.lng,
        status: "confirmed",
        user_id: user.data.user.id,
        trip_id: trip.id,
      }));
      // handle dlete stop points or update stop points
      const { error: stopPointsError } = await supabase
        .from("stop_points")
        .delete()
        .eq("trip_id", trip.id);
      if (stopPointsError) {
        console.log("stopPointsError", stopPointsError);
      }
      // insert stop points
      const { data, error } = await supabase
        .from("stop_points")
        .upsert(stopPointsFormet)
        .select();
      if (error) {
        console.log("error", error);
      }
    }
    if (error) {
      console.log("error", error);
    }
    SendNotification({
      type: "trip",
      title: "Trip Updated",
      body: `Trip from ${startPointDetails.display_name} to ${endPointDetails.display_name} updated`,
      user_id: user.data.user.id,
      url: `/trip/${trip.id}`,
    });

    return redirect(`/trip/${trip.id}`);
  }
  const { data: trip, error } = await supabase
    .from("trips")
    .insert([
      {
        driver_id: user.data.user.id,
        start_location: startPointDetails.display_name,
        end_location: endPointDetails.display_name,
        start_latitude: startPointDetails.lat,
        start_longitude: startPointDetails.lon,
        end_latitude: endPointDetails.lat,
        end_longitude: endPointDetails.lon,
        departure_time: datatime,
        status: "offer",
        offered_seat: offeredSeat,
        price: price,
        car: car,
        amenities: amenities,
      },
    ])
    .select("id")
    .single();
  if (trip) {
    const stopPointsFormet = stopPoints.map((stopPoint) => ({
      latitude: stopPoint.lat,
      longitude: stopPoint.lng,
      status: "confirmed",
      user_id: user.data.user.id,
      trip_id: trip.id,
    }));
    const { data, error } = await supabase
      .from("stop_points")
      .insert(stopPointsFormet)
      .select();
    if (error) {
      console.log("error", error);
    }
  }
  if (error) {
    console.log("error", error);
  }
  SendNotification({
    type: "trip",
    title: "Trip Created",
    body: `Trip from ${startPointDetails.display_name} to ${endPointDetails.display_name} created`,
    user_id: user.data.user.id,
    url: `/trip/${trip.id}`,
  });
  return redirect(`/trip/${trip.id}`);
}

export const BookingAction = async (formData) => {
  const trip_id = formData.get("trip");
  const seat = formData.get("seat");
  const newStopPoint = JSON.parse(formData.get("newStopPoint"));

  if (!trip_id || !seat) {
    return redirect("?error=All fields are required");
  }
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in?error=Please login to book a trip");
  }

  // const status = newStopPoint.length > 0 ? "pending" : "confirmed";
  let { data: booking, error } = await supabase
    .from("bookings")
    .insert([
      {
        trip_id: trip_id,
        user_id: user.data.user.id,
        seat: seat,
        status: "pending",
      },
    ])
    .eq("id", trip_id)
    .single()
    .select();

  if (booking && newStopPoint.length > 0) {
    const stopPointsFormet = newStopPoint.map((stopPoint) => ({
      latitude: stopPoint.lat,
      longitude: stopPoint.lng,
      status: "pending",
      user_id: user.data.user.id,
      trip_id: trip_id,
      booking_id: booking.id,
    }));
    const { data, error } = await supabase
      .from("stop_points")
      .insert(stopPointsFormet)
      .select();
    if (error) {
      console.log("error", error);
    }
  }
  if (error) {
    return { errors: error.message };
  }
  // get trip
  let { data: trip, error: tripError } = await supabase
    .from("trips")
    .select(`*`)
    .eq("id", trip_id)
    .single();
  if (trip) {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.data.user.email,

      line_items: [
        {
          price_data: {
            currency: "sar",
            product_data: {
              name: "Trip",
              description: `From: ${trip.start_location} - To: ${trip.end_location}`,
            },
            unit_amount: trip.price * 100, // price in halalas
          },
          quantity: seat,
        },
      ],
      metadata: {
        booking_id: booking.id,
        trip_id: trip.id,
        user_id: user.data.user.id,
        seat: seat,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${trip.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/trip/${trip.id}?canceled=${trip.booking_id}`,
    });
    // send notification to the booking user
    SendNotification({
      type: "booking",
      title: "Booking",
      body: `Booking for trip ${trip.start_location} to ${trip.end_location} created`,
      user_id: user.data.user.id,
      url: `/trip/${trip.id}`,
    });
    SendNotification({
      type: "booking",
      title: "New Booking",
      body: `New booking for trip ${trip.start_location} to ${trip.end_location} created`,
      user_id: trip.driver_id,
      url: `/trip/${trip.id}`,
    });

    redirect(session.url);
  }

  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  return redirect(`/trip/${trip.id}`);
};

export const UpdeteBookingAction = async (data) => {
  const tripId = data?.tripId;
  const booking_id = data?.booking_id;
  const userId = data?.userId;
  const seat = data?.seat;
  const status = data?.status;

  if (!tripId || !booking_id || !userId || !seat) {
    return redirect("?error=All fields are required");
  }
  const supabase = await createClient();
  const { data: booking, error } = await supabase
    .from("bookings")
    .update({ status: status })
    .eq("id", booking_id)
    .select();
  if (error) {
    console.log("UpdeteBookingAction error", error);
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  // redirect(`/trip/${tripId}`);
};

export const CancelBookingAction = async (prevState, formData) => {
  const id = formData.get("id");

  const supabase = await createClient();
  if (!id) {
    return {
      errors: null,
      message: "All fields are required",
      status: "success",
    };
  }
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "canceled" })
    .eq("id", id)
    .select()
    .single();
  const { error: stopPointsError } = await supabase
    .from("stop_points")
    .delete()
    .eq("booking_id", id);
  if (stopPointsError) {
    console.log("stopPointsError", stopPointsError);
  }
  SendNotification({
    type: "booking",
    title: "Booking canceled",
    body: `Booking canceled`,
    user_id: data.user_id,
    url: `/trip/${data.trip_id}`,
  });
  // send notification to the driver

  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  return {
    errors: null,
    message: null,
    status: "success",
  };
};

export const AcceptStopPointAction = async (formData) => {
  const bookingId = formData.get("bookingId");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stop_points")
    .update({ status: "confirmed" })
    .eq("booking_id", bookingId)
    .select();
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
};

export async function GetTripById(id) {
  const supabase = await createClient();

  let { data: trips, error } = await supabase
    .from("trips")
    .select(
      `*,
      driver:driver_id(*),
      stop_points (*),
      car (*),
      reviews (*),
      bookings(*,
        profile:user_id!inner(*)
      )
`
    )
    .eq("id", id)
    .single();
  if (error) {
    return { errors: error.message };
  }
  return trips;
}
export const CancelTripAction = async (prevState, formData) => {
  const id = formData.get("id");
  const supabase = await createClient();
  if (!id) {
    return null;
  }
  const { data, error } = await supabase
    .from("trips")
    .update({ status: "canceled" })
    .eq("id", id)
    .select();
  SendNotification({
    type: "trip",
    title: "Trip canceled",
    body: `Trip from ${data.start_location} to ${data.end_location} canceled`,
    user_id: data.driver_id,
    url: `/trip/${data.id}`,
  });
  // send notification to all bookings
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select(`*`)
    .eq("trip_id", id);
  if (bookings) {
    bookings.forEach((booking) => {
      SendNotification({
        type: "trip",
        title: "Trip canceled",
        body: `Trip from ${data.start_location} to ${data.end_location} canceled`,
        user_id: booking.user_id,
        url: `/trip/${data.id}`,
      });
    });
  }

  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));

  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  return {
    errors: null,
    message: null,
    status: "success",
  };
};
export const updeteTripStatusAction = async (prevState, formData) => {
  const id = formData.get("id");
  const status = formData.get("status");
  const supabase = await createClient();
  if (!id || !status) {
    return {
      message: "All fields are required",
      status: "failed",
    };
  }
  const { data, error } = await supabase
    .from("trips")
    .update({ status: status })
    .eq("id", id)
    .select(`*`)
    .single();
  if (error) {
    console.log("error", error);
    return {
      message: error.message,
      status: "failed",
    };
  }

  SendNotification({
    type: "trip",
    title: `You changed the trip status to ${status}`,
    body: `Trip from ${data.start_location} to ${data.end_location} updated`,
    user_id: data.driver_id,
    url: `/trip/${data.id}`,
  });
  // send notification to all bookings
  const { data: bookings, error: bookingError } = await supabase
    .from("bookings")
    .select(`*`)
    .eq("trip_id", id);
  if (bookings) {
    bookings.forEach((booking) => {
      if (booking.status === "canceled") return;
      SendNotification({
        type: "trip",
        title: `Trip status changed to ${status}`,
        body: `Trip from ${data.start_location} to ${data.end_location} updated`,
        user_id: booking.user_id,
        url: `/trip/${data.id}`,
      });
    });
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  return {
    errors: null,
    message: null,
    status: "success",
  };
};

export async function GetMyTrips({ page }) {
  const currentPage = page || 1;
  const pageSize = 10; // Number of items per page

  // Calculate range
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize - 1;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in?error=Please login to book a trip");
  }
  let { data: trips, error } = await supabase
    .from("trips")
    .select(
      `*,
       car(*),
       bookings(*)
      `
    )
    .eq("driver_id", user.data.user.id)
    .range(start, end)
    .order("created_at", { ascending: false });

  const { count, error: countError } = await supabase
    .from("trips")
    .select(`*`, { count: "exact", head: true })
    .eq("user_id", user.data.user.id);
  return {
    trips,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}
export async function GetMyBooking({ page }) {
  const currentPage = page || 1;
  const pageSize = 10; // Number of items per page

  // Calculate range
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize - 1;
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in?error=Please login to book a trip");
  }
  let { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
        trip:trip_id(*)
      
        `
    )
    .eq("user_id", user.data.user.id)
    .range(start, end)
    .order("created_at", { ascending: false });

  const { count, error: countError } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.data.user.id);
  return {
    bookings,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export const SearchAction = async (q) => {
  const date = q.date;
  const from_address = JSON.parse(q.from_address);
  const to_address = JSON.parse(q.to_address);
  const gender = q.gender;

  const supabase = await createClient();

  async function searchTripsByLocations(
    startLat,
    startLng,
    endLat,
    endLng,
    radius = 500 // 1000 meters = 1 km
  ) {
    if (!startLat || !startLng || !endLat || !endLng) {
      return [];
    }
    const { data, error } = await supabase.rpc("search_trips_by_locations", {
      user_start_lat: startLat,
      user_start_lng: startLng,
      user_end_lat: endLat,
      user_end_lng: endLng,
      search_radius: radius,
    });

    if (error) {
      console.error("Error fetching trips:", error);
    } else {
      let query = supabase
        .from("trips")
        .select(
          `*,
          car (*),
          bookings(*,
            profile:user_id!inner(*)
          ),
          driver:driver_id!inner(*)`
        )
        .in(
          "id",
          data.map((t) => t.trip_id)
        )
        .eq("status", "offer")
        .gte("departure_time", date)
        .order("departure_time", { ascending: true });

      if (gender && gender !== "all") {
        query = query.eq("driver_id.gender", gender);
      }

      let { data: trips, error: tripError } = await query;
      if (tripError) {
        console.error("Error fetching trip details:", tripError);
        return [];
      }

      return trips;
    }
  }

  return searchTripsByLocations(
    from_address.lat,
    from_address.lon,
    to_address.lat,
    to_address.lon
  );
};

export const ReviewsTrip = async (formData) => {
  const rating = formData.get("rating");
  const comment = formData.get("comment");
  const tripId = formData.get("tripId");
  const forId = formData.get("forId");

  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  let { data, error } = await supabase.from("reviews").insert([
    {
      user_id: user.data.user.id,
      trip_id: tripId,
      rating: rating,
      comment: comment,
      for_id: forId ? forId : null,
    },
  ]);

  if (error) {
    return { errors: error.message };
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  // send notification to the driver
  SendNotification({
    type: "review",
    title: "Review",
    body: `New review ${rating} `,
    user_id: forId,
    url: `/trip/${tripId}`,
  });

  return {
    errors: null,
    message: "Review submitted successfully",
    status: "success",
  };
};

export const GetMessages = async ({ trip_id, user_id, for_id }) => {
  if (!trip_id || !user_id || !for_id) return [];
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) return;
  const filter =
    `and("for_id".eq.${for_id},user_id.eq.${user_id}),` +
    `and(user_id.eq.${for_id},"for_id".eq.${user_id})`;
  const { data, error } = await supabase
    .from("chats")
    .select(`*`)
    .eq("trip_id", trip_id)
    .or(filter)

    .order("created_at", { ascending: true });

  if (error) {
    console.log("GetMessages error", error);
    return { error: error.message };
  }
  return data || [];
};
