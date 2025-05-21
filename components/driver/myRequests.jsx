import { GetMyRequests } from "@/app/actions/user";
import React from "react";

export default async function MyRequests() {
  const myRequests = await GetMyRequests();
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit">
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              requests Type
            </th>
            <th scope="col" className="px-6 py-3">
              status
            </th>
            <th scope="col" className="px-6 py-3">
              date
            </th>
          </tr>
        </thead>
        <tbody>
          {myRequests.map((request, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
            >
              <td className="px-2 py-2">{request.request_type}</td>
              <td className="px-2 py-2">
                {request.status === "pending" ? (
                  <span className="text-yellow-500 font-semibold">Pending</span>
                ) : request.status === "accepted" ? (
                  <span className="text-green-500 font-semibold">Accepted</span>
                ) : request.status === "rejected" ? (
                  <span className="text-red-500 font-semibold">Rejected</span>
                ) : (
                  <span className="text-gray-500 font-semibold">Unknown</span>
                )}
              </td>
              <td className="px-2 py-2">
                {new Date(request.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
