import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <h1>Hello world</h1>
      <div className="row">
        <div className="col">1</div>
        <div className="col">2</div>
        <div className="col">3</div>
      </div>
    </>
  );
}
