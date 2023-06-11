import { useBoardContext } from "@/src/context/board_context";
import styles from "./page.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { useGameContext } from "@/src/context/game_context";

export default function GameOver() {
  const { isOver, winner } = useBoardContext();
  const { username } = useGameContext();

  return (
    <>
      {isOver ? (
        <div className={`${styles.fadeInThousand} row m-3`}>
          <div className="col text-center">
            <h1>Game Over</h1>
            <h2>{winner} won!</h2>
            <Link
              type="button"
              className="btn btn-success"
              href={{
                pathname: "/lobby",
                query: {
                  username: username,
                },
              }}
            >
              Return to lobby
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
