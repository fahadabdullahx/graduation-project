"use client";
import { Flag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

import { Input } from "@/components/ui/input";

export default function report() {
  const FormField = ({ label, name, type, placeholder, required = true }) => {
    return (
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label className="flex flex-row gap-1 text-xl font-bold" htmlFor={name}>
          {label}
        </Label>
        <Input
          name={name}
          id={name}
          type={type}
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="cursor-pointer">
          <Flag strokeWidth={3} />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-fit ">
        <DialogHeader className="w-full px-6 border-b pb-2">
          <DialogTitle>Report</DialogTitle>
          <DialogDescription>
            <Select name="report">
              <SelectTrigger className="w-full " id="report">
                <SelectValue placeholder="Report" />
              </SelectTrigger>
              <SelectContent className="z-[99999999999999999999999999999999999999]">
                <SelectGroup>
                  <SelectLabel className="test-2xl font-bold bg-primary/10 text-primary rounded-sm flex items-center gap-1">
                    Report
                  </SelectLabel>
                  <SelectItem value="trip">Report Trip</SelectItem>
                  <SelectItem value="driver">Report Driver</SelectItem>
                  <SelectItem value="car">Report Car</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <form>
          <FormField
            label={"label"}
            name={"name name"}
            placeholder={"placeholder placeholder placeholder"}
            type={"text"}
            required={false}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
