import { gameData, playerData } from "@/gameServices/gameService";
import { player } from "@/gameServices/roomService";
import { useState } from "react";
import { GameLog } from "./GameLog";
import { GameOver } from "./GameOver";
import { RollInterface } from "./RollInterface";

export const GameController = (props: {
  game: gameData;
  user: player;
  updateReq: (req: any) => void;
}) => {
  const [showLog, setShowLog] = useState<boolean>(false);
  return (
    <>
      {(props.game.concluded && (
        <>
          <GameOver
            winner={props.game.players.find(
              (p: playerData) => p.points === 10000
            )}
          />
          {showLog && <GameLog log={props.game.log} />}
          <button
            className="button"
            onClick={() => {
              setShowLog(!showLog);
            }}
          >
            Log
          </button>
        </>
      )) || (
        <RollInterface
          game={props.game}
          player={props.user}
          updateReq={props.updateReq}
        />
      )}
    </>
  );
};