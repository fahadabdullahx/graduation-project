"use server";

import { createAdmonClient, createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getUserByEmail } from "./user";

export const GetRequests = async (reqType) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, profiles(*)")
    .ilike("request_type", `%${reqType}%`)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  return data;
};

export const serachUser = async (q) => {
  if (!q) return [];
  const searchValue = q.toLowerCase();
  const isEmail = /\S+@\S+\.\S+/.test(searchValue);
  const isPhone = /^\d{10}$/.test(searchValue);
  const isName = /^[a-zA-Z\s]+$/.test(searchValue);
  let searcghType = null;
  if (isEmail) {
    searcghType = "email";
  } else if (isPhone) {
    searcghType = "phone_number";
  } else if (isName) {
    searcghType = "full_name";
  } else {
    return { error: "Invalid search value" };
  }
  if (searcghType === "email") {
    const user = await getUserByEmail(searchValue);
    return [user];
  } else if (searcghType === "phone_number" || searcghType === "full_name") {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .ilike(searcghType, `%${searchValue}%`);
    if (error) {
      console.log("error", error);
      return { error: error.message };
    }
    // Add email information to each profile from the users list
    const supabaseAdmin = await createAdmonClient();
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.log("error", listError);
      return { error: listError.message };
    }
    const users = data.map((profile) => {
      const user = listData.users.find((u) => u.id === profile.id);
      return {
        ...profile,
        email: user?.email,
        moredata: user,
      };
    });
    return users;
  } else {
    return { error: "Invalid search type" };
  }
};

export const updateUserType = async (user_id, type) => {
  const supabase = await createAdmonClient();
  const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
    user_metadata: { usertype: type },
  });
  console.log("data", data);
  console.log("error", error);
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
};

export const acceptedCarRequest = async ({ id, carType }) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("id", id)
    .single()
    .select();
  if (data) {
    const { data: carData, error: carError } = await supabase
      .from("cars")
      .insert({
        color: data.data.vehicleColor,
        model: data.data.vehicleModel,
        year: data.data.vehicleYear,
        owner: data.user_id,
        seat: data.data.vehicleSeat,
        type: carType,
      });
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  SendNotification({
    type: "request",
    title: "Car request accepted",
    body: "",
    user_id: data.user_id,
    url: `/account?s=my-requests`,
  });
  return data;
};

export const rejectedCarRequest = async (id) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "rejected" })
    .eq("id", id)
    .select();
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  SendNotification({
    type: "request",
    title: "Car request rejected",
    body: "",
    user_id: data.user_id,
    url: `/account?s=my-requests`,
  });
  return data;
};

export const SendNotification = async ({ type, title, body, user_id, url }) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: user_id,
      title: title,
      body: body,
      type: type,
      url: url || null,
    })
    .select();
  if (error) {
    console.log("error", error);
    return { error: error.message };
  }
  return data;
};
