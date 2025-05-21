"use client";
import { ArrowLeft, MessageCircle, Send, User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useRef, useState, useEffect } from "react";
import { GetImageUrl } from "@/lib/supabase/utils";
import { GetMessages } from "@/app/actions/trips";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Loading from "@/app/loading";

export default function Chat({
  tripId = null,
  passengers = null,
  isDriver = null,
  isPassenger = null,
  user = null,
  driver = null,
}) {
  const [seluserUser, setSelsersUser] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isPassenger) setSelsersUser(driver);
  }, [isPassenger, driver]);
  useEffect(() => {
    if (isDriver && !open) {
      setSelsersUser(null);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md p-1 cursor-pointer flex justify-center items-center">
          <MessageCircle strokeWidth={0} fill="#fff" className="w-8 h-8" />
          <span className="font-extrabold text-md">Chat</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-full h-[calc(100vh-50px)] flex flex-col overflow-hidden px-0 gap-0">
        {!seluserUser && (
          <>
            <DialogHeader className="w-full px-6 border-b pb-2">
              <div className="flex flex-row items-start gap-2">
                <div>
                  <DialogTitle>Chat</DialogTitle>
                  <DialogDescription>passengers</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-col h-full bg-background overflow-auto mb-12">
              {/* Messages */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="space-y-4">
                  {isDriver && passengers.length > 0 ? (
                    passengers.map((passenger) => (
                      <Passengers
                        key={passenger.id}
                        passenger={passenger}
                        setSelsersUser={setSelsersUser}
                        bookingstatus={passenger.booking_status}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full w-full">
                      <p className="text-muted-foreground">No passengers</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {seluserUser && (
          <Messages
            selectedUser={seluserUser}
            setSelsersUser={setSelsersUser}
            tripId={tripId}
            user={user}
            isPassenger={isPassenger}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Passengers({ passenger, setSelsersUser, bookingstatus }) {
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    const getImage = async () => {
      const image = await GetImageUrl(passenger.profile.avatar_url);
      setAvatar(image);
    };
    if (passenger.profile.avatar_url) {
      getImage();
    } else {
      setAvatar(null);
    }
  }, [passenger.profile.avatar_url]);
  return (
    <div
      key={passenger.id}
      className="flex items-center gap-3 w-full hover:bg-primary/20 p-2 rounded-md cursor-pointer shadow-md"
      onClick={() => setSelsersUser(passenger.profile)}
    >
      {/* !{passenger.profile.full_name}! */}
      <div className="bg-white-300 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:drop-shadow-lg border-2 border-primary overflow-hidden">
        {avatar ? (
          <Image
            src={avatar}
            alt={passenger.profile.full_name + " avatar"}
            width={35}
            height={35}
            className="h-full w-full object-cover"
          />
        ) : (
          <User2 className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">
            {passenger.profile.full_name}
          </span>
          <span className="text-sm font-extralight bg-primary text-white rounded-full flex items-center justify-center px-1.5">
            {bookingstatus}
          </span>
        </div>
      </div>
    </div>
  );
}

function Messages({ selectedUser, setSelsersUser, tripId, user, isPassenger }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (loading) return;
    if (inputValue.trim() === "") return;

    const supabase = createClient();
    // Add user message

    const userMessage = {
      message: inputValue,
      trip_id: tripId,
      user_id: user.id,
      for_id: selectedUser.id,
    };
    const { data, error } = await supabase.from("chats").insert([userMessage]);

    setInputValue("");
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    const getImage = async () => {
      const image = await GetImageUrl(selectedUser.avatar_url);
      setAvatar(image);
    };
    if (selectedUser.avatar_url) {
      getImage();
    } else {
      setAvatar(null);
    }
  }, [selectedUser.avatar_url]);
  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      const data = await GetMessages({
        trip_id: tripId,
        user_id: user.id,
        for_id: selectedUser.id,
      });
      setLoading(false);
      setMessages(data);
    };
    getMessages();
    subscribe();
  }, [selectedUser.id]);

  const subscribe = async () => {
    const supabase = createClient();

    const channels = supabase
      .channel(`trip-chat-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chats",
          filter: "trip_id=eq." + tripId,
        },
        (payload) => {
          const newMessage = payload.new;
          if (
            (newMessage.for_id === selectedUser.id &&
              newMessage.user_id === user.id) ||
            (newMessage.user_id === selectedUser.id &&
              newMessage.for_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();
  };

  return (
    <>
      <DialogHeader className="w-full px-6 border-b pb-2 ps-1">
        <div className="flex flex-row items-center gap-2">
          {!isPassenger && (
            <div
              className="text-xs my-auto -me-1.5 cursor-pointer"
              onClick={() => setSelsersUser(null)}
            >
              <ArrowLeft />
            </div>
          )}
          <img
            src={avatar}
            className="h-10 max-w-10 mr-3h-full w-full object-cover rounded-full"
          />
          <DialogTitle className="text-start">
            {selectedUser.full_name}
          </DialogTitle>
        </div>
      </DialogHeader>
      <div className="flex flex-col h-full bg-background overflow-auto mb-12">
        {/* Messages */}
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 p-4 flex flex-col-reverse">
            <div className="space-y-4">
              {messages?.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    user.id === message.user_id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      user.id === message.user_id
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    }`}
                  >
                    <p>{message.message}</p>
                    <div
                      className={`text-xs mt-1 ${
                        user.id === message.user_id
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTime(new Date(message.created_at))}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t fixed bottom-0 left-0 w-full bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/20">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                className="pr-10 rounded-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="rounded-sm cursor-pointer"
              disabled={inputValue.trim() === ""}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
