import { RollInterface } from "@/components/RollInterface";
import { RoomInterface } from "@/components/RoomInterface";
import { player } from "@/gameServices/roomService";
import styles from "@/styles/Home.module.css";
import { FormEvent, useState } from "react";
import { uuid } from "uuidv4";

export default function Game() {
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
  return (
    <>
      <div className={styles.home}>
        {(playerData && (
          <>
            <RoomInterface user={playerData} />
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
