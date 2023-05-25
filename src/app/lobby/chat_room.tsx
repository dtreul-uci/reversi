"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";
import { SendChatMessageRequest } from "@/src/types/send_chat_message";
import styles from "./page.module.css";
import { useSearchParams } from "next/navigation";

let socket: Socket;

interface RoomMessage {
  message: string;
  id: number;
}

let nextId = 0;
const chatRoomName = "Lobby";

export default function ChatRoom() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState<string | null>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    // fetch("/api/socket").finally(() => {
    socket = io({
      path: "/api/socket",
    });

    socket.on("connect", () => {
      const name = searchParams!.get("name");
      setUserName(name);
      const joinRoomRequest: JoinRoomRequest = {
        room: chatRoomName,
        username: name,
      };
      console.log(socket);
      socket.emit("join_room", joinRoomRequest);
    });

    socket.on("join_room_response", (response: JoinRoomResponse) => {
      console.log("received: ");
      console.log(response);
      if (response.result == "fail") {
        console.log(response.message);
      }
      const roomMessage: RoomMessage = {
        message: `${response.username} joined the room. (There are ${response.count} users in the room.)`,
        id: nextId++,
      };
      setLoading(false);
      setMessages((previous) => [roomMessage, ...previous]);
    });

    socket.on("send_chat_message_response", (response: JoinRoomResponse) => {
      console.log("received: ");
      console.log(response);
      if (response.result == "fail") {
        console.log(response.message);
      }
      const roomMessage: RoomMessage = {
        message: `${response.username}: ${response.message}`,
        id: nextId++,
      };
      setMessages((previous) => [roomMessage, ...previous]);
    });
    // });

    window.onbeforeunload = (..._args) => {
      alert("leaving");
      socket.disconnect();
    };
  }, []);

  const sendChatMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const request: SendChatMessageRequest = {
      room: chatRoomName,
      username: userName,
      message: message,
    };
    socket.emit("send_chat_message", request);
    setMessage("");
  };

  return (
    <>
      <div className="m-3 justify-content-center">
        <form onSubmit={sendChatMessage} className="input-group">
          <input
            type="text"
            className="form-control text-nowrap"
            id="messageInput"
            name="message"
            required={true}
            placeholder="Enter your message here"
            aria-label="Enter your message to send a chat message"
            aria-describedby="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary text-nowrap"
            id="sendMessageButton"
          >
            Send
          </button>
        </form>
      </div>
      <h4>Messages</h4>
      {loading && <>Loading messages...</>}
      {messages.map((message) => (
        <p className={styles.chatMessage} key={message.id}>
          {message.message}
        </p>
      ))}
    </>
  );
}
