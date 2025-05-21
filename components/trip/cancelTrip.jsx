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
import { X } from "lucide-react";
import { SubmitButton } from "@/components/submitButton";
import { CancelTripAction } from "@/app/actions/trips";
import { use, useActionState, useEffect, useState } from "react";

export default function CancelTrip({ tripId, title }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(CancelTripAction, {});
  useEffect(() => {
    if (state.status === "success") {
      setOpen(false);
    }
  }, [state.status]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size={title ? "default" : "icon"}
          className={`font-black rounded-lg cursor-pointer ${
            title
              ? "w-full flex flex-row justify-center items-center gap-3"
              : ""
          }}`}
        >
          <X strokeWidth={3} />
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

            <SubmitButton
              variant="destructive"
              formAction={formAction}
              pendingText="canceling..."
              className="w-full"
            >
              Yes Cancel
            </SubmitButton>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
