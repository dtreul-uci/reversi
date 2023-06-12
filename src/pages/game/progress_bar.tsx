import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { useBoardContext } from "@/src/context/board_context";
import { ProgressBar as PB } from "react-bootstrap";

export default function ProgressBar() {
  const { lastMoveTime } = useBoardContext();
  const [timeString, setTimeString] = useState("0:00");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      ((last_time) => {
        return () => {
          const d = new Date();
          const now = d.getTime();
          const elapsed_m = now - last_time;
          const minutes = Math.floor(elapsed_m / 1000 / 60);
          const seconds = Math.floor((elapsed_m % (60 * 1000)) / 1000);
          setTotal(Math.min(minutes * 60 + seconds, 100));
          let timestring = "" + seconds;
          timestring = timestring.padStart(2, "0");
          timestring = minutes + ":" + timestring;
          if (minutes * 60 + seconds > 100) {
            setTimeString("Times Up!");
          } else {
            setTimeString(timestring);
          }
        };
      })(lastMoveTime),
      1000
    );
    return () => {
      clearInterval(interval);
      setTotal(0);
      setTimeString("0:00");
    };
  }, [lastMoveTime]);

  return (
    <>
      <PB
        now={total}
        striped
        animated
        variant="success"
        label={timeString}
        className={`${styles.progress} mx-auto w-auto`}
      />
    </>
  );
}
