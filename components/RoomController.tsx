import { player, room } from "@/gameServices/roomService";
import { useEffect } from "react";
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
        {gameSessionId && (
          <button
            className="button"
            onClick={() => rejoinSession(gameSessionId as string)}
          >
            rejoin
          </button>
        )}
        <form onSubmit={(e) => createRoom(e)}>
          <input
            className="input"
            type="text"
            name="room_name"
            autoComplete="off"
          ></input>
          <button className="button">make room</button>
        </form>
      </section>
    )
  );
};
