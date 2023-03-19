import { useEffect, useState } from "react";

import Dice from "./dice";

import { gameData } from "@/gameServices/gameService";
import { player } from "@/gameServices/roomService";
import { uuid } from "uuidv4";

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

  const handleScoreSelect = (score: string) => {
    props.updateReq({ type: "score-select", score: score });
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

  return (
    <>
      <Dice results={result} dice={props.game.dice} />
      <div style={{ position: "absolute", top: " 2%", left: "2%" }}>
        {props.game.players.map((p) => {
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                fontSize: "2rem",
              }}
            >
              <span>{p.name}</span>
              <span>{p.points}</span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: "50%" }}>
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
              className="button"
              disabled={!props.game.canRoll}
              style={{ zIndex: "7", margin: "2rem" }}
              onClick={() => {
                props.updateReq({ type: "new-roll" });
              }}
            >
              {props.game.canFork ? `Fork` : `Roll ${props.game.dice} dice`}
            </button>
            {(props.game.canFork && (
              <button
                className="button"
                onClick={() => {
                  props.updateReq({ type: "pass-fork" });
                }}
              >
                Pass
              </button>
            )) || (
              <button
                onClick={() => {
                  props.updateReq({ type: "keep" });
                }}
                className="button"
                disabled={!props.game.canKeep}
              >
                Keep
              </button>
            )}
            {props.game.rollingPlayerId === props.player.id && (
              <button
                className="button"
                onClick={() => {
                  props.updateReq({ type: "bust" });
                }}
              >
                Bust
              </button>
            )}
            <button
              onClick={() => {
                props.updateReq({ type: "skip" });
              }}
              className="button"
            >
              skip
            </button>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {props.game.scorables.map((el) => {
                if (typeof el === "string") {
                  return (
                    <button
                      key={uuid()}
                      className="button"
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
    </>
  );
};
