import ChatRoom from "@/src/components/chat_room";
import LobbyHeader from "@/src/components/lobby_header";
import { GameContextProvider } from "@/src/context/game_context";
import { SocketContextProvider } from "@/src/context/socket_context";
import styles from "./page.module.css";
import PlayerList from "@/src/components/player_list";
import { PlayersContextProvider } from "@/src/context/players_context";
import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PracticeButton from "./practice_button";

export const metadata = {
  title: "Reversi: Lobby",
  description: "Reversi Lobby Page",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <GameContextProvider>
        <SocketContextProvider>
          <PlayersContextProvider>
            <div className="container-fluid">
              <div className={`${styles.headerRow} row m-3 headerrow`}>
                <div className="col text-center">
                  <LobbyHeader />
                </div>
              </div>
              <div className="row m-3">
                <div className="row m-3">
                  <div className="row align-items-start justify-content-center">
                    <div className="col-md-4">
                      <div
                        className={`${styles.practiceButtonContainer} text-center my-4`}
                      >
                        <PracticeButton />
                      </div>
                      <h4>Players</h4>
                      <PlayerList />
                      <div
                        id="players"
                        className="align-items-end text-right m-3"
                      ></div>
                    </div>
                    <div className={`${styles.chatMessageSection} col-md-8`}>
                      <ChatRoom />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PlayersContextProvider>
        </SocketContextProvider>
      </GameContextProvider>
    </Suspense>
  );
}
