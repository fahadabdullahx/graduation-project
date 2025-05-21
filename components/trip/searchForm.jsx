"use client";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Search as SearchIcon, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchByNameLocation } from "@/utils/mapUtils";

const SearchInput = ({ name }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [address, setAddress] = useState(null);
  const searchRef = useRef(null);

  const search = async (query) => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await SearchByNameLocation(query);
      setResults(res || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // only search when the user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query) {
        setAddress(null);
        setResults([]);
        return;
      }
      search(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  // Clear address if query changes after selection
  useEffect(() => {
    if (address && query !== address.display_name) {
      setAddress(null);
    }
  }, [query, address]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative w-full">
        <Input
          id={name}
          type="text"
          name={name}
          placeholder="Enter your location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          required
        />
        <input
          type="hidden"
          name={`${name}_address`}
          value={
            address
              ? JSON.stringify({
                  lat: address.lat,
                  lon: address.lon,
                })
              : ""
          }
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showSuggestions && results.length > 0 && query.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-2">
            {results.map((result) => (
              <li
                key={result.place_id}
                className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                id="suggestion-item"
                onClick={() => {
                  setQuery(result.display_name);
                  setAddress(result);
                  setShowSuggestions(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{result.display_name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function SearchForm({ className }) {
  const formRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    const fromAddressInput = document.querySelector(
      'input[name="from_address"]'
    );
    const toAddressInput = document.querySelector('input[name="to_address"]');

    if (!fromAddressInput || !toAddressInput) {
      e.preventDefault();
      return;
    }

    const fromAddress = fromAddressInput.value;
    const toAddress = toAddressInput.value;
    const errorElement = document.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }

    if (!fromAddress || fromAddress === "null" || fromAddress === "") {
      e.preventDefault();
      // Focus the empty field
      document.getElementById("from")?.focus();
    } else if (!toAddress || toAddress === "null" || toAddress === "") {
      e.preventDefault();

      document.getElementById("to")?.focus();
    }

    // date
    const dateInput = document.querySelector('input[name="date"]');
    if (dateInput && !dateInput.value) {
      e.preventDefault();

      dateInput.focus();
    }

    // gender
    const genderInput = document.querySelector('select[name="gender"]');
    if (genderInput && !genderInput.value) {
      e.preventDefault();

      genderInput.focus();
    }
  };

  // loding
  if (!mounted) {
    return (
      <form className={className}>
        <div className="flex flex-col items-start gap-1 mt-2">
          <Label className="flex flex-row gap-1 text-xl font-bold">
            <MapPin size={30} strokeWidth={2} />
            From
          </Label>
          <div className="w-full h-10 bg-gray-100 rounded"></div>
        </div>
        <div className="flex flex-col items-start gap-1 mt-2">
          <Label className="flex flex-row gap-1 text-xl font-bold">
            <MapPin size={30} strokeWidth={2} />
            To
          </Label>
          <div className="w-full h-10 bg-gray-100 rounded"></div>
        </div>
        <div className="flex flex-col items-start gap-1 mt-2">
          <Label className="flex flex-row gap-1 text-xl font-bold">
            <CalendarDays size={30} strokeWidth={2} />
            Date
          </Label>
          <div className="w-full h-10 bg-gray-100 rounded"></div>
        </div>
        <div className="flex flex-col items-start gap-1 mt-2">
          <Label className="flex flex-row gap-1 text-xl font-bold">
            <User size={30} strokeWidth={2} />
            Driver Gender
          </Label>
          <div className="w-full h-10 bg-gray-100 rounded"></div>
        </div>
        <div className="w-full col-span-full h-10 bg-primary rounded mt-4"></div>
      </form>
    );
  }

  return (
    <form
      ref={formRef}
      action="/search"
      method="GET"
      className={className}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label className="flex flex-row gap-1 text-xl font-bold" htmlFor="from">
          <MapPin size={30} strokeWidth={2} />
          From
        </Label>
        <SearchInput name="from" />
      </div>
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label className="flex flex-row gap-1 text-xl font-bold" htmlFor="to">
          <MapPin size={30} strokeWidth={2} />
          To
        </Label>
        <SearchInput name="to" />
      </div>
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label className="flex flex-row gap-1 text-xl font-bold" htmlFor="date">
          <CalendarDays size={30} strokeWidth={2} />
          Date
        </Label>
        <Input
          name="date"
          type="date"
          id="date"
          min={new Date().toISOString().split("T")[0]}
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <div className="flex flex-col items-start gap-1 mt-2">
        <Label
          className="flex flex-row gap-1 text-xl font-bold"
          htmlFor="gender"
        >
          <User size={30} strokeWidth={2} />
          Driver Gender
        </Label>
        <Select name="gender" required defaultValue="all">
          <SelectTrigger className="w-full" id="gender">
            <SelectValue placeholder="Select the driver gender" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectGroup>
              <SelectLabel>Genders</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        variant="default"
        className="w-full col-span-full cursor-pointer h-10 mt-4"
      >
        SEARCH
      </Button>
    </form>
  );
}
