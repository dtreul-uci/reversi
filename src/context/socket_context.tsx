"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ContextProps {
  socket: Socket | null;
}

type Props = {
  children: React.ReactNode;
};

const SocketContext = createContext<ContextProps>({
  socket: null,
});

export const SocketContextProvider = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const initSocket = async () => {
    setSocket(
      io({
        path: "/api/socket",
      })
    );
  };

  useEffect(() => {
    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
