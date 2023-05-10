import { GameType, player, room } from "@/services/roomService";
import { validateName } from "@/utils/validateUtils";

import CheckBox from "./CheckBox";

import { RoomView } from "./RoomView";
import { useState } from "react";
import RulesPage from "@/pages/rules";

export const RoomController = (props: {
  room: room;
  rooms: room[];
  user: player;
  leaveRoom: () => void;
  joinRoom: (id: string) => void;
  createRoom: (e: any, isPrivate: boolean) => void;
  getRooms: () => void;
  rejoinSession: (gameSessionId: string) => void;
  onGameModeChange: (mode: GameType) => void;
}) => {
  let {
    room,
    rooms,
    user,
    leaveRoom,
    joinRoom,
    createRoom,
    getRooms,
    rejoinSession,
    onGameModeChange,
  } = props;
  let gameSessionId = sessionStorage.getItem("gameSessionId");
  const [isPrivate, setIsPrivate] = useState(false);

  const [message, setMessage] = useState<string>("");
  const [tutorial, setTutorial] = useState<boolean>(false);
  return (
    (room && room.players.find((p: player) => p.id === user.id) && (
      <RoomView
        room={room}
        onGameModeChange={onGameModeChange}
        leaveRoom={leaveRoom}
        user={props.user}
      />
    )) ||
    (tutorial && <RulesPage setTutorial={setTutorial} />) || (
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
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
            }}
            className="button"
            onClick={() => {
              setTutorial(true);
            }}
          >
            <span>How to play</span>
          </div>
        </form>
      </section>
    )
  );
};
