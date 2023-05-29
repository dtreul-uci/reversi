import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";
import {
  SendChatMessageRequest,
  SendChatMessageResponse,
} from "@/src/types/send_chat_message";
import { PlayerDisconnectedeResponse } from "@/src/types/player_disconnected";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

interface Player {
  username: string;
  room: string;
}

const players = new Map<string, Player>();

const SocketHandler = (_: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      function serverLog(...messages: string[]) {
        io.emit("log", ["**** Message from the server:\n"]);
        messages.forEach((message) => {
          io.emit("log", ["****\t" + message]);
          console.log(message);
        });
      }
      serverLog("a page connected to the server: " + socket.id);

      socket.on("join_room", (request: JoinRoomRequest) => {
        if (typeof request.room == undefined || request.room == null) {
          const response: JoinRoomResponse = {
            result: "fail",
            message: "Room not specified",
          };
          socket.emit("join_room_response", response);
        }
        if (typeof request.username == undefined || request.username == null) {
          const response: JoinRoomResponse = {
            result: "fail",
            message: "Username not specified",
          };
          socket.emit("join_room_response", response);
        }

        // success
        socket.join(request.room);

        // Check client is in room
        io.in(request.room)
          .fetchSockets()
          .then((sockets) => {
            // Fail
            if (typeof sockets == undefined || sockets === null) {
            }
            // Success
            else {
              players.set(socket.id, {
                username: request.username!,
                room: request.room,
              });
              sockets.forEach((member) => {
                const response: JoinRoomResponse = {
                  result: "success",
                  socket_id: member.id,
                  room: players.get(member.id)?.room,
                  username: players.get(member.id)?.username,
                  count: sockets.length,
                };
                io.of("/")
                  .to(request.room)
                  .emit("join_room_response", response);
              });
            }
          });
      });

      socket.on("disconnect", () => {
        serverLog("a page disconnected from the server: " + socket.id);
        if (players.has(socket.id)) {
          const room = players.get(socket.id)?.room;
          const username = players.get(socket.id)?.username;
          if (room && username) {
            const payload: PlayerDisconnectedeResponse = {
              username: username,
              room: room,
              count: players.size - 1,
              socket_id: socket.id,
            };
            players.delete(socket.id);
            io.of("/").to(room).emit("player_disconnected", payload);
          }
        }
      });

      socket.on("send_chat_message", (request: SendChatMessageRequest) => {
        if (typeof request.room == undefined || request.room == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "Room not specified",
          };
          socket.emit("send_chat_message_response", response);
        }
        if (typeof request.username == undefined || request.username == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "Username not specified",
          };
          socket.emit("send_chat_message_response", response);
        }
        if (typeof request.message == undefined || request.message == null) {
          const response: SendChatMessageResponse = {
            result: "fail",
            message: "message not specified",
          };
          socket.emit("send_chat_message_response", response);
        }

        // success
        const response: SendChatMessageResponse = {
          result: "success",
          room: request.room,
          username: request.username,
          message: request.message!,
        };
        io.of("/")
          .to(request.room!)
          .emit("send_chat_message_response", response);
      });
    });
  }
  res.end();
};

export default SocketHandler;
