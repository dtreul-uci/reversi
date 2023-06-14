import Link from "next/link";
import styles from "./page.module.css";
import { useGameContext } from "@/src/context/game_context";

export default function PracticeButton() {
  const { username } = useGameContext();

  return (
    <Link
      type="button"
      className={`btn btn-warning`}
      href={{
        pathname: "/game",
        query: {
          username: username,
          game_id: "Practice",
        },
      }}
    >
      Practice
    </Link>
  );
}
