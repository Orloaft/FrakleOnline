import { room } from "@/gameServices/roomService";
import { Chat } from "./Chat";

export const Room = (props: {
  room: room | boolean;
  sendMessage: (msg: string) => void;
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
        <Chat messages={props.room.chat} sendMessage={props.sendMessage} />
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
      </div>
    )) || <></>
  );
};
