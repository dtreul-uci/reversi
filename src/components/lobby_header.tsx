"use client";

import { useGameContext } from "@/src/context/game_context";

export default function LobbyHeader() {
  const { username } = useGameContext();
  if (username) {
    return <h1>{username}&apos;s Lobby</h1>;
  } else {
    return <h1></h1>;
  }
}
