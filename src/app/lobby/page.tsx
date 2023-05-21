import Message from "./message";

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
          <div className="col text-center">
            {/* <h4>Messages</h4> */}
            <Message />
          </div>
        </div>
      </div>
    </>
  );
}
