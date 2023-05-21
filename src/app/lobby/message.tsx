"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

let socket: Socket;

export default function Message() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<null | string>("");

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    setName(queryParameters.get("name"));
    setLoading(false);
  }, []);

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
      {loading ? <>Loading...</> : <>Hello {name}</>}
    </>
  );
}
