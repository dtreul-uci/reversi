import styles from "./page.module.css";
import whiteToken from "@/public/images/white.gif";
import blackToken from "@/public/images/black.gif";
import Image, { StaticImageData } from "next/image";
import { useBoardContext } from "@/src/context/board_context";
import Link from "next/link";
import { useGameContext } from "@/src/context/game_context";

export default function Status() {
  const { myColor, whitesum, blacksum } = useBoardContext();
  const { username } = useGameContext();

  let imageData: StaticImageData | undefined = undefined;
  let altText: string = "";

  if (myColor == "white") {
    imageData = whiteToken;
    altText = "White";
  } else if (myColor == "black") {
    imageData = blackToken;
    altText = "Black";
  } else {
  }

  return (
    <div className={`row m-3`}>
      <div className="col-md-8 text-center justify-content-center">
        <h3>{`I am ${myColor}`}</h3>
        <br />
        <Image src={whiteToken} alt="White Score" className="img-fluid m-1" />
        <span className="m-1">{whitesum}</span>
        <span className="m-1">vs</span>
        <span className="m-1">{blacksum}</span>
        <Image src={blackToken} alt="Black Score" className="img-fluid m-1" />
      </div>
      <div className="col-md-4 text-end justify-content-end">
        <Link
          type="button"
          className="btn btn-danger"
          href={{
            pathname: "/lobby",
            query: {
              username: username,
            },
          }}
        >
          Quit
        </Link>
      </div>
    </div>
  );
}
