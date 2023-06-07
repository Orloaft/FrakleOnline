import { useContext, useEffect, useState } from "react";
import Dice from "./dice";
import { playerData } from "@/services/gameService";
import { player } from "@/services/roomService";
import { uuid } from "uuidv4";
import { GameLog } from "./GameLog";
import ScoreAnimation from "./ScoreAnimation";
import PopUpText from "./PopUpText";
import UpdateContext from "./context/updateContext";
import { Howl } from "howler";

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
export const RollInterface = ({
  game,
  player,
  timer,
}: {
  game: any;
  player: player;
  timer: number;
}) => {
  const updateRequest = useContext(UpdateContext);
  const [showLog, setShowLog] = useState<boolean>(false);
  const handleScoreSelect = (score: string) => {
    updateRequest && updateRequest({ type: 2, score: score });
  };
  const loadSoundEffect = () => {
    return new Howl({
      src: ["/notification_simple-02.ogg"], // Update the path and filename according to your project structure
      preload: true,
    });
  };

  useEffect(() => {
    game.isRolling && rollDice(game.currentRoll);
  }, [game.currentRoll, game.isRolling]);
  useEffect(() => {
    if (game.currentRoll.length > 0) pluckDice(game.currentRoll);
  }, [game.currentRoll]);
  let currentPlayer = game.players.find(
    (p: playerData) => p.id === game.rollingPlayerId
  );
  useEffect(() => {
    const soundEffect = loadSoundEffect();
    if (game.rollingPlayerId === player.id) {
      soundEffect.play();
    }
  }, [game.rollingPlayerId, player.id]);
  return (
    <>
      <div className="currentScore">
        <span>{currentPlayer && currentPlayer.name}</span>{" "}
        <span>Score: {game.currentScore}</span>
        <span style={{ fontSize: "1rem" }}>
          {" "}
          {10000 - (game.currentScore + currentPlayer.points)} left
        </span>
        {timer && <span>{11 - timer}</span>}
      </div>
      <Dice results={game.currentRoll} dice={game.dice} />
      <ScoreAnimation score={game.lastPick} />
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
          {game.players.map((p: playerData) => {
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
          {showLog && <GameLog log={game.log} />}
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
        {(!game.alert && game.rollingPlayerId === player.id && (
          <>
            {(game.canFork && (
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
                {game.currentScore + currentPlayer.points !== 10000 && (
                  <button
                    className="button"
                    disabled={!game.canRoll}
                    style={{ zIndex: "7", margin: "2rem" }}
                    onClick={() => {
                      updateRequest && updateRequest({ type: 1 });
                    }}
                  >
                    Roll {game.dice} dice
                  </button>
                )}
                <button
                  onClick={() => {
                    updateRequest && updateRequest({ type: 3 });
                  }}
                  className="button"
                  disabled={!game.canKeep}
                >
                  Keep
                </button>
              </>
            )}
            {game.rollingPlayerId === player.id &&
              !game.canFork &&
              !game.canRoll &&
              !game.canKeep &&
              !game.scorables.length && (
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
              {game.scorables.map((el: string) => {
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
        )) || <PopUpText text={game.alert} />}
      </div>
    </>
  );
};
