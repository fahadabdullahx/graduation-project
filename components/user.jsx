"use client";
import { LogOut, Power, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { SignOut } from "@/app/actions/user";
import { useEffect, useState } from "react";

import { GetImageUrl } from "@/lib/supabase/utils";
import Image from "next/image";

export function User({ user }) {
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const getImage = async () => {
      const image = await GetImageUrl(user.avatar_url);
      setAvatar(image);
    };
    if (user.avatar_url) {
      getImage();
    } else {
      setAvatar(null);
    }
  }, [user.avatar_url]);
  return (
    <Popover>
      <PopoverTrigger id="user" asChild>
        <button className="bg-white-300 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:drop-shadow-lg border-2 border-primary overflow-hidden">
          {user.avatar_url && avatar ? (
            <Image
              src={avatar}
              alt="user avatar"
              width={35}
              height={35}
              className="h-full w-full object-cover"
            />
          ) : (
            <User2 className="h-5 w-5" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-55 p-0" align="">
        <Card className="border-0 shadow-none p-0 gap-2">
          <CardHeader className="border-b px-4 pt-3 !p-0 flex flex-row items-center justify-between overflow-x-clip">
            <Link
              href="/account"
              className="w-full h-full p-2 flex flex-row justify-start items-center gap-2.5"
            >
              <div className="bg-white-300 min-w-10 min-h-10 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer border-2 border-primary overflow-hidden">
                {user.avatar_url && avatar ? (
                  <Image
                    src={avatar}
                    alt="user avatar"
                    width={35}
                    height={35}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User2 />
                )}
              </div>
              <div>
                <CardTitle>{user?.full_name}</CardTitle>
                <CardDescription className="text-xs -mt-0.5 pb-1">
                  {user?.email}
                </CardDescription>
              </div>
            </Link>
          </CardHeader>

          <CardContent className="flex flex-col gap-0.5 p-0 pt-0 w-full ">
            {/* <CardAction className="w-full "> */}
            <Link
              href="/account"
              className="w-full h-10 p-2 flex flex-row justify-start items-center gap-2.5 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
            >
              <User2 strokeWidth={2} />
              Account
            </Link>
            <Button
              variant="ghost"
              className="w-full h-10 p-2 flex flex-row justify-start items-center gap-2.5 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 border-t rounded-none "
              onClick={async () => {
                SignOut();
              }}
            >
              <LogOut strokeWidth={3} />
              Logout
            </Button>
            {/* </CardAction> */}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
