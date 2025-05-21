"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/starRating";
import { SubmitButton } from "@/components/submitButton";
import { ReviewsTrip } from "@/app/actions/trips";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function Review({
  driver_id,
  isDriver,
  booking,
  myReview,
  tripId = null,
}) {
  const FormField = ({
    label,
    name,
    type,
    placeholder,
    value,
    required = true,
  }) => {
    const [rating, setRating] = useState(value || 1);
    return (
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label className="flex flex-row gap-1 text-xl font-bold" htmlFor={name}>
          {label}
        </Label>
        {type === "starRating" ? (
          <div className="px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive items-center">
            <StarRating
              initialRating={rating}
              onChange={setRating}
              // readOnly={true}
            />
            <input
              type="number"
              name={name}
              id={name}
              value={rating}
              className="hidden"
              placeholder={placeholder}
              required={required}
              readOnly={true}
              min={1}
              max={5}
            />
          </div>
        ) : (
          <Input
            name={name}
            id={name}
            type={type}
            value={value}
            placeholder={placeholder}
            required={required}
          />
        )}
      </div>
    );
  };

  if (isDriver) {
    const [selectedUser, setSelectedUser] = useState("");
    const r = myReview.find((review) => review.for_id === selectedUser) || null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer w-full">
            Review
            <Star strokeWidth={2} fill="#fff" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-fit ">
          <DialogHeader className="w-full px-6 border-b pb-2">
            <DialogTitle>Review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <form action={ReviewsTrip}>
            <div className="grid gap-2">
              <Label htmlFor="passenger">passenger</Label>
              <Select
                name="passenger"
                onValueChange={(value) => {
                  setSelectedUser(value);
                }}
                required
              >
                <SelectTrigger className="w-full " id="passenger">
                  <SelectValue
                    placeholder="select the passenger to review"
                    id="passenger"
                  />
                </SelectTrigger>
                <SelectContent className="z-[9999999999999]">
                  <SelectGroup>
                    <SelectLabel>passengers</SelectLabel>
                    {booking.map((passenger, i) => (
                      <SelectItem
                        value={passenger.profile.id}
                        key={passenger.profile.id}
                      >
                        {passenger.profile.full_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {selectedUser ? (
              r ? (
                <>
                  <div className="flex flex-col items-start gap-1 mt-2">
                    <Label
                      className="flex flex-row gap-1 text-xl font-bold"
                      htmlFor="rating"
                    >
                      Rating
                    </Label>
                    <div className="px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive items-center">
                      <StarRating initialRating={r?.rating} readOnly />
                      {r?.rating}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-1 mt-2">
                    <Label
                      className="flex flex-row gap-1 text-xl font-bold"
                      htmlFor="rating"
                    >
                      Comment
                    </Label>
                    <Input value={r?.comment || "No comment"} readOnly />
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    name="tripId"
                    value={tripId}
                    className="hidden"
                    required
                    readOnly
                  />
                  <input
                    type="text"
                    name="forId"
                    value={selectedUser}
                    required
                    hidden
                    readOnly
                  />
                  <FormField
                    label={"Rating"}
                    name={"rating"}
                    placeholder={"rating"}
                    type={"starRating"}
                    required={false}
                  />
                  <FormField
                    label={"Comment"}
                    name={"comment"}
                    placeholder={"any comment for the driver"}
                    type={"text"}
                    required={false}
                  />
                  <SubmitButton
                    // formAction={updateUserWithId}
                    pendingText="Saving..."
                    className="w-full mt-4 font-black text-lg"
                  >
                    save
                  </SubmitButton>
                </>
              )
            ) : null}
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  if (myReview.length > 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer w-full">
            Review
            <Star strokeWidth={2} fill="#fff" />
          </Button>
        </DialogTrigger>
        <DialogContent className="h-fit ">
          <DialogHeader className="w-full px-6 border-b pb-2">
            <DialogTitle>Review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-start gap-1 mt-2">
            <Label
              className="flex flex-row gap-1 text-xl font-bold"
              htmlFor="rating"
            >
              Rating
            </Label>
            <div className="px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive items-center">
              <StarRating initialRating={myReview[0]?.rating} readOnly />
              {myReview[0]?.rating}
            </div>
          </div>
          <div className="flex flex-col items-start gap-1 mt-2">
            <Label
              className="flex flex-row gap-1 text-xl font-bold"
              htmlFor="rating"
            >
              Comment
            </Label>
            <Input value={myReview[0]?.comment || "No comment"} readOnly />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer w-full">
          Review
          <Star strokeWidth={2} fill="#fff" />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit ">
        <DialogHeader className="w-full px-6 border-b pb-2">
          <DialogTitle>Review</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form action={ReviewsTrip}>
          <input
            type="text"
            name="tripId"
            value={tripId}
            className="hidden"
            required={true}
            readOnly={true}
          />
          <input
            type="text"
            name="forId"
            value={driver_id}
            className="hidden"
            required={false}
            readOnly={true}
          />
          <FormField
            label={"Rating"}
            name={"rating"}
            placeholder={"rating"}
            type={"starRating"}
            required={false}
          />
          <FormField
            label={"Comment"}
            name={"comment"}
            placeholder={"any comment for the driver"}
            type={"text"}
            required={false}
          />

          <SubmitButton
            // formAction={updateUserWithId}
            pendingText="Saving..."
            className="w-full mt-4 font-black text-lg"
          >
            save
          </SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
