import { SearchIcon, X } from "lucide-react";
import React, { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchByNameLocation } from "@/utils/mapUtils";

export default function SearchLocation({
  setSearchResults,
  searchResults,
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  setStopPoints,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (query) => {
    setLoading(true);
    const res = await SearchByNameLocation(query);
    setResults(res);
    setLoading(false);
  };
  // only search when the user stops typing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!query) return;
      search(query);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);
  const handleSelect = (result) => {
    if (result) {
      let loc = { lat: result.lat, lng: result.lon };
      if (!startPoint) {
        setStartPoint(loc);
        setSearchResults(null);
      } else if (!endPoint) {
        setEndPoint(loc);
        setSearchResults(null);
      }
      if (startPoint && endPoint) {
        setStopPoints((prev) => [...prev, loc]);
        setSearchResults(null);
      }
    }
  };
  const searchInputRef = useRef(null);
  return (
    <div>
      <Button
        variant="outline"
        type="button"
        size="icon"
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => {
            // document.getElementById("searchLocation").focus();
            searchInputRef.current.focus
              ? searchInputRef.current.focus()
              : searchInputRef.current[0].focus();
          }, 0);
        }}
      >
        <SearchIcon />
      </Button>
      {isOpen && (
        <div className="w-full absolute top-0 left-0 z-10 bg-white shadow-lg flex flex-col justify-end ">
          <div className="flex justify-between">
            <Input
              type="text"
              id="searchLocation"
              ref={searchInputRef}
              className="w-full px-1.5 pr-9"
              placeholder="Search for a location"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <Button
              variant="ghost"
              type="button"
              size="icon"
              className="absolute right-0"
              aria-label="search"
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* <SearchIcon /> */}
              <X />
            </Button>
          </div>
          <div className="w-full">
            {loading && <p className="p-2">Loading...</p>}
            {results?.length > 0 ? (
              <ul>
                {results.map((result) => (
                  <li key={result.place_id}>
                    <p
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSearchResults(result);
                        handleSelect(result);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => {
                        setSearchResults(result);
                      }}
                      onMouseLeave={() => {
                        setSearchResults(null);
                      }}
                    >
                      {result.display_name}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-2">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
