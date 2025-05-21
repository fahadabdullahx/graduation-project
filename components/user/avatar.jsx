"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, User2 } from "lucide-react";

export default function Avatar({ uid, avatar_url, noUpload }) {
  const supabase = createClient();
  const [avatarUrl, setAvatarUrl] = useState();
  const [uploading, setUploading] = useState(false);
  //   onUpload
  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }
  useEffect(() => {
    if (avatar_url) downloadImage(avatar_url);
  }, [avatar_url, supabase]);

  const uploadAvatar = async (event) => {
    let newUrl;
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uid}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);
      if (uploadError) {
        throw uploadError;
      }

      //   onUpload(filePath);

      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", uid)
        .select();
      newUrl = data[0]?.avatar_url;
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      downloadImage(newUrl);
      setUploading(false);
      window?.location?.reload();
    }
  };
  if (noUpload)
    return avatarUrl ? (
      <img
        src={avatarUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    ) : (
      <User2 className="w-full h-full border-2" />
    );
  return (
    <div className="relative w-full aspect-square rounded-lg bg-secondary overflow-hidden">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className=" w-full h-full flex items-center justify-center p-2.5 border-2 border-primary rounded-full ">
          <User2 className="w-full h-full" />
        </div>
      )}
      {uploading ? (
        <div className="absolute w-full h-full inset-0 flex flex-col items-center justify-center cursor-pointer bg-black text-white">
          <Upload
            size={50}
            strokeWidth={3}
            color="#ffffff"
            className="animate-pulse"
          />
          <span>Uploading...</span>
        </div>
      ) : (
        <div className="absolute inset-0">
          <label
            className="w-full h-full inset-0 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 hover:bg-black/50"
            htmlFor="single"
          >
            {uploading ? (
              "Uploading ..."
            ) : (
              <Upload size={50} strokeWidth={3} color="#ffffff" />
            )}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
