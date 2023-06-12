import styles from "./page.module.css";
import errorToken from "@/public/images/error.gif";
import emptyToken from "@/public/images/empty.gif";
import whiteToken from "@/public/images/white.gif";
import blackToken from "@/public/images/black.gif";
import hover from "@/public/images/hover.gif";
import emptyToBlack from "@/public/images/empty_to_black.gif";
import emptyToWhite from "@/public/images/empty_to_white.gif";
import blackToEmpty from "@/public/images/black_to_empty.gif";
import whiteToEmpty from "@/public/images/white_to_empty.gif";
import whiteToBlack from "@/public/images/white_to_black.gif";
import blackToWhite from "@/public/images/black_to_white.gif";

import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "@/src/context/socket_context";
import { PlayTokenRequest } from "@/src/types/play_token";
import { useBoardContext } from "@/src/context/board_context";

interface GamePieceProps {
  status: string;
  row: number;
  col: number;
}

const usePreviousValue = (value: string) => {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default function GamePiece(props: GamePieceProps) {
  const prevStatus = usePreviousValue(props.status);
  const { myColor, whoseTurn, validMoves } = useBoardContext();
  const curStatus = props.status;
  const { socket } = useSocketContext();

  const [isHovered, setIsHovered] = useState(false);

  const isValid =
    myColor === whoseTurn &&
    validMoves.length == 8 &&
    validMoves[props.row][props.col] === myColor[0];

  function sendMove() {
    if (socket && props.status === " ") {
      const payload: PlayTokenRequest = {
        row: props.row,
        column: props.col,
        color: myColor,
      };
      console.log(`Sending play token`);
      console.log(payload);
      socket.emit("play_token", payload);
    }
  }

  let imageData: StaticImageData;
  let altText: string;

  if (curStatus == "?") {
    imageData = emptyToken;
    altText = "Empty";
  } else if (prevStatus === "?" && curStatus === " ") {
    imageData = emptyToken;
    altText = "Empty";
  } else if (prevStatus === "?" && curStatus == "w") {
    imageData = emptyToWhite;
    altText = "White";
  } else if (prevStatus === "?" && curStatus == "b") {
    imageData = emptyToBlack;
    altText = "Black";
  } else if (prevStatus === " " && curStatus == "w") {
    imageData = emptyToWhite;
    altText = "White";
  } else if (prevStatus === " " && curStatus == "b") {
    imageData = emptyToBlack;
    altText = "Black";
  } else if (prevStatus === "b" && curStatus == " ") {
    imageData = blackToEmpty;
    altText = "Empty";
  } else if (prevStatus === "w" && curStatus == " ") {
    imageData = whiteToEmpty;
    altText = "Empty";
  } else if (prevStatus === "b" && curStatus == "w") {
    imageData = blackToWhite;
    altText = "White";
  } else if (prevStatus === "w" && curStatus == "b") {
    imageData = whiteToBlack;
    altText = "Black";
  } else if (prevStatus === "w" && curStatus == "w") {
    imageData = whiteToken;
    altText = "White";
  } else if (prevStatus === "b" && curStatus == "b") {
    imageData = blackToken;
    altText = "Black";
  } else if (prevStatus === " " && curStatus == " ") {
    imageData = emptyToken;
    altText = "Empty";
  } else {
    imageData = errorToken;
    altText = "Error";
  }

  return (
    <div
      onMouseEnter={() => {
        if (isValid) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (isValid) sendMove();
      }}
    >
      {isHovered && props.status === " " ? (
        <Image
          className={`img-fluid ${styles.abs}`}
          src={hover}
          alt={`hover`}
        />
      ) : (
        <></>
      )}
      <Image className="img-fluid" src={imageData} alt={altText} />
    </div>
  );
}
