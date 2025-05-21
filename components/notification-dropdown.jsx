"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NotificationItem } from "@/components/notification-item";
import { createClient } from "@/lib/supabase/client";
import useDebounce from "./useDebounce";

export function NotificationDropdown() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const debouncedOpen = useDebounce(open, 500);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    // Optionally, you can also update the notification in the database here

    const { data, error } = supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
  };

  useEffect(() => {
    const subscribe = async () => {
      const supabase = createClient();
      const userResponse = await supabase.auth.getUser();
      if (!userResponse || !userResponse.data) {
        console.error("User data is undefined or null");
        return;
      }
      const { user } = userResponse.data;
      if (!user) {
        console.error("No user found");
        return;
      }

      const { data, error } = await supabase
        .from("notifications")
        .select(`*`)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data);

      const channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setNotifications((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id)
              );
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) =>
                  n.id === payload.old.id ? { ...n, ...payload.new } : n
                )
              );
            }
          }
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };
    subscribe();
  }, []);

  useEffect(() => {
    if (debouncedOpen) {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      if (unreadNotifications.length > 0) {
        const unreadIds = unreadNotifications.map((n) => n.id);

        // Mark notifications as read in the state
        setNotifications((prev) =>
          prev.map((n) =>
            unreadIds.includes(n.id) ? { ...n, is_read: true } : n
          )
        );

        // Update the database
        supabase
          .from("notifications")
          .update({ is_read: true })
          .in("id", unreadIds)
          .then(({ data, error }) => {
            if (error) {
              console.error("Error updating notifications:", error);
            } else {
              // console.log("Notifications marked as read:", data);
            }
          });
      }
    }
  }, [debouncedOpen, notifications]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative cursor-pointer bg-transparent rounded-full w-10 h-10 hover:drop-shadow-lg"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        // align="end"
      >
        <Card className="border-0 shadow-none p-0 gap-2">
          <CardHeader className="border-b px-4 pt-3 pb-1 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base pb-1">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 max-h-[350px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={() => markAsRead(notification.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
