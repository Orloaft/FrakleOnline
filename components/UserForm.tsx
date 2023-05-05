import { player } from "@/services/roomService";
import styles from "@/styles/Home.module.css";
import { validateName } from "@/utils/validateUtils";
import { FormEvent, useState } from "react";
import { uuid } from "uuidv4";
export const UserForm = ({
  setPlayerData,
}: {
  setPlayerData: (playerData: player) => void;
}) => {
  const [message, setMessage] = useState<string>("");
  const handleSubmit = (e: FormEvent<HTMLFormElement> | any) => {
    e.preventDefault();
    if (validateName(e.target.playername.value) === "valid") {
      localStorage.setItem(
        "user",
        JSON.stringify({ id: uuid(), name: e.target.playername.value })
      );
      setPlayerData({ id: uuid(), name: e.target.playername.value });
      e.target.playername.value = "";
    } else {
      setMessage(validateName(e.target.playername.value));
    }
  };
  return (
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
      <span> {message}</span>
      <button className="button">Submit</button>
    </form>
  );
};
