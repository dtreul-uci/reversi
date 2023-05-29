"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ContextProps {
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
}

export interface Player {
  username: string;
  socket_id: string;
}

type Props = {
  children: React.ReactNode;
};

const PlayersContext = createContext<ContextProps>({
  players: [],
  setPlayers: (): string[] => [],
});

export const PlayersContextProvider = ({ children }: Props) => {
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayersContext = () => useContext(PlayersContext);
