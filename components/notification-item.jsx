"use client";

import { cn } from "@/lib/utils";
import { CarFront, FileText, MessageCircle, TriangleAlert } from "lucide-react";
import { redirect } from "next/navigation";

export function NotificationItem({ notification, onRead }) {
  const Icon = () => {
    switch (notification.type) {
      case "trip":
        return <CarFront className="w-full h-full text-muted-foreground" />;
      case "payment":
        return (
          <img
            src="/SAR.svg"
            alt="logo"
            className="w-full h-full text-muted-foreground"
          />
        );
      case "message":
        return (
          <MessageCircle className="w-full h-full text-muted-foreground" />
        );
      case "request":
        return <FileText className="w-full h-full text-muted-foreground" />;
      case "alert":
        return (
          <TriangleAlert className="w-full h-full text-muted-foreground" />
        );
      default:
        return (
          <TriangleAlert className="w-full h-full text-muted-foreground" />
        );
    }
  };
  return (
    <div
      className={cn(
        `flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
          notification.url && "cursor-pointer"
        } `,
        !notification.is_read && "bg-muted/30"
      )}
      onClick={() => {
        if (!notification.is_read) onRead();
        // redirect to the notification link
        notification.url && redirect(notification.url);
      }}
    >
      {notification.is_read ? (
        <div className="w-10 h-10 p-2 rounded-full bg-muted-foreground/30">
          <Icon />
        </div>
      ) : (
        <div className="w-10 h-10 p-2 rounded-full bg-primary *:!text-white">
          <Icon />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none">{notification.title}</p>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {notification.body}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {(() => {
            const diff = new Date() - new Date(notification.created_at);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (minutes < 60) return `${minutes} min ago`;
            if (hours < 24) return `${hours} hours ago`;
            if (days === 1) return "Yesterday";
            if (days < 7) return `${days} days ago`;
            return new Date(notification.created_at).toLocaleDateString();
          })()}
        </p>
      </div>
    </div>
  );
}
