"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/router";

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
  const [socketLoaded, setSocketLoaded] = useState(false);
  const router = useRouter();

  const initSocket = async () => {
    console.log("connecting!");
    setSocket(
      io({
        path: "/api/socket",
      })
    );
  };

  useEffect(() => {
    initSocket();
    setSocketLoaded(true);
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
