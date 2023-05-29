import ChatRoom from "./chat_room";
import LobbyHeader from "./lobby_header";
import { GameContextProvider } from "@/src/context/store";
import { SocketContextProvider } from "@/src/context/socket_context";
import styles from "./page.module.css";
import PlayerList from "./player_list";
import { PlayersContextProvider } from "@/src/context/players_context";
import { Suspense } from "react";

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
