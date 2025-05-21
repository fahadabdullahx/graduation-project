"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User2, X } from "lucide-react";
import { serachUser } from "@/app/actions/admin";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetImageUrl } from "@/lib/supabase/utils";
export default function SearchUserTable() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchUsers = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await serachUser(query);
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-3">
      <form onSubmit={(e) => fetchUsers(e)} className="w-full">
        <div className="flex justify-between relative">
          <Input
            type="text"
            className="w-full ps-9.5 text-sm "
            placeholder="Search for by name, email, phone number"
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button
            variant=""
            type="button"
            size="icon"
            className="absolute left-0"
            aria-label="search"
            disabled={loading}
          >
            {loading ? (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                <div className="h-4 w-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <Search />
            )}
          </Button>
        </div>
      </form>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-fit">
        <table className="w-full text-sm text-center text-gray-500">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Gender
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Type
              </th> */}
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users?.map((user, i) => (
                <tr
                  className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center"
                  key={i}
                >
                  <th
                    scope="row"
                    className="px-2 py-2 font-medium text-gray-900"
                  >
                    <span>{user.full_name}</span>
                  </th>
                  <td className="px-2 py-2 font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-2 py-2 font-medium text-gray-900">
                    {user.phone_number}
                  </td>
                  <td className="px-2 py-2 font-medium text-gray-900">
                    {user.gender}
                  </td>
                  <td className="px-2 py-2 font-medium text-gray-900">
                    <MoreData data={user} />
                    {/* <Button variant="link" className="cursor-pointer">
                      View User
                    </Button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="odd:bg-white even:bg-gray-50 border-b  border-gray-200 text-center">
                <th
                  colSpan="100"
                  className="px-2 py-2 font-bold text-2xl text-gray-900"
                >
                  {users?.error && <span>{users.error}</span>}
                  {/* <span>NO USER FOUND !!!</span> */}
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MoreData({ data }) {
  // const image = await GetImageUrl(data.avatar_url);
  const [avatar, setAvatar] = useState(null);
  const getImage = async () => {
    const image = await GetImageUrl(data.avatar_url);
    setAvatar(image);
  };
  getImage();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="cursor-pointer">
          View User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <div className="bg-white-300 w-10 h-10 rounded-full flex items-center justify-center hover:drop-shadow-lg border-2 border-primary overflow-hidden">
              {avatar && data.avatar_url ? (
                // <img src={data.avatar_url} className="h-full w-full" />
                <img src={avatar} className="h-full w-full" />
              ) : (
                <User2 className="h-5 w-5" />
              )}
            </div>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div>
            <span className="font-bold">Full Name:</span> {data.full_name}
          </div>
          <div>
            <span className="font-bold">Email:</span> {data.email}
          </div>
          <div>
            <span className="font-bold">Rating:</span> {data.rating}
          </div>
          <div>
            <span className="font-bold">Phone:</span> {data.phone_number}
          </div>
          <div>
            <span className="font-bold">Gender:</span> {data.gender}
          </div>
          <div>
            <span className="font-bold">created_at:</span>
            {new Date(data.created_at).toLocaleString()}
          </div>
          <div>
            <span className="font-bold">Last Sign Id:</span>
            {new Date(data.moredata.last_sign_in_at).toLocaleString()}
          </div>
        </div>
        <DialogClose asChild>
          <Button variant="secondary">
            <X className="h-4 w-4" /> Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
