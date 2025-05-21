"use client";
import { Button } from "@/components/ui/button";

import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SearchForm from "@/components/trip/searchForm";
export default function PopoverSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative cursor-pointer bg-transparent rounded-full w-10 h-10 hover:drop-shadow-lg"
        >
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-2 gap-1 w-[500px]">
        <DialogHeader className="w-full px-6 border-b pb-2">
          <div className="flex flex-row items-start gap-2">
            <div>
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>Search for rides</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <SearchForm />
      </DialogContent>
    </Dialog>
  );
}
