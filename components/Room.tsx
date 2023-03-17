import { room } from "@/gameServices/roomService";

export const Room = (props: { room: room | boolean }) => {
  return (
    (typeof props.room === "object" && (
      <div>
        <ul>
          {props.room.players.map((p) => {
            return (
              <li key={p.id} className="room_player">
                {p.name}
              </li>
            );
          })}
        </ul>
      </div>
    )) || <></>
  );
};
