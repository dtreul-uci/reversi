import { useEffect, useState } from "react";
import { useSocketContext } from "../context/socket_context";
import {
  InviteRequest,
  InviteResponse,
  Invited,
  UninviteRequest,
  UninviteResponse,
} from "../types/invite";
import { useRouter } from "next/router";
import { GameStartRequest, GameStartResponse } from "../types/game_start";
import { useGameContext } from "../context/game_context";

interface InviteButtonProps {
  invitee: string;
}

enum InviteButtonState {
  Invite = 1,
  Uninvite = 2,
  Play = 3,
  StartingGame = 4,
}

export default function InviteButton(props: InviteButtonProps) {
  const [buttonState, setButtonState] = useState<InviteButtonState>(
    InviteButtonState.Invite
  );
  const { socket } = useSocketContext();
  const router = useRouter();
  const { username, gameId } = useGameContext();

  function invite() {
    const payload: InviteRequest = {
      requested_user: props.invitee,
    };
    socket!.emit("invite", payload);
  }

  function uninvite() {
    const payload: UninviteRequest = {
      requested_user: props.invitee,
    };
    socket!.emit("uninvite", payload);
  }

  function play() {
    const payload: GameStartRequest = {
      requested_user: props.invitee,
    };
    socket!.emit("game_start", payload);
    setButtonState(InviteButtonState.StartingGame);
  }

  useEffect(() => {
    socket!.on("invited", (response: Invited) => {
      if (
        response.result === "success" &&
        response.socket_id === props.invitee
      ) {
        setButtonState(InviteButtonState.Play);
      }
    });

    socket!.on("invite_response", (response: InviteResponse) => {
      if (
        response.result === "success" &&
        response.socket_id === props.invitee
      ) {
        setButtonState(InviteButtonState.Uninvite);
      }
    });

    socket!.on("uninvite_response", (response: UninviteResponse) => {
      console.log(response);
      if (
        response.result === "success" &&
        response.socket_id === props.invitee
      ) {
        setButtonState(InviteButtonState.Invite);
      } else {
        console.log(response.message);
      }
    });

    socket!.on("game_start_response", (response: GameStartResponse) => {
      if (response.result === "success") {
        socket?.disconnect();
        router.push({
          pathname: "/game",
          query: {
            username: username,
            game_id: response.game_id,
          },
        });
      }
    });

    return () => {
      socket!.off("invited");
      socket!.off("invite_response");
      socket!.off("uninvite_response");
    };
  }, [socket]);

  return (
    <>
      {(() => {
        switch (buttonState) {
          case InviteButtonState.Invite:
            return (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={(e) => invite()}
              >
                Invite
              </button>
            );

          case InviteButtonState.Uninvite:
            return (
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => uninvite()}
              >
                Uninvite
              </button>
            );

          case InviteButtonState.Play:
            return (
              <button
                type="button"
                className="btn btn-success"
                onClick={(e) => play()}
              >
                Play
              </button>
            );

          case InviteButtonState.StartingGame:
            return (
              <button type="button" className="btn btn-danger">
                Starting Game
              </button>
            );

          default:
            return <></>;
        }
      })()}
    </>
  );
}
