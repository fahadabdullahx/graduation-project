"use server";

import { createAdmonClient, createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SendNotification } from "./admin";

export async function SignUpAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const full_name = formData.get("full_name");
  const phone_number = formData.get("phone_number");
  const gender = formData.get("gender");
  const errors = {};

  if (!email) {
    errors.email = ["Email is required"];
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = ["Invalid email address"];
  }

  if (!password) {
    errors.password = ["Password is required"];
  } else if (password.length < 6) {
    errors.password = ["Password must be at least 6 characters"];
  }
  if (!full_name) {
    errors.full_name = ["Full name is required"];
  }
  if (!phone_number) {
    errors.phone_number = ["Phone number is required"];
  } else if (phone_number.length !== 10) {
    errors.phone_number = ["Phone number must be 10 digits"];
  } else if (!/^\d+$/.test(phone_number)) {
    errors.phone_number = ["Phone number must be a number"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  // console.table({
  //   email,
  //   password,
  //   full_name,
  //   phone_number,
  //   gender,
  // });

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone_number,
        gender,
        usertype: "passenger",
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  SendNotification({
    type: "welcome",
    title: "Welcome",
    body: `Hello ${full_name}, welcome to our app. We are glad to have you here.`,
    user_id: data.user.id,
  });

  redirect("/sign-in?conform=email");
}

export async function SignInAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {};
  if (!email) {
    errors.email = ["Email is required"];
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = ["Invalid email address"];
  }

  if (!password) {
    errors.password = ["Password is required"];
  } else if (password.length < 6) {
    errors.password = ["Password must be at least 6 characters"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }
  redirect(prevState.redirect || "/account");
}

export const getUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return user;
};

export const getUserByEmail = async (email) => {
  const supabase = await createAdmonClient();
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.log("error", error);
    return;
  }
  // console.log("users", data);
  // filter by email
  let user = data.users.find((user) => user.email === email) || null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError) {
      return;
    }
    user = {
      ...profile,
      email: user?.email,
      moredata: user,
    };
  }
  return user;
};

export const GetProfile = async (id) => {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", id)
    .single();
  if (profileError) {
    return { errors: profileError.message };
  }

  return profile;
};
export const GetMyProfile = async (noError) => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    if (noError?.noError === true) {
      return null;
    }
    return { errors: "You are not logged in" };
  }
  const { data: myProfile, error: myProfileError } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", user.id)
    .single();
  if (myProfileError) {
    return { errors: myProfileError.message };
  }
  return {
    email: user.email,
    usertype: user.user_metadata.usertype,
    ...myProfile,
  };
};

export const UpdateMyProfile = async (prevState, formData) => {
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const gender = formData.get("gender");
  const phone_number = formData.get("phone_number");
  const errors = {};
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = ["Email is required"];
  }
  if (!full_name) {
    errors.full_name = ["Full name is required"];
  }
  if (!gender || !["male", "female"].includes(gender)) {
    errors.gender = ["Gender must be either male or female"];
  }
  if (!phone_number) {
    errors.phone_number = ["Phone number is required"];
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (user.email !== email) {
    const { error } = await supabase.auth.update({
      email,
    });
    if (error) {
      return { errors: error.message };
    }
  }
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: full_name,
      phone_number: phone_number,
      gender: gender,
    })
    .eq("id", user.id)
    .select();
  if (error) {
    console.log("error", error);
    return { errors: error.message };
  }
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
};

export const GetMyReviews = async ({ type }) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) return { error: "You are not logged in" };
  if (!type) return { error: "Type is required" };
  // if type is me get reviews with userId if type is for-me get reviews with forId
  const { data, error } = await supabase
    .from("reviews")
    .select(`*`)
    .eq(type == "by_me" ? "user_id" : "for_id", user.data.user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error);
    return;
  }
  // console.log("data", data);
  return data;
};

export const SignOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const revalida = await cookies();
  revalida.set("revalida", JSON.stringify(Math.random()));
  redirect("/sign-in");
};

export const GetMyRequests = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from("requests")
    .select(`*`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error);
    return;
  }
  return data;
};

export const GetMyNotifications = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  const { data, error } = await supabase
    .from("notifications")
    .select(`*`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) {
    console.log("error", error);
    return;
  }
  // subscribe to notifications

  return data;
};
