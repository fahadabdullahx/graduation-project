import UpdeteUserType from "@/components/admin/updeteUserType";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <ProtectedRoute requiredRole={"user"}>
      <div className="container mx-auto p-4 pt-0">
        <h1 className="text-2xl font-bold">Updete the user type </h1>
        <p>
          this page is only for testing and for the presentation of the
          application, it is not a part of the application and it will be
          removed in the future.
        </p>

        <UpdeteUserType id={user.id} type={"passenger"} />
        <UpdeteUserType id={user.id} type={"driver"} />
        <UpdeteUserType id={user.id} type={"admin"} />
      </div>
    </ProtectedRoute>
  );
}
