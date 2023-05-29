import ChatRoom from "./chat_room";
import LobbyHeader from "./lobby_header";
import { GameContextProvider } from "@/src/context/store";
import { SocketContextProvider } from "@/src/context/socket_context";

export const metadata = {
  title: "Reversi: Lobby",
  description: "Reversi Lobby Page",
};

export default function Page() {
  return (
    <>
      <GameContextProvider>
        <SocketContextProvider>
          <div className="container-fluid">
            <div className="row m-3 headerrow">
              <div className="col text-center">
                <LobbyHeader />
              </div>
            </div>
            <div className="row m-3">
              <div className="col">
                <ChatRoom />
              </div>
            </div>
          </div>
        </SocketContextProvider>
      </GameContextProvider>
    </>
  );
}
