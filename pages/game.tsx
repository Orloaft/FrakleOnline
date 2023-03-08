import { RollInterface } from "@/components/RollInterface";
import styles from "@/styles/Home.module.css";
import { FormEvent, useState } from "react";

export default function Game() {
  const [player, setPlayer] = useState("");
  const handleSubmit = (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();
    setPlayer(e.target.playername.value);
    e.target.playername.value = "";
  };
  return (
    <>
      <div className={styles.home}>
        {(player && (
          <>
            <RollInterface player={player} />
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
