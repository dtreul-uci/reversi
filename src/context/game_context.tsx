import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ContextProps {
  username: string;
  gameId: string;
}

type Props = {
  children: React.ReactNode;
};

const GameContext = createContext<ContextProps>({
  username: "",
  gameId: "",
});

export const GameContextProvider = ({ children }: Props) => {
  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      if (router.query.username && typeof router.query.username == "string") {
        setUsername(router.query.username);
      } else {
        setUsername("Anonymous " + Math.floor(Math.random() * 1000).toString());
      }
      if (router.query.game_id && typeof router.query.game_id == "string") {
        setGameId(router.query.game_id);
      } else {
        setGameId("Lobby");
      }
    }
  }, [router]);

  return (
    <GameContext.Provider value={{ username, gameId }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
