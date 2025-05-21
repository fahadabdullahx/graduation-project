"use client";
import StarRating from "@/components/starRating";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/submitButton";
import { Label } from "@/components/ui/label";
import { UpdateMyProfile } from "@/app/actions/user";
import { useActionState, useState } from "react";

export default function ProfileForm({ myProfile }) {
  const [change, setChange] = useState(false);
  const [state, formAction] = useActionState(UpdateMyProfile, {});

  return (
    <form className="flex flex-col gap-2.5" action={formAction}>
      <div>
        <Label htmlFor="full_name" className="text-1xl font-bold">
          Full Name
        </Label>
        <Input
          type="text"
          name="full_name"
          id="full_name"
          required
          defaultValue={myProfile.full_name}
          onChange={() => setChange(true)}
        />
        {state?.errors?.full_name && (
          <p className="text-sm text-red-500">{state?.errors?.full_name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="text-1xl font-bold">
          Email
        </Label>
        <Input
          type="email"
          name="email"
          id="email"
          required
          defaultValue={myProfile?.email}
          onChange={() => setChange(true)}
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-500">{state?.errors?.email}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phone_number" className="text-1xl font-bold">
          Phone Number
        </Label>
        <Input
          type="Number"
          name="phone_number"
          id="phone_number"
          required
          defaultValue={myProfile?.phone_number}
          onChange={() => setChange(true)}
        />
        {state?.errors?.phone_number && (
          <p className="text-sm text-red-500">{state?.errors?.phone_number}</p>
        )}
      </div>
      <div>
        <Label htmlFor="gender" className="text-1xl font-bold">
          Gender
        </Label>
        <Select
          name="gender"
          id="gender"
          defaultValue={myProfile?.gender}
          onValueChange={(value) => {
            setChange(true);
          }}
          required
        >
          <SelectTrigger className="w-full " id="gender">
            <SelectValue placeholder="Select the driver gender" id="gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Genders</SelectLabel>
              <SelectItem value="male">male</SelectItem>
              <SelectItem value="female">female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {state?.errors?.gender && (
          <p className="text-sm text-red-500">{state?.errors?.gender}</p>
        )}
      </div>

      <div>
        <Label htmlFor="rating" className="text-1xl font-bold" asChild>
          <span>Rating</span>
        </Label>
        <div className="flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-2xl font-bold gap-1">
          <StarRating
            id="rating"
            name="rating"
            initialRating={Math.round(myProfile?.rating) || 0}
            readOnly
          />
          <span className="ms-px text-xs">
            {Math.round(myProfile?.rating * 2) / 2 || 0}/5
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="Member_since" className="text-1xl font-bold ">
          Member since
        </Label>
        <Input
          type="text"
          id="Member_since"
          defaultValue={new Date(myProfile?.created_at).toLocaleDateString(
            "en-US",
            {
              month: "long",
              year: "numeric",
            }
          )}
          // disabled
          readOnly
        />
      </div>
      <div>
        <Label htmlFor="userType" className="text-1xl font-bold ">
          User Type
        </Label>
        <Input
          type="text"
          id="userType"
          className="text-1xl font-bold uppercase"
          value={myProfile.usertype}
          // disabled
          readOnly
        />
      </div>
      {change && (
        <SubmitButton
          pendingText="Saving..."
          className="w-full cursor-pointer"
          onClick={(e) => {
            setChange(false);
          }}
        >
          Save
        </SubmitButton>
      )}
    </form>
  );
}
