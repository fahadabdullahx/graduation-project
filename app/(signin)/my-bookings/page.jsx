import { ArrowRight } from "lucide-react";
import { GetMyBooking } from "@/app/actions/trips";
import UsePagination from "@/components/usePagination";
import Link from "next/link";
export const metadata = {
  title: "My booking",
};
export default async function myBooking({ searchParams }) {
  const { page } = await searchParams;
  const MyBooking = await GetMyBooking({
    page,
  });
  return (
    <div className="container mx-auto p-4 flex justify-center ">
      <div className="w-full">
        <h2 className="uppercase text-xl font-bold mb-2">My Bookings</h2>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit">
          <table className="w-full text-sm text-center text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  locations
                </th>
                <th scope="col" className="px-6 py-3">
                  price
                </th>
                <th scope="col" className="px-6 py-3">
                  seat
                </th>
                <th scope="col" className="px-6 py-3">
                  departure date
                </th>
                <th scope="col" className="px-6 py-3">
                  status
                </th>
                <th scope="col" className="px-6 py-3">
                  link
                </th>
              </tr>
            </thead>
            <tbody>
              {MyBooking?.bookings?.map((booking, i) => (
                <tr
                  className={`odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center hover:bg-gray-100 transition-all duration-300 ease-in-out`}
                  key={i}
                >
                  <td scope="row" className="px-2 py-2">
                    <div className=" font-medium text-gray-900 whitespace-nowrapw-full flex flex-col items-start justify-center gap-2">
                      <span className="flex items-center justify-center gap-1 ">
                        <img
                          src="/StartIcone.svg"
                          alt="profile"
                          className="w-3 h-3"
                          loading="lazy"
                        />

                        {booking.trip.start_location}
                      </span>
                      <span className="flex items-center justify-center gap-1.5">
                        <img
                          src="/EndIcone.svg"
                          alt="profile"
                          className="w-3 h-3"
                          loading="lazy"
                        />
                        {booking.trip.end_location}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    {booking.trip.price === 0 ? "Free" : booking.trip.price}
                  </td>
                  <td className="px-2 py-2">{booking.seat || "~"}</td>
                  <td className="px-2 py-2">
                    {new Date(booking.trip.departure_time).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-2 py-2">
                    {booking.status === "pending" ? (
                      <span className="text-yellow-500 font-bold">
                        {booking.status}
                      </span>
                    ) : booking.status === "confirmed" ? (
                      <span className="text-green-500 font-bold">
                        {booking.status}
                      </span>
                    ) : (
                      <span className="text-red-500 font-bold">
                        {booking.status}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <Link
                      href={`/trip/${booking.trip.id.replaceAll("-", "")}`}
                      className="flex items-center justify-center gap-1 text-blue-500 hover:text-blue-700"
                    >
                      <span>Details</span>
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <UsePagination
            totalPages={MyBooking.totalPages}
            initialPage={1}
            siblingsCount={1}
          />
        </div>
      </div>
    </div>
  );
}
