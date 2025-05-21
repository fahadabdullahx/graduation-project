import React from "react";
import CarRegistrationForm from "@/components/driver/carRegistrationForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
export default async function AddCar() {
  const user = (await getUser()) || null;
  return (
    <Dialog>
      <DialogTrigger className="btn btn-primary" asChild>
        <Button>Add Car</Button>
      </DialogTrigger>
      <DialogContent className="min-w-screen sm:min-w-fit sm:max-w-[700px] px-1.5 overflow-auto max-h-dvh">
        <DialogHeader>
          <DialogTitle>Add Car</DialogTitle>
          <DialogDescription>Add your car to the platform</DialogDescription>
        </DialogHeader>
        <CarRegistrationForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
