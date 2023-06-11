import styles from "./page.module.css";

export default function Header() {
  return (
    <div className={`${styles.headerBackground} row m-3 headerrow`}>
      <div className="col text-center">
        <h1>Reversi</h1>
      </div>
    </div>
  );
}
