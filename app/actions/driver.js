"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SendNotification } from "./admin";

export const DriverRegistrationAction = async (prevState, formData) => {
  const userEmail = formData.get("userEmail");
  const email = formData.get("email");
  const userId = formData.get("userId");
  const driverLicense = formData.get("driverLicense");
  const driverPhoto = formData.get("driverPhoto");
  const vehicleRegistration = formData.get("vehicleRegistration");
  const vehicleSeat = formData.get("vehicleSeat");
  const vehicleModel = formData.get("vehicleModel");
  const vehicleYear = formData.get("vehicleYear");
  const vehicleColor = formData.get("vehicleColor");
  // if any of the values are empty, return an error

  if (
    !userEmail ||
    !userId ||
    !driverLicense ||
    !driverPhoto ||
    !vehicleRegistration ||
    !vehicleSeat ||
    !vehicleModel ||
    !vehicleYear ||
    !vehicleColor
  ) {
    let errors = null;
    if (!userEmail) {
      errors = { ...errors, userEmail: "Email is required" };
    }
    if (!email) {
      errors = { ...errors, email: "Email is required" };
    }
    if (!userId) {
      errors = { ...errors, userId: "User ID is required" };
    }
    if (!driverLicense) {
      errors = { ...errors, driverLicense: "Driver License is required" };
    }
    if (!driverPhoto) {
      errors = { ...errors, driverPhoto: "Driver Photo is required" };
    }
    if (!vehicleRegistration) {
      errors = {
        ...errors,
        vehicleRegistration: "Vehicle Registration is required",
      };
    }
    if (!vehicleSeat) {
      errors = { ...errors, vehicleSeat: "Vehicle Seat is required" };
    }
    if (!vehicleModel) {
      errors = { ...errors, vehicleModel: "Vehicle Model is required" };
    }
    if (!vehicleYear) {
      errors = { ...errors, vehicleYear: "Vehicle Year is required" };
    }
    if (!vehicleColor) {
      errors = { ...errors, vehicleColor: "Vehicle Color is required" };
    }
    return { error: errors };
  }

  const supabase = await createClient();
  let filesPaths = {};
  const uploadAvatar = async (image, fileName) => {
    // const file = event.target.files[0];
    const fileExt = image.name.split(".").pop();
    const filePath = `${userId}-${fileName}-${Math.random()}.${fileExt}`;
    filesPaths = {
      ...filesPaths,
      [fileName]: filePath,
    };
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, image);
    console.log("uploadError", uploadError);
  };
  uploadAvatar(driverLicense, "driverLicense");
  uploadAvatar(driverPhoto, "driverPhoto");
  uploadAvatar(vehicleRegistration, "vehicleRegistration");

  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        request_type: "driver registration",
        user_id: userId,
        data: {
          userEmail: userEmail,
          filesPaths: filesPaths,
          vehicleModel: vehicleModel,
          vehicleSeat: vehicleSeat,
          vehicleYear: vehicleYear,
          vehicleColor: vehicleColor,
        },
        status: "pending",
      },
    ])
    .select();
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }

  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  SendNotification({
    type: "request",
    title: "Request to become a driver",
    body: "",
    user_id: userId,
    url: `/account?s=my-requests`,
  });

  redirect("/account?s=my-requests");
};

export const CarRegistrationFormAction = async (prevState, formData) => {
  const userEmail = formData.get("userEmail");
  const userId = formData.get("userId");
  const vehicleModel = formData.get("vehicleModel");
  const vehicleYear = formData.get("vehicleYear");
  const vehicleColor = formData.get("vehicleColor");
  const vehicleRegistration = formData.get("vehicleRegistration");
  const vehicleSeat = formData.get("vehicleSeat");

  const supabase = await createClient();

  let filePath = "";
  const uploadAvatar = async (image) => {
    const fileExt = image.name.split(".").pop();
    filePath = `${userId}-${"driverLicense"}-${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, image);
    console.log("uploadError", uploadError);
  };

  uploadAvatar(vehicleRegistration, "vehicleRegistration");
  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        request_type: "car registration",
        user_id: userId,
        data: {
          userEmail: userEmail,
          vehicleModel: vehicleModel,
          vehicleYear: vehicleYear,
          vehicleRegistration: filePath,
          vehicleColor: vehicleColor,
          vehicleSeat: vehicleSeat,
        },
        status: "pending",
      },
    ])
    .select();
  if (error) {
    return { error: error.message };
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  SendNotification({
    type: "request",
    title: "Request to add a car",
    body: "",
    user_id: userId,
    url: `/account?s=my-requests`,
  });
  redirect("/account?s=my-requests");
};

export const GetMyCars = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from("cars")
    .select(`*`)
    .eq("owner", user.id);
  if (error) {
    console.log("error", error);
    return;
  }
  return data;
};
