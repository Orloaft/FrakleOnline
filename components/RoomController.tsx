import { player, room } from "@/gameServices/roomService";
import { validateName } from "@/utils/validateUtils";
import Link from "next/link";
import { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import CopyLinkAlert from "./CopyLinkAlert";
import { Room } from "./Room";

export const RoomController = (props: {
  room: room;
  rooms: room[];
  user: player;
  leaveRoom: () => void;
  startGame: () => void;
  joinRoom: (id: string) => void;
  createRoom: (e: any, isPrivate: boolean) => void;
  getRooms: () => void;
  rejoinSession: (gameSessionId: string) => void;
  sendMessage: (msg: string) => void;
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
    sendMessage,
  } = props;
  let gameSessionId = sessionStorage.getItem("gameSessionId");
  const [isPrivate, setIsPrivate] = useState(false);

  const [message, setMessage] = useState<string>("");

  return (
    (room && room.players.find((p: player) => p.id === user.id) && (
      <>
        <Room sendMessage={sendMessage} room={room} />
        <button className="button" onClick={leaveRoom}>
          Leave
        </button>
        {room.host.id === props.user.id && (
          <>
            {" "}
            <button className="button" onClick={startGame}>
              Start game
            </button>
            <CopyLinkAlert
              link={
                "https://" +
                process.env.NEXT_PUBLIC_SERVER_URL +
                "/invite/" +
                room.id
              }
            />
          </>
        )}
      </>
    )) || (
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ul>
          {rooms.map((room) => {
            if (!room.isPrivate) {
              return (
                <li
                  key={room.id}
                  className="li"
                  onClick={() => joinRoom(room.id)}
                >
                  {room.name}
                </li>
              );
            }
          })}
        </ul>
        <button className="button" onClick={getRooms}>
          refresh
        </button>
        <span> {message}</span>
        {gameSessionId && (
          <>
            <button
              className="button"
              onClick={() => rejoinSession(gameSessionId as string)}
            >
              rejoin
            </button>
            <button
              className="button"
              onClick={() => {
                sessionStorage.removeItem("gameSessionId");
                setMessage("match abandoned");
              }}
            >
              leave room
            </button>
          </>
        )}
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onSubmit={(e: any) => {
            e.preventDefault();
            if (validateName(e.target.room_name.value) === "valid") {
              createRoom(e, isPrivate);
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
            placeholder="room name"
          ></input>

          <button className="button">make room</button>
          <CheckBox isPrivate={isPrivate} setIsPrivate={setIsPrivate} />
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
