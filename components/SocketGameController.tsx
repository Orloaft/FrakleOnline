import { GameType, player, room } from "@/services/roomService";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import axios from "axios";
import { gameData } from "@/services/gameService";
import { io, Socket } from "socket.io-client";
import { GameController } from "./GameController";
import { RoomController } from "./RoomController";
import { Chat } from "./Chat";
import UpdateContext from "./context/updateContext";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
export const SocketGameController = (props: {
  user: player;
  roomid?: string;
}) => {
  const [room, setRoom] = useState<any>(false);
  const [timer, setTimer] = useState<any>(null);
  const [rooms, setRooms] = useState<room[]>([]);
  const [chat, setChat] = useState<string[]>([]);

  useEffect(() => {
    socketInitializer();
    socket && socket.emit("get-rooms");
  }, []);

  const socketInitializer = () => {
    axios
      .get("/api/socket")
      .then(() => {
        socket = io();

        socket.on("connect", () => {
          socket.on(`update-rooms`, (rooms) => {
            setRooms(rooms);
          });
          socket.on("game-update-response", (res) => {
            console.log(res);
            if (res) {
              sessionStorage.setItem("gameSessionId", res.id);
              setRoom(res);
            } else {
              sessionStorage.removeItem("gameSessionId");
            }
          });
          socket.on(`update-room`, (room: room) => {
            setRoom(room);
          });
          socket.on(`update-chat`, (chat: string[]) => {
            setChat(chat);
          });
          socket.on("timer_update", (timer) => {
            setTimer(timer);
          });
        });
      })
      .catch((err) => err);
  };
  const rejoinSession = (gameSessionId: string) => {
    socket && socket.emit("rejoin-session", gameSessionId);
  };
  const updateReq = (req: any) => {
    socket.emit("game-update", {
      ...req,
      roomId: room.id,
      player: props.user,
    });
  };
  const leaveRoom = () => {
    socket.emit("leave-room", room.id, props.user);
  };

  const toggleMode = (mode: GameType) => {
    socket.emit("toggle_game_mode", room.id, mode);
  };
  const joinRoom = (id: string) => {
    socket && socket.emit("join-room", id, props.user);
  };
  const createRoom = (e: any, isPrivate: boolean) => {
    socket.emit("create-room", props.user, e.target.room_name.value, isPrivate);
    e.target.room_name.value = "";
  };
  const getRooms = () => {
    socket.emit("get-rooms");
  };

  return (
    <UpdateContext.Provider value={updateReq}>
      {(room && room.data && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: `100%`,
              zIndex: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Chat messages={chat} />
          </div>
          <GameController
            game={room.data}
            user={props.user}
            timer={timer}
            setRoom={setRoom}
          />
        </>
      )) ||
        (props.roomid && !room && (
          <button
            className="button"
            onClick={() => {
              joinRoom(props.roomid as string);
            }}
          >
            join room
          </button>
        )) || (
          <RoomController
            room={room}
            rooms={rooms}
            user={props.user}
            leaveRoom={leaveRoom}
            joinRoom={joinRoom}
            createRoom={createRoom}
            getRooms={getRooms}
            rejoinSession={rejoinSession}
            onGameModeChange={toggleMode}
          />
        )}{" "}
    </UpdateContext.Provider>
  );
};
