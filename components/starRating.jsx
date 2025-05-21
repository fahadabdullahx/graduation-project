"use client";

import { useState } from "react";
import { Star, StarIcon } from "lucide-react";

export default function StarRating({
  totalStars = 5,
  initialRating = 0,
  onChange,
  readOnly = false,
}) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (index) => {
    if (!readOnly) {
      setRating(index);
      onChange?.(index);
    }
  };

  const handleMouseMove = (event, index) => {
    if (!readOnly) {
      const star = event.currentTarget;
      const rect = star.getBoundingClientRect();
      const starWidth = rect.width;
      const mouseX = event.clientX - rect.left;
      const isHalfStar = mouseX < starWidth / 2;
      setHover(index + (isHalfStar ? 0.5 : 1));
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHover(0);
    }
  };

  return (
    <div className="flex ">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isHalfStar = (hover || rating) - index === 0.5;
        return (
          <div
            key={index}
            className={`relative  ${
              readOnly ? "cursor-default" : "cursor-pointer"
            } `}
            onClick={() => handleClick(starValue)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
          >
            <StarIcon
              size={15}
              strokeWidth={0}
              className={` ${readOnly ? "cursor-default" : ""}`}
              fill={starValue <= (hover || rating) ? "#facc15" : "#d1d5db"}
            />
            <div
              className={`absolute top-0 left-0 w-1/2 h-full overflow-hidden ${
                isHalfStar ? "visible" : "invisible"
              }`}
            >
              <StarIcon size={15} strokeWidth={0} fill="#facc15" />

              {/* <StarIcon size={15} strokeWidth={0} fill="#facc15" /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
