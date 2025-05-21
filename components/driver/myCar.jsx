import { GetMyCars } from "@/app/actions/driver";
import React from "react";
import AddCar from "./addCar";

export default async function MyCar() {
  const data = await GetMyCars();
  return (
    <div className="overflow-auto">
      <AddCar />
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              model
            </th>
            <th scope="col" className="px-6 py-3">
              year
            </th>
            <th scope="col" className="px-6 py-3">
              seat
            </th>

            <th scope="col" className="px-6 py-3">
              color
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((car, i) => (
            <tr
              key={i}
              className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
            >
              <th scope="row" className="px-2 py-2 font-medium text-gray-900">
                {car?.model}
              </th>
              <th scope="row" className="px-2 py-2 font-medium text-gray-900">
                {car?.year}
              </th>
              <th scope="row" className="px-2 py-2 font-medium text-gray-900">
                {car?.seat}
              </th>
              <th scope="row" className="px-2 py-2 font-medium text-gray-900">
                {car?.color}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
