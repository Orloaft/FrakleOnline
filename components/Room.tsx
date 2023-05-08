import { GameType, room } from "@/services/roomService";
import { Chat } from "./Chat";
import { GameModeInput } from "./inputs/GameMode";

export const Room = (props: {
  room: room | boolean;

  onGameModeChange: (mode: GameType) => void;
}) => {
  return (
    (typeof props.room === "object" && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100vw",
          position: "absolute",
          top: 0,
          alignItems: "center",
        }}
      >
        <Chat messages={props.room.chat} />
        <ul>
          <span>Players:</span>
          {props.room.players.map((p) => {
            return (
              <li key={p.id} className="room_player">
                <span>{p.name}</span>
              </li>
            );
          })}
        </ul>
        <GameModeInput
          mode={props.room.gameRules}
          onGameModeChange={props.onGameModeChange}
        />
      </div>
    )) || <></>
  );
};
