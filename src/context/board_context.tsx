"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface ContextProps {
  board: string[][];
  setBoard: Dispatch<SetStateAction<string[][]>>;
  myColor: string;
  setMyColor: Dispatch<SetStateAction<string>>;
  isOver: boolean;
  setIsOver: Dispatch<SetStateAction<boolean>>;
  winner: string;
  setWinner: Dispatch<SetStateAction<string>>;
  whitesum: number;
  blacksum: number;
}

type Props = {
  children: React.ReactNode;
};

const BoardContext = createContext<ContextProps>({
  board: [],
  setBoard: (): string[] => [],
  myColor: "",
  setMyColor: (): string => "",
  isOver: false,
  setIsOver: (): boolean => false,
  winner: "",
  setWinner: (): string => "",
  whitesum: 0,
  blacksum: 0,
});

export const BoardContextProvider = ({ children }: Props) => {
  const [board, setBoard] = useState<string[][]>([]);
  const [myColor, setMyColor] = useState("");
  const [isOver, setIsOver] = useState(false);
  const [winner, setWinner] = useState("");

  let whitesum = 0;
  let blacksum = 0;

  board.forEach((row) => {
    row.forEach((item) => {
      if (item === "w") {
        whitesum++;
      } else if (item === "b") {
        blacksum++;
      }
    });
  });

  // Board initialization
  useEffect(() => {
    const tempBoard = [
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
      ["?", "?", "?", "?", "?", "?", "?", "?"],
    ];
    setBoard(tempBoard);
  }, []);

  return (
    <BoardContext.Provider
      value={{
        board,
        setBoard,
        myColor,
        setMyColor,
        isOver,
        setIsOver,
        winner,
        setWinner,
        whitesum,
        blacksum,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardContext = () => useContext(BoardContext);
