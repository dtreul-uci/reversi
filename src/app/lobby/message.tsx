"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";

let socket: Socket;

interface RoomMessage {
  message: string;
  id: number;
}

let nextId = 0;

export default function Message() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<RoomMessage[]>([]);

  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io({
        path: "/api/socket",
      });

      socket.on("connect", () => {
        const queryParameters = new URLSearchParams(window.location.search);
        const name = queryParameters.get("name");
        setLoading(false);
        const joinRoomRequest: JoinRoomRequest = {
          room: "Lobby",
          username: name,
        };
        socket.emit("join_room", joinRoomRequest);
      });

      socket.on("join_room_response", (response: JoinRoomResponse) => {
        if (response.result == "fail") {
          console.log(response.message);
        }
        const roomMessage: RoomMessage = {
          message: `${response.username} joined the room. (There are ${response.count} users in the room.)`,
          id: nextId++,
        };
        setMessages((previous) => [roomMessage, ...previous]);
      });
    });
  }, []);

  return (
    <>
      {messages.map((message) => (
        <p key={message.id}>{message.message}</p>
      ))}
    </>
  );
}
