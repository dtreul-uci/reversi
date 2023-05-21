import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import topSplash from "@/public/images/top-splash.png";
import bottomSplash from "@/public/images/bottom-splash.png";

export default function Page() {
  return (
    <>
      <div className="container-fluid">
        <div className="row m-3">
          <div className="col text-center">
            <Link className="btn btn-success text-nowrap" href="/about">
              About
            </Link>
          </div>
          <div className="col text-center">
            <a
              className="btn btn-success text-nowrap"
              href="https://en.wikipedia.org/wiki/Reversi"
            >
              Rules
            </a>
          </div>
        </div>
        <div className="row m-3">
          <div className="col text-center">
            <Image className="img-fluid" src={topSplash} alt="Reversi Logo" />
          </div>
        </div>
        <div className="row align-items-center justify-content-center m-3">
          <div className="col-8">
            <form action={"/lobby"} className="input-group">
              <label className="input-group-text" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                className="form-control text-nowrap"
                id="nameInput"
                name="name"
                required={true}
                placeholder="Choose your display name"
                aria-label="Enter your display name for use while playing Reversi"
                aria-describedby="displayName"
              />
              <button
                type="submit"
                className="btn btn-primary text-nowrap"
                id="lobbyButton"
              >
                Enter Lobby
              </button>
            </form>
          </div>
        </div>
        <div className="row m-3">
          <div className="col text-center">
            <Image className="img-fluid" src={bottomSplash} alt="Bottom Logo" />
          </div>
        </div>
      </div>
    </>
  );
}
