import { useContext, useEffect, useState } from "react";
import Dice from "./dice";
import { playerData } from "@/services/gameService";
import { player } from "@/services/roomService";
import { uuid } from "uuidv4";
import { GameLog } from "./GameLog";
import ScoreAnimation from "./ScoreAnimation";
import PopUpText from "./PopUpText";
import UpdateContext from "./context/updateContext";

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
  timer: number;
}) => {
  const updateRequest = useContext(UpdateContext);
  const [showLog, setShowLog] = useState<boolean>(false);
  const handleScoreSelect = (score: string) => {
    updateRequest && updateRequest({ type: 2, score: score });
  };
  useEffect(() => {
    props.game.isRolling && rollDice(props.game.currentRoll);
  }, [props.game.currentRoll, props.game.isRolling]);
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
        <span style={{ fontSize: "1rem" }}>
          {" "}
          {10000 - (props.game.currentScore + currentPlayer.points)} left
        </span>
        {props.timer && <span>{11 - props.timer}</span>}
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
        {(!props.game.alert &&
          props.game.rollingPlayerId === props.player.id && (
            <>
              {(props.game.canFork && (
                <>
                  <span>Fork?</span>
                  <button
                    onClick={() => {
                      updateRequest && updateRequest({ type: 1 });
                    }}
                    className="button"
                  >
                    yes
                  </button>
                  <button
                    onClick={() => {
                      updateRequest && updateRequest({ type: 6 });
                    }}
                    className="button"
                  >
                    no
                  </button>
                </>
              )) || (
                <>
                  {props.game.currentScore + currentPlayer.points !== 10000 && (
                    <button
                      className="button"
                      disabled={!props.game.canRoll}
                      style={{ zIndex: "7", margin: "2rem" }}
                      onClick={() => {
                        updateRequest && updateRequest({ type: 1 });
                      }}
                    >
                      Roll {props.game.dice} dice
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateRequest && updateRequest({ type: 3 });
                    }}
                    className="button"
                    disabled={!props.game.canKeep}
                  >
                    Keep
                  </button>
                </>
              )}
              {props.game.rollingPlayerId === props.player.id &&
                !props.game.canFork &&
                !props.game.canRoll &&
                !props.game.canKeep &&
                !props.game.scorables.length && (
                  <button
                    className="button"
                    onClick={() => {
                      updateRequest && updateRequest({ type: 5 });
                    }}
                  >
                    End turn
                  </button>
                )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
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
          )) || <PopUpText text={props.game.alert} />}
      </div>
    </>
  );
};
