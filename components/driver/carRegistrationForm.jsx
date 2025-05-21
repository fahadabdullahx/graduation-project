"use client";
import { getUserByEmail } from "@/app/actions/user";

import { CarRegistrationFormAction } from "@/app/actions/driver";
import { SubmitButton } from "@/components/submitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useActionState, useEffect, useRef, useState } from "react";

export default function CarRegistrationForm({ user = null }) {
  const [state, formAction] = useActionState(CarRegistrationFormAction, {});
  const colorList = [
    { name: "White", hex: "White" },
    { name: "Black", hex: "Black" },
    { name: "Gray", hex: "Gray" },
    { name: "Silver", hex: "Silver" },
    { name: "Blue", hex: "Blue" },
    { name: "Red", hex: "Red" },
    { name: "Brown", hex: "Brown" },
    { name: "Green", hex: "Green" },
    { name: "Orange", hex: "Orange" },
    { name: "Beige", hex: "Beige" },
    { name: "Purple", hex: "Purple" },
    { name: "Gold", hex: "Gold" },
    { name: "Yellow", hex: "Yellow" },
  ];
  const SearchInput = ({ name }) => {
    if (user?.email)
      return (
        <>
          <Input
            id={name}
            type="email"
            name="userEmail"
            value={user.email}
            readOnly
            className="cursor-not-allowed "
          />
          <input
            type="text"
            aria-hidden="true"
            className="hidden"
            name="userId"
            value={user.id}
            readOnly
            hidden
            // required
          />
        </>
      );
    const [email, setEmail] = useState(user?.email || "");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userId, setUserId] = useState(user?.id || "");
    const search = async (email) => {
      setLoading(true);
      const res = await getUserByEmail(email);
      setResults(res);
      setLoading(false);
    };

    // only search when the user stops typing and the email is valid
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (!email) return;
        if (!/\S+@\S+\.\S+/.test(email)) return;
        if (!userId && email === user?.email) return;
        setShowSuggestions(true);
        search(email);
      }, 1000);
      return () => clearTimeout(timeout);
    }, [email]);
    const searchRef = useRef(null);

    return (
      <div className="relative w-full" ref={searchRef}>
        <div className="relative w-full">
          {user?.email === email ? (
            "sadasd"
          ) : (
            <Input
              id={name}
              type="email"
              name={name}
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() =>
                setTimeout(() => {
                  setShowSuggestions(false);
                }, 300)
              }
              // readOnly={user?.email === email}
              // disabled={user?.email === email}
              // aria-hidden={user?.email === email}
              // required
            />
          )}
          <input
            type="text"
            aria-hidden="true"
            className="hidden"
            name="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            readOnly
            hidden
            // required
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        {showSuggestions && results && email.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
            <div
              className="flex items-center justify-between p-2 hover:bg-primary/10 cursor-pointer"
              onClick={() => {
                setEmail(results.email);
                setUserId(results.id);
                setShowSuggestions(false);
              }}
            >
              <span className="font-medium">{results.full_name}</span>
              <span>{results.gender}</span>
            </div>
          </div>
        )}
        {showSuggestions &&
          results?.length === 0 &&
          email?.length > 0 &&
          !loading && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              <div className="flex items-center justify-between p-2 hover:bg-primary/10 cursor-pointer">
                <span className="font-medium">No user found</span>
              </div>
            </div>
          )}
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Car Registration</CardTitle>
          <CardDescription>
            Fill in the form to register a new car for the driver.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="userEmail">User Email</Label>
                <SearchInput name="userEmail" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  // required
                  id="vehicleModel"
                  type="text"
                  name="vehicleModel"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicleSeat">Vehicle Seat</Label>
                <Input
                  // required
                  id="vehicleSeat"
                  type="number"
                  name="vehicleSeat"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicleYear">Vehicle Year</Label>
                <Select
                  name="vehicleYear"
                  // required
                >
                  <SelectTrigger className="w-full " id="vehicleYear">
                    <SelectValue
                      placeholder="Select the Vehicle Year"
                      id="vehicleYear"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[9999999999999]">
                    <SelectGroup>
                      <SelectLabel>Year</SelectLabel>
                      {Array.from({
                        length:
                          new Date().getFullYear() -
                          (new Date().getFullYear() - 10),
                      }).map((_, i) => (
                        <SelectItem
                          value={`${new Date().getFullYear() - i}`}
                          key={i}
                        >
                          {new Date().getFullYear() - i}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicleColor">Vehicle Color</Label>
                <Select
                  name="vehicleColor"
                  // required
                >
                  <SelectTrigger className="w-full " id="vehicleColor">
                    <SelectValue
                      placeholder="Select the Vehicle Year"
                      id="vehicleColor"
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[9999999999999]">
                    <SelectGroup>
                      <SelectLabel>Year</SelectLabel>
                      {colorList.map((color, i) => (
                        <SelectItem value={color.name} key={i}>
                          <div
                            style={{
                              background: color.hex,
                              width: "20px",
                              height: "20px",
                              border: "1px solid black",
                            }}
                          ></div>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* vehicle registration */}
              <div className="grid gap-2">
                <Label htmlFor="vehicleRegistration">
                  Vehicle Registration
                </Label>
                <Input
                  // required
                  id="vehicleRegistration"
                  type="file"
                  name="vehicleRegistration"
                  accept="image/jpeg,image/jpg"
                />
              </div>

              <div className="col-span-full">
                <SubmitButton pendingText="Registering..." className="w-full">
                  Register Car
                </SubmitButton>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
