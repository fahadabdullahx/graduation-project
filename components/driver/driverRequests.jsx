"use client";
import {
  GetRequests,
  SendNotification,
  updateUserType,
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

export default function DriverRequests() {
  const [data, setData] = useState([]);
  const getData = async () => {
    const datas = await GetRequests("driver");
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
    const [driverLicense, setDriverLicense] = useState();
    const [driverPhoto, setDriverPhoto] = useState();
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
        console.log("Error downloading image: ", error);
      }
    }

    useEffect(() => {
      if (request.data.filesPaths.driverLicense)
        downloadImage(request.data.filesPaths.driverLicense, setDriverLicense);
      if (request.data.filesPaths.driverPhoto)
        downloadImage(request.data.filesPaths.driverPhoto, setDriverPhoto);
      if (request.data.filesPaths.vehicleRegistration)
        downloadImage(
          request.data.filesPaths.vehicleRegistration,
          setVehicleRegistration
        );
    }, [request.data.filesPaths, supabase]);
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
        <DialogContent className="p-2 gap-1 w-full max-w-[1500px]">
          <div className="max-h-[calc(100vh-100px)] overflow-auto">
            <DialogHeader className="w-full px-1 border-b pb-2 sticky top-0 bg-white z-10 pe-2">
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
              <div className="px-2">
                <h2 className="text-2xl font-bold">User</h2>
                <div>
                  <h2 className="text-2xl font-medium">Full Name</h2>
                  <span>{request.profiles.full_name}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Gender</h2>
                  <span>{request.profiles.gender}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Phone Number</h2>
                  <span>{request.profiles.phone_number}</span>
                </div>
              </div>
              <div className="px-2">
                <h2 className="text-2xl font-bold">Car</h2>
                <div>
                  <h2 className="text-2xl font-medium">Vehicle Color</h2>
                  <span>{request.data.vehicleColor}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Vehicle Model</h2>
                  <span>{request.data.vehicleModel}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Vehicle Year</h2>
                  <span>{request.data.vehicleYear}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Vehicle Seat</h2>
                  <span>{request.data.vehicleSeat}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Driver License</h2>
                  <img src={driverLicense} alt="driverLicense" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium">Driver Photo</h2>
                  <img src={driverPhoto} alt="driverPhoto" />
                </div>

                <div>
                  <h2 className="text-2xl font-medium">Vehicle Registration</h2>
                  <img src={vehicleRegistration} alt="vehicleRegistration" />
                </div>
              </div>
            </div>
            <DialogFooter className="flex flex-row items-center justify-between gap-2 px-2">
              <Button
                disabled={request.status !== "pending"}
                className="w-full"
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("requests")
                    .update({ status: "accepted" })
                    .eq("id", request.id)
                    .select();
                  if (error) {
                    console.log("error", error);
                  }
                  SendNotification({
                    type: "request",
                    title: "Car request accepted",
                    body: "Your request to become a driver has been accepted.",
                    user_id: request.user_id,
                    url: `/account?s=my-requests`,
                  });
                  if (data) {
                    const { data, error } = await supabase.from("cars").insert({
                      color: request.data.vehicleColor,
                      model: request.data.vehicleModel,
                      year: request.data.vehicleYear,
                      owner: request.user_id,
                      seat: request.data.vehicleSeat,
                    });
                    let type = "driver";
                    let id = request.user_id;
                    await updateUserType(id, type);
                    const { data: profileData, error: profileError } =
                      await supabase
                        .from("profiles")
                        .update({
                          avatar_url: request.data.filesPaths.driverPhoto,
                        })
                        .eq("id", request.user_id)
                        .select();

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
              >
                {request.status === "pending" ? "Accept" : "Accepted"}
              </Button>

              <Button
                disabled={request.status !== "pending"}
                onClick={async () => {
                  const { data, error } = await supabase
                    .from("requests")
                    .update({ status: "Rejected" })
                    .eq("id", request.id)
                    .select();
                  SendNotification({
                    type: "request",
                    title: "Car request rejected",
                    body: "Your request to become a driver has been rejected.",
                    user_id: request.user_id,
                    url: `/account?s=my-requests`,
                  });
                  if (error) {
                    console.log("error", error);
                  }
                  if (data) {
                    setData((prev) =>
                      prev.map((item) => {
                        if (item.id === request.id) {
                          return { ...item, status: "Rejected" };
                        }
                        return item;
                      })
                    );
                  }
                }}
                variant={"destructive"}
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
