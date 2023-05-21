"use client";

import { io, Socket } from "socket.io-client";
import { useEffect } from "react";

let socket: Socket;

export default function Message() {
  const queryParameters = new URLSearchParams(window.location.search);
  const name = queryParameters.get("name");

  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io({
        path: "/api/socket",
      });

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("msg", { msg: "hello" });
      });

      socket.on("server_msg", (msg) => {
        console.log(msg);
      });
    });
  }, []);

  return (
    <>
      {/* <button
        onClick={() => {
          socket.emit("msg", "test");
        }}
      >
        Test
      </button> */}
      Hello {name}
    </>
  );
}
