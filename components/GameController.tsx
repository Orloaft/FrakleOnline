import { playerData } from "@/services/gameService";
import { player } from "@/services/roomService";
import { useState } from "react";
import { GameLog } from "./GameLog";
import { GameOver } from "./GameOver";
import { RollInterface } from "./RollInterface";

export const GameController = ({
  game,
  user,
  timer,
  setRoom,
}: {
  game: any;
  user: player;
  timer: number;
  setRoom: any;
}) => {
  const [showLog, setShowLog] = useState<boolean>(false);
  return (
    <>
      {(game.concluded && (
        <>
          <GameOver
            setRoom={setRoom}
            winner={game.players.find((p: playerData) => p.points === 10000)}
          />
          {showLog && <GameLog log={game.log} />}
          <button
            className="button"
            onClick={() => {
              setShowLog(!showLog);
            }}
          >
            Log
          </button>
        </>
      )) || <RollInterface game={game} player={user} timer={timer} />}
    </>
  );
};
