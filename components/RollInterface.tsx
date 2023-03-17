import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import scoreUtils from "@/utils/scoreUtils";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Dice from "./dice";

import { gameData } from "@/gameServices/gameService";

function rollDice(rolls: number[]) {
  const dice = [...document.querySelectorAll(".die-list")] as HTMLElement[];
  for (let i = 0; i < dice.length; i++) {
    toggleClasses(dice[i]);
    rolls[i] && (dice[i].dataset.roll = rolls[i].toString());
  }
}
function pluckDice(rolls: number[]) {
  const dice = [...document.querySelectorAll(".die-list")] as HTMLElement[];
  for (let i = 0; i < dice.length; i++) {
    rolls[i] && (dice[i].dataset.roll = rolls[i].toString());
  }
}
function toggleClasses(die: HTMLElement) {
  die.classList.toggle("odd-roll");
  die.classList.toggle("even-roll");
}
export const RollInterface = (props: {
  game: gameData;
  player: string;
  updateReq: (req: any) => void;
  roomId: string;
}) => {
  const [dice, setDice] = useState<number>(6);
  const [result, setResult] = useState<number[]>([]);
  const [rollDisabled, setRollDisabled] = useState<boolean>(false);
  const handleScoreSelect = (score: string) => {
    props.updateReq({ type: "score-select", score: score });
    setRollDisabled(false);
  };
  useEffect(() => {
    rollDice(props.game.currentRoll);
    setResult(props.game.currentRoll);
  }, [props.game]);
  useEffect(() => {
    if (props.game.currentRoll.length > 0) pluckDice(props.game.currentRoll);
  }, [props.game.currentRoll]);

  return (
    <>
      <div style={{ position: "absolute", top: "20%" }}>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "-70%",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>{props.player}</span>{" "}
          <span>Score: {props.game.currentScore}</span>
        </div>

        <button
          className={styles.button}
          disabled={rollDisabled}
          onClick={() => {
            props.updateReq({ type: "new-roll" });
            setRollDisabled(true);
          }}
        >
          Roll {props.game.dice} dice
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            {result.map((e) => {
              return (
                <div className={styles.letter} style={{ fontSize: "5rem" }}>
                  {e}
                </div>
              );
            })}
          </div> */}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {computeResult(result).map((el) => {
            if (typeof el === "string") {
              return (
                <button
                  className={styles.button}
                  onClick={() => {
                    handleScoreSelect(el);
                  }}
                >
                  {el}
                </button>
              );
            }
          })}
        </div>
      </div>
      <button
        style={{ position: "absolute", top: "0", right: "0" }}
        className={styles.button}
        onClick={() => {
          props.updateReq({ type: "bust" });
        }}
      >
        Bust
      </button>
      <button
        style={{ position: "absolute", bottom: "0", right: "0" }}
        onClick={() => {
          props.updateReq({ type: "keep" });
        }}
        className={styles.button}
      >
        Keep
      </button>
      <Dice results={result} dice={props.game.dice} />
    </>
  );
};
