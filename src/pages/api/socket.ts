import { Server } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Server as IOServer, Socket } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";

import { JoinRoomRequest, JoinRoomResponse } from "@/src/types/join_room";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

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
      console.log("Client connected");

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
            const response: JoinRoomResponse = {
              result: "success",
              room: request.room,
              username: request.username,
              count: sockets.length,
            };
            io.of("/").to(request.room).emit("join_room_response", response);
            console.log(response);
          });
      });
    });
  }
  res.end();
};

export default SocketHandler;
