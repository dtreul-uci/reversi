import ChatRoom from "@/src/components/chat_room";
import Header from "./header";
import { GameContextProvider } from "@/src/context/game_context";
import { SocketContextProvider } from "@/src/context/socket_context";
import styles from "./page.module.css";
import { PlayersContextProvider } from "@/src/context/players_context";
import "bootstrap/dist/css/bootstrap.min.css";
import GameOver from "./game_over";
import Status from "./status";
import { BoardContextProvider } from "@/src/context/board_context";
import Board from "./board";
import ProgressBar from "./progress_bar";

export const metadata = {
  title: "Reversi",
  description: "Reversi Game Page",
};

export default function Page() {
  return (
    <GameContextProvider>
      <SocketContextProvider>
        <PlayersContextProvider>
          <BoardContextProvider>
            <div className={`${styles.body}`}>
              <Header />
              <GameOver />
              <Status />
              <div className={`${styles.colorMe} row m-3`}>
                <div className="row m-3">
                  <div className="row align-items-start justify-content-center">
                    <div className="col-md-8">
                      <ProgressBar />
                      <Board />
                    </div>
                    <div className={`${styles.headerBackground} col-md-4`}>
                      <ChatRoom />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BoardContextProvider>
        </PlayersContextProvider>
      </SocketContextProvider>
    </GameContextProvider>
  );
}
