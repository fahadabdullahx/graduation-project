"use client";
import { GetMyReviews } from "@/app/actions/user";
import { React, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/starRating";
import Loading from "@/app/loading";

export default function MyReviews({ myRating }) {
  const [section, setSection] = useState("for_me");
  const [Reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getMyReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GetMyReviews({
        type: section,
      });
      // console.log("data", data);
      if (data.error) {
        setError(data.error);
        return;
      }
      setReviews(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyReviews();
  }, [section]);
  return (
    <div>
      <div className="w-full border-b-2 mb-2 px-2.5 pb-1.5 flex gap-2 justify-start items-center">
        <Button
          onClick={() => setSection("for_me")}
          variant={section === "for_me" ? "default" : "outline"}
        >
          Reviews For Me
        </Button>
        <Button
          onClick={() => setSection("by_me")}
          variant={section === "by_me" ? "default" : "outline"}
        >
          My Reviews
        </Button>
      </div>
      <section className="overflow-auto">
        {loading && <Loading />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="w-full text-sm text-center text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  rating
                </th>
                <th scope="col" className="px-6 py-3">
                  comment
                </th>
                <th scope="col" className="px-6 py-3">
                  data
                </th>
              </tr>
            </thead>
            <tbody>
              {Reviews.map((review) => (
                <tr
                  key={review.id}
                  className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
                >
                  <th
                    scope="row"
                    className="px-2 py-2 font-medium text-gray-900"
                  >
                    {review.rating > 0 ? (
                      // if less thin 2 red less if 3 orange less if 4 of 5 green

                      <span className="text-lg font-bold flex justify-center items-center gap-1">
                        {/* {review.rating} */}
                        <StarRating
                          initialRating={review.rating || 0}
                          readOnly
                        />
                        {review.rating}/5
                      </span>
                    ) : (
                      <span className="text-red-500 text-lg font-bold">
                        No Rating
                      </span>
                    )}
                  </th>
                  <th
                    scope="row"
                    className="px-2 py-2 font-medium text-gray-900 "
                  >
                    {review.comment}
                  </th>
                  <th
                    scope="row"
                    className="px-2 py-2 font-medium text-gray-900"
                  >
                    {new Date(review.created_at).toLocaleDateString({
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
