import { SocketGameController } from "@/components/SocketGameController";
import { player } from "@/gameServices/roomService";
import styles from "@/styles/Home.module.css";
import { FormEvent, useEffect, useState } from "react";
import { uuid } from "uuidv4";

export default function Main() {
  const [playerData, setPlayerData] = useState<player | null>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();
    if (e.target.playername.value) {
      localStorage.setItem(
        "user",
        JSON.stringify({ id: uuid(), name: e.target.playername.value })
      );
      setPlayerData({ id: uuid(), name: e.target.playername.value });
      e.target.playername.value = "";
    }
  };
  useEffect(() => {
    let user = sessionStorage.getItem("userData");
    user && setPlayerData(JSON.parse(user));
  }, []);
  return (
    <>
      <div className={styles.home}>
        {(playerData && (
          <>
            <SocketGameController user={playerData} />
          </>
        )) || (
          <form
            className={styles.play}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              autoComplete="off"
              className="input"
              placeholder="player name"
              name="playername"
            ></input>
            <button className="button">Submit</button>
          </form>
        )}
      </div>
    </>
  );
}
