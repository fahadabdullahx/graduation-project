import { Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotificationDropdown } from "@/components/notification-dropdown";
import Search from "@/components/trip/popoverSearch";
import { User } from "@/components/user";

import { GetMyProfile } from "@/app/actions/user";

export default async function Navbar() {
  const Links = [
    { title: "Admin", href: "/admin", for: ["admin"] },
    {
      title: "Find Rides",
      href: "/search",
      for: ["*", "passenger", "driver", "admin"],
    },
    { title: "Offer Rides", href: "/new-trip", for: ["driver"] },
    { title: "My Trips", href: "/my-trips", for: ["driver"] },
    {
      title: "My Booking",
      href: "/my-bookings",
      for: ["driver", "passenger", "admin"],
    },
    { title: "Become a Driver", href: "/become-a-driver", for: ["passenger"] },
  ];

  const user = await GetMyProfile({ noError: true });
  return (
    <header className="px-2.5 sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="m-auto container flex h-16 items-center justify-between">
        <div>
          <Link href="/">
            <img src="/logoTextB.svg" alt="logo" className="h-5 text-primary" />
          </Link>
        </div>
        <nav className="hidden lg:flex gap-6">
          {Links.map((link, i) => {
            if (
              link.for &&
              !link.for.includes("*") &&
              !link.for.includes(user?.usertype)
            )
              return null;
            return (
              <Link
                key={i}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2.5">
          <Search />

          {user ? (
            <>
              <NotificationDropdown />
              <User user={user} />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium transition-colors hover:text-primary hidden lg:block"
              >
                Sign In
              </Link>
              <Button
                variant="link"
                className="rounded-full bg-primary text-white hover:no-underline p-0"
              >
                <Link href="/sign-up" className="px-4 py-2">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-5">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <img
                    src="/logoTextB.svg"
                    alt="logo"
                    className="h-5 text-primary"
                  />
                </SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {Links.map((link, i) => {
                  if (
                    link.for &&
                    !link.for.includes("*") &&
                    !link.for.includes(user?.usertype)
                  )
                    return null;
                  return (
                    <Link
                      key={i}
                      href={link.href}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
