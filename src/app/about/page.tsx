// import styles from "./page.module.css";
import Link from "next/link";

export const metadata = {
  title: "Reversi: About",
  description: "Reversi About Page",
};

export default function Page() {
  return (
    <>
      <div className="container-fluid">
        <div className="row m-3 headerrow">
          <div className="col text-center">
            <h1>About</h1>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <p>This is a basic web app game.</p>
          </div>
        </div>
      </div>
    </>
  );
}
