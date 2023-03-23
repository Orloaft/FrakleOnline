import { player, room } from "@/gameServices/roomService";
import { validateName } from "@/utils/validateUtils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Room } from "./Room";

export const RoomController = (props: {
  room: room;
  rooms: room[];
  user: player;
  leaveRoom: () => void;
  startGame: () => void;
  joinRoom: (id: string) => void;
  createRoom: (e: any) => void;
  getRooms: () => void;
  rejoinSession: (gameSessionId: string) => void;
}) => {
  let {
    room,
    rooms,
    user,
    leaveRoom,
    startGame,
    joinRoom,
    createRoom,
    getRooms,
    rejoinSession,
  } = props;
  let gameSessionId = sessionStorage.getItem("gameSessionId");
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    if (gameSessionId) {
      rejoinSession(gameSessionId);
    }
  }, []);
  return (
    (room && room.players.find((p: player) => p.id === user.id) && (
      <>
        <Room room={room} />
        <button className="button" onClick={leaveRoom}>
          Leave
        </button>
        {room.host.id === props.user.id && (
          <button className="button" onClick={startGame}>
            Start game
          </button>
        )}
      </>
    )) || (
      <section>
        <ul>
          {rooms.map((room) => {
            return (
              <li
                key={room.id}
                className="li"
                onClick={() => joinRoom(room.id)}
              >
                {room.name}
              </li>
            );
          })}
        </ul>
        <button className="button" onClick={getRooms}>
          refresh
        </button>
        <span> {message}</span>
        {gameSessionId && (
          <button
            className="button"
            onClick={() => rejoinSession(gameSessionId as string)}
          >
            rejoin
          </button>
        )}
        <form
          onSubmit={(e: any) => {
            e.preventDefault();
            if (validateName(e.target.room_name.value) === "valid") {
              createRoom(e);
            } else {
              setMessage(validateName(e.target.room_name.value));
            }
          }}
        >
          <input
            className="input"
            type="text"
            name="room_name"
            autoComplete="off"
          ></input>

          <button className="button">make room</button>
          <Link
            style={{
              textDecoration: "none",
              position: "absolute",
              top: 5,
              right: 5,
            }}
            href="/rules"
            className="button"
          >
            <span>How to play</span>
          </Link>
        </form>
      </section>
    )
  );
};
