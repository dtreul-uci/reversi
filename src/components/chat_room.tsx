"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";
import { SendChatMessageRequest } from "@/src/types/send_chat_message";
import { useGameContext } from "@/src/context/game_context";
import { useSocketContext } from "@/src/context/socket_context";
import ChatMessage from "./chat_message";
import { PlayerDisconnectedeResponse } from "@/src/types/player_disconnected";
import { Player, usePlayersContext } from "@/src/context/players_context";

let socket: Socket;

interface ChatMessageResponse {
  message: string;
  id: number;
  type: string;
  username: string;
}

let nextId = 0;

export default function ChatRoom() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [message, setMessage] = useState("");
  const { setPlayers } = usePlayersContext();
  const { username, gameId } = useGameContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket && username && gameId) {
      socket.on("connect", () => {
        const joinRoomRequest: JoinRoomRequest = {
          room: gameId!,
          username: username,
        };
        socket.emit("join_room", joinRoomRequest);
      });

      socket.on("join_room_response", (response: JoinRoomResponse) => {
        if (response.result == "fail") {
          console.log(response.message);
        }
        const roomMessage: ChatMessageResponse = {
          message: `${response.username} joined the room. (There are ${response.count} users in the room.)`,
          id: nextId++,
          type: "system",
          username: "",
        };
        setLoading(false);
        setMessages((previous) => [roomMessage, ...previous]);
        if (response.socket_id !== socket.id) {
          const player: Player = {
            username: response.username!,
            socket_id: response.socket_id,
          };
          setPlayers((previous) => [...previous, player]);
        }
      });

      socket.on("send_chat_message_response", (response: JoinRoomResponse) => {
        if (response.result == "fail") {
          console.log(response.message);
          return;
        }
        if (!response.message) {
          console.log("no message");
          return;
        }
        if (!response.username) {
          console.log("no username");
          return;
        }
        const roomMessage: ChatMessageResponse = {
          message: response.message,
          id: nextId++,
          type: "",
          username: response.username,
        };
        setMessages((previous) => [roomMessage, ...previous]);
      });

      socket.on(
        "player_disconnected",
        (response: PlayerDisconnectedeResponse) => {
          if (response && response.socket_id !== socket.id) {
            const roomMessage: ChatMessageResponse = {
              message: `${response.username} left the room. (There are ${response.count} users in the room.)`,
              id: nextId++,
              type: "system",
              username: "",
            };
            setMessages((previous) => [roomMessage, ...previous]);
            setPlayers((previous) =>
              previous.filter(
                (player) => player.socket_id !== response.socket_id
              )
            );
          }
        }
      );
    }
  }, [username, gameId, socket, setPlayers]);

  const sendChatMessage: React.FormEventHandler<HTMLFormElement> = (e) => {
    if (socket) {
      e.preventDefault();
      const request: SendChatMessageRequest = {
        room: gameId,
        username: username,
        message: message,
      };
      socket.emit("send_chat_message", request);
      setMessage("");
    }
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
      {messages.map((messageResponse) => (
        <ChatMessage
          key={messageResponse.id}
          message={messageResponse.message}
          username={messageResponse.username}
          type={messageResponse.type}
        />
      ))}
    </>
  );
}
