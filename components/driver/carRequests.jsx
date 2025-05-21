"use client";
import {
  acceptedCar,
  acceptedCarRequest,
  GetRequests,
  rejectedCarRequest,
} from "@/app/actions/admin";
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
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";

export default function CarRequests() {
  const [data, setData] = useState([]);
  const getData = async () => {
    const datas = await GetRequests("car");
    setData(datas);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <table className="w-full text-sm text-center text-gray-500">
      <thead className="text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            User Email
          </th>
          <th scope="col" className="px-6 py-3">
            Full Name
          </th>
          <th scope="col" className="px-6 py-3">
            Requests Status
          </th>

          <th scope="col" className="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map((request, i) => (
          <tr
            key={i}
            className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
          >
            <th scope="row" className="px-2 py-2 font-medium text-gray-900">
              <span>{request.data.userEmail}</span>
            </th>
            <th scope="row" className="px-2 py-2 font-medium text-gray-900">
              {request.profiles.full_name}
            </th>
            <th scope="row" className="px-2 py-2 font-medium text-gray-900">
              {request.status === "pending" ? (
                <span className="text-yellow-500 font-semibold">Pending</span>
              ) : request.status === "accepted" ? (
                <span className="text-green-500 font-semibold">Accepted</span>
              ) : request.status === "rejected" ? (
                <span className="text-red-500 font-semibold">Rejected</span>
              ) : (
                <span className="text-gray-500 font-semibold">Unknown</span>
              )}
            </th>
            <th scope="row" className="px-2 py-2 font-medium text-gray-900">
              <Action request={request} setData={setData} />
            </th>
          </tr>
        ))}
      </tbody>
    </table>
  );

  function Action({ request, setData }) {
    const [vehicleRegistration, setVehicleRegistration] = useState();
    const supabase = createClient();

    async function downloadImage(path, set) {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);
        if (error) {
          throw error;
        }
        const url = URL.createObjectURL(data);
        set(url);
      } catch (error) {
        console.error("Error downloading image: ", error);
      }
    }
    useEffect(() => {
      if (request.data.vehicleRegistration)
        downloadImage(request.data.vehicleRegistration, setVehicleRegistration);
    }, [request.data.vehicleRegistration, supabase]);
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer bg-transparent w-10 h-10"
          >
            <EllipsisVertical className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-2 gap-1 w-full max-h-dvh overflow-auto  max-w-[1500px]">
          <div className="max-h-[calc(100vh-100px)] overflow-auto">
            <DialogHeader className="w-full px-1 border-b pb-2 bg-white z-10 pe-2">
              <div className="flex flex-col items-start gap-2">
                <DialogTitle>Request</DialogTitle>
                <DialogDescription className="flex flex-row items-center justify-between gap-2 w-full">
                  {/* <div className="flex flex-row items-center justify-between gap-2"> */}
                  <span>{request.registration_type}</span>
                  <span>{request.status}</span>
                  {/* </div> */}
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="flex flex-col items-start gap-5 mt-2">
              <div className="px-2 w-full">
                {/* <h2 className="text-2xl font-bold">User</h2> */}
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Full Name</h2>
                  <span>{request.profiles.full_name}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Gender</h2>
                  <span>{request.profiles.gender}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Phone Number</h2>
                  <span>{request.profiles.phone_number}</span>
                </div>
              </div>
              <div className="px-2 w-full">
                <h2 className="text-2xl font-bold">Car</h2>

                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Vehicle Seat</h2>
                  <span>{request.data.vehicleSeat}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Vehicle Color</h2>
                  <span>{request.data.vehicleColor}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Vehicle Model</h2>
                  <span>{request.data.vehicleModel}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Vehicle Year</h2>
                  <span>{request.data.vehicleYear}</span>
                </div>
                <div className="w-full border-b">
                  <h2 className="text-2xl font-medium">Vehicle Registration</h2>
                  <img src={vehicleRegistration} alt="vehicleRegistration" />
                </div>
              </div>
            </div>
            <DialogFooter className="flex !flex-col items-center justify-between gap-2 px-2 py-5 mt-5">
              <form
                disabled={request.status !== "pending"}
                action={async (FormData) => {
                  const carType = FormData.get("carType");
                  const id = request.id;
                  const data = await acceptedCarRequest({ id, carType });
                  if (data) {
                    setData((prev) =>
                      prev.map((item) => {
                        if (item.id === request.id) {
                          return { ...item, status: "accepted" };
                        }
                        return item;
                      })
                    );
                  }
                }}
                className="flex flex-col items-start gap-2 w-full"
              >
                <Label htmlFor="carType" className="text-2xl font-medium">
                  Car Type
                </Label>
                <p className="text-sm text-gray-500">
                  Select the car type you want to accept for this request.
                </p>
                <Select name="carType" required id="carType">
                  <SelectTrigger className="w-full" id="carType">
                    <SelectValue placeholder="Select car type" id="carType" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"luxury"}>Luxury</SelectItem>
                    <SelectItem value={"standard"}>Standard</SelectItem>
                    <SelectItem value={"economy"}>Economy</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full" type="submit">
                  {request.status === "pending" ? "Accept" : "Accepted"}
                </Button>
              </form>
              <Button
                disabled={request.status !== "pending"}
                onClick={async () => {
                  const data = await rejectedCarRequest(request.id);

                  if (data) {
                    setData((prev) =>
                      prev.map((item) => {
                        if (item.id === request.id) {
                          return { ...item, status: "rejected" };
                        }
                        return item;
                      })
                    );
                  }
                }}
                variant={"destructive"}
                className="w-full mt-2.5"
              >
                Reject
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
