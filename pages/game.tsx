import { RollInterface } from "@/components/RollInterface";
import { RoomInterface } from "@/components/RoomInterface";
import styles from "@/styles/Home.module.css";
import { FormEvent, useState } from "react";
import { uuid } from "uuidv4";

export default function Game() {
  const [player, setPlayer] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();
    localStorage.setItem(
      "user",
      JSON.stringify({ id: uuid(), name: e.target.playername.value })
    );
    setPlayer(e.target.playername.value);
    e.target.playername.value = "";
  };
  return (
    <>
      <div className={styles.home}>
        {(player && (
          <>
            <RoomInterface />
          </>
        )) || (
          <form
            className={styles.play}
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <span> player name:</span>
            <input placeholder="name" name="playername"></input>
            <button className={styles.button}>Submit</button>
          </form>
        )}
      </div>
    </>
  );
}
