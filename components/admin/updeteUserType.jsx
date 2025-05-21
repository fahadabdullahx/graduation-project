"use client";
import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateUserType } from "@/app/actions/admin";
export default function UpdeteUserType({ id, type }) {
  if (!type) {
    return null;
  }
  const [state, formAction] = useActionState(
    updateUserType.bind(null, id, type)
  );

  return (
    <form action={formAction}>
      <Button>Change to {type}</Button>
      {state?.error && <p className="text-sm text-red-500">{state?.error}</p>}
    </form>
  );
}
