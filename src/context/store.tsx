"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface ContextProps {
  username: string;
  gameId: string;
}

const GameContext = createContext<ContextProps>({
  username: "",
  gameId: "",
});

export const GameContextProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setUsername(
        searchParams.get("name") ||
          "Anonymous " + Math.floor(Math.random() * 1000).toString()
      );
      setGameId(searchParams.get("game_id") || "Lobby");
    }
  }, [searchParams]);

  return (
    <GameContext.Provider value={{ username, gameId }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
