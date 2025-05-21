import Stripe from "stripe";
import { headers } from "next/headers";
import { UpdeteBookingAction } from "@/app/actions/trips";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
export async function POST(request) {
  const body = await request.text();
  const sig = headers().get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  // Handle the event
  console.log("event.type", event.type);
  switch (event.type) {
    //if the payment is successful
    case "checkout.session.completed":
      await UpdeteBookingAction({
        tripId: event.data.object.metadata.trip_id,
        booking_id: event.data.object.metadata.booking_id,
        userId: event.data.object.metadata.user_id,
        seat: event.data.object.metadata.seat,
        status: "confirmed",
      });
      console.log("checkout.session.completed", event.type);
      break;
    //if the payment is failed
    case "checkout.session.async_payment_failed":
      await UpdeteBookingAction({
        tripId: event.data.object.metadata.trip_id,
        booking_id: event.data.object.metadata.booking_id,
        userId: event.data.object.metadata.user_id,
        seat: event.data.object.metadata.seat,
        status: "failed",
      });
      console.log("checkout.session.async_payment_failed", event.type);
      break;
    //if the payment is pending
    case "checkout.session.async_payment_succeeded":
      await UpdeteBookingAction({
        tripId: event.data.object.metadata.trip_id,
        booking_id: event.data.object.metadata.booking_id,
        userId: event.data.object.metadata.user_id,
        seat: event.data.object.metadata.seat,
        status: "pending",
      });
      console.log("checkout.session.async_payment_succeeded", event.type);
      break;
    //if the payment is canceled
    case "checkout.session.expired":
      await UpdeteBookingAction({
        tripId: event.data.object.metadata.trip_id,
        booking_id: event.data.object.metadata.booking_id,
        userId: event.data.object.metadata.user_id,
        seat: event.data.object.metadata.seat,
        status: "canceled",
      });
      console.log("checkout.session.expired", event.type);
      break;
    // Add more cases for other event types you want to handle
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
