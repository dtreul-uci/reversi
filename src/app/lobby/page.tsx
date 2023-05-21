import ChatRoom from "./chat_room";

export const metadata = {
  title: "Reversi: Lobby",
  description: "Reversi Lobby Page",
};

export default function Page() {
  return (
    <>
      <div className="container-fluid">
        <div className="row m-3 headerrow">
          <div className="col text-center">
            <h1>Lobby</h1>
          </div>
        </div>
        <div className="row m-3">
          <div className="col">
            <ChatRoom />
          </div>
        </div>
      </div>
    </>
  );
}
