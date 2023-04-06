import { useEffect, useState } from "react";

import Dice from "./dice";

import { gameData, playerData } from "@/gameServices/gameService";
import { player } from "@/gameServices/roomService";
import { uuid } from "uuidv4";
import { GameLog } from "./GameLog";
import ScoreAnimation from "./ScoreAnimation";

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
  game: any;
  player: player;
  updateReq: (req: any) => void;
}) => {
  const [showLog, setShowLog] = useState<boolean>(false);
  const handleScoreSelect = (score: string) => {
    props.updateReq({ type: "score-select", score: score });
  };
  useEffect(() => {
    props.game.isRolling && rollDice(props.game.currentRoll);
  }, [props.game.currentRoll]);
  useEffect(() => {
    if (props.game.currentRoll.length > 0) pluckDice(props.game.currentRoll);
  }, [props.game.currentRoll]);
  let currentPlayer = props.game.players.find(
    (p: playerData) => p.id === props.game.rollingPlayerId
  );

  return (
    <>
      <div className="currentScore">
        <span>{currentPlayer && currentPlayer.name}</span>{" "}
        <span>Score: {props.game.currentScore}</span>
      </div>
      <Dice results={props.game.currentRoll} dice={props.game.dice} />
      <ScoreAnimation score={props.game.lastPick} />
      <div
        style={{
          position: "absolute",
          top: " 2%",
          left: "2%",
          display: "flex",
          flexDirection: "column",
          maxHeight: "50%",
        }}
      >
        <div style={{ overflow: "scroll" }}>
          {props.game.players.map((p: playerData) => {
            return (
              <div
                key={p.id}
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
          {showLog && <GameLog log={props.game.log} />}
        </div>
        <button
          className="button"
          onClick={() => {
            setShowLog(!showLog);
          }}
        >
          Log
        </button>
      </div>

      <div style={{ position: "absolute", top: "50%" }}>
        {props.game.rollingPlayerId === props.player.id && (
          <>
            {(props.game.canFork && (
              <>
                <span>Fork?</span>
                <button
                  onClick={() => {
                    props.updateReq({ type: "new-roll" });
                  }}
                  className="button"
                >
                  yes
                </button>
                <button
                  onClick={() => {
                    props.updateReq({ type: "pass-fork" });
                  }}
                  className="button"
                >
                  no
                </button>
              </>
            )) || (
              <>
                <button
                  className="button"
                  disabled={!props.game.canRoll}
                  style={{ zIndex: "7", margin: "2rem" }}
                  onClick={() => {
                    props.updateReq({ type: "new-roll" });
                  }}
                >
                  Roll {props.game.dice} dice
                </button>

                <button
                  onClick={() => {
                    props.updateReq({ type: "keep" });
                  }}
                  className="button"
                  disabled={!props.game.canKeep}
                >
                  Keep
                </button>
              </>
            )}
            {props.game.rollingPlayerId === props.player.id && (
              <button
                className="button"
                onClick={() => {
                  props.updateReq({ type: "skip" });
                }}
              >
                End turn
              </button>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {props.game.scorables.map((el: string) => {
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
