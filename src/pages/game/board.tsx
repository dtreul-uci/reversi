import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { useBoardContext } from "@/src/context/board_context";
import GamePiece from "./game_piece";
import { useSocketContext } from "@/src/context/socket_context";
import { GameUpdateResponse } from "@/src/types/game_update";
import { PlayTokenResponse } from "@/src/types/play_token";
import { GameOver } from "@/src/types/game_over";

export default function Board() {
  const { board, setBoard, myColor, setMyColor, setIsOver, setWinner } =
    useBoardContext();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (socket) {
      socket.on("game_update", (payload: GameUpdateResponse) => {
        console.log(payload);
        if (payload.result === "fail") {
          console.log(payload.message);
          return;
        }
        if (!payload.game?.board) {
          console.log("no board received");
          return;
        }

        // Update my color
        if (socket.id === payload.game!.player_white.socket) {
          setMyColor("white");
        } else if (socket.id === payload.game!.player_black.socket) {
          setMyColor("black");
        } else {
          // Shouldn't ever get here... Abort!
          // Todo: redirect to lobby
        }

        // Update Board
        setBoard(payload.game.board);
      });
      socket.on("play_token_response", (payload: PlayTokenResponse) => {
        if (!payload) {
          console.log("No payload");
          return;
        }
        if (payload.result === "fail") {
          console.log(payload.message);
          return;
        }
      });
      socket.on("game_over", (payload: GameOver) => {
        if (!payload) {
          console.log("No payload");
          return;
        }
        if (payload.result === "fail") {
          console.log(payload.message);
          return;
        }
        // success
        setIsOver(true);
        setWinner(payload.who_won);
      });
    }
  }, [socket, setBoard, setMyColor, setIsOver, setWinner]);

  return (
    <table className={`${styles.board} mx-auto w-auto`}>
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((piece, pieceIndex) => (
              <td
                key={`${rowIndex},${pieceIndex}`}
                className={`${styles.gamePiece}`}
              >
                <GamePiece status={piece} row={rowIndex} col={pieceIndex} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
