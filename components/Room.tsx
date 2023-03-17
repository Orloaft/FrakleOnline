import { room } from "@/gameServices/roomService";

export const Room = (props: { room: room | boolean }) => {
  return (
    (typeof props.room === "object" && (
      <div>
        <span>{props.room.id}</span>
        <ul>
          {props.room.players.map((p) => {
            return <li key={p.id}>{p.name}</li>;
          })}
        </ul>
      </div>
    )) || <></>
  );
};
