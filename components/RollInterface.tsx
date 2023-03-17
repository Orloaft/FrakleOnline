import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import scoreUtils from "@/utils/scoreUtils";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Dice from "./dice";

import { gameData } from "@/gameServices/gameService";
import { player } from "@/gameServices/roomService";

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
  player: player;
  updateReq: (req: any) => void;
  roomId: string;
}) => {
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
  let currentPlayer = props.game.players.find(
    (p) => p.id === props.game.rollingPlayerId
  );
  useEffect(() => {
    setRollDisabled(false);
  }, [props.game.rollingPlayerId]);
  return (
    <>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {props.game.players.map((p) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <span>{p.name}</span>
              <span>{p.points}</span>
            </div>
          );
        })}
      </div>
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
          <span>{currentPlayer && currentPlayer.name}</span>{" "}
          <span>Score: {props.game.currentScore}</span>
        </div>
        {props.game.rollingPlayerId === props.player.id && (
          <>
            <button
              className={styles.button}
              disabled={rollDisabled}
              onClick={() => {
                props.updateReq({ type: "new-roll" });
                setRollDisabled(true);
              }}
            >
              {props.game.canFork ? `Fork` : `Roll ${props.game.dice} dice`}
            </button>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {props.game.scorables.map((el) => {
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
          </>
        )}
      </div>
      {props.game.rollingPlayerId === props.player.id && (
        <>
          {" "}
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
            disabled={!props.game.canKeep}
          >
            Keep
          </button>
          {props.game.canFork && (
            <button
              onClick={() => {
                props.updateReq({ type: "pass-fork" });
              }}
            >
              Pass
            </button>
          )}
        </>
      )}
      <Dice results={result} dice={props.game.dice} />
    </>
  );
};
