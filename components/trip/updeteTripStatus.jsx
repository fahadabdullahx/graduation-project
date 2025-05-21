"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submitButton";
import { updeteTripStatusAction } from "@/app/actions/trips";
import { useActionState, useEffect, useState } from "react";

export default function UpdeteTripStatus({
  tripId,
  title,
  status,
  buttonVariant,
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(updeteTripStatusAction, {});
  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
    }
  }, [state.status]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant || "outline"}
          size={title ? "default" : "icon"}
          className={`font-black rounded-lg cursor-pointer  justify-start ${
            title ? "w-full flex flex-row items-center gap-3 " : ""
          }}`}
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <form>
            <input
              type="text"
              name="id"
              hidden
              className="hidden"
              value={tripId}
              readOnly
            />
            <input
              type="text"
              name="status"
              hidden
              className="hidden"
              value={status}
              readOnly
            />

            <SubmitButton
              variant="destructive"
              formAction={formAction}
              pendingText="canceling..."
              className="w-full"
            >
              Yes
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
