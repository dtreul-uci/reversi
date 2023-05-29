"use client";

import { usePlayersContext } from "@/src/context/players_context";
import styles from "./page.module.css";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function PlayerList() {
  const { players } = usePlayersContext();
  return (
    <TransitionGroup>
      {players.map((player) => {
        return (
          <CSSTransition
            classNames={{
              enterActive: styles.fadeIn,
              exitActive: styles.fadeOut,
            }}
            key={player.socket_id}
            timeout={500}
          >
            <div className="row align-items-center m-3">
              <div className="col text-end">{player.username}</div>
              <div className="col text-end">
                <button type="button" className="btn btn-outline-primary">
                  Invite
                </button>
              </div>
            </div>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}
