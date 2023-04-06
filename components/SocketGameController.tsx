import { player, room } from "@/gameServices/roomService";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import axios from "axios";
import { gameData } from "@/gameServices/gameService";
import { io, Socket } from "socket.io-client";
import { GameController } from "./GameController";
import { RoomController } from "./RoomController";
import { Chat } from "./Chat";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
export const SocketGameController = (props: {
  user: player;
  roomid?: string;
}) => {
  const [room, setRoom] = useState<any>(false);
  const [game, setGame] = useState<any>();
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
            setGame(res.data);
          });
          socket.on(`update-room`, (room: room) => {
            setRoom(room);
          });
          socket.on(`update-chat`, (chat: string[]) => {
            setChat(chat);
          });
          socket.on(`game-start`, (game: gameData) => {
            sessionStorage.setItem("gameSessionId", game.id);
            sessionStorage.setItem("userData", JSON.stringify(props.user));
            setGame(game.data);
            setChat(game.chat);
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
      id: room.id,
    });
  };
  const leaveRoom = () => {
    socket.emit("leave-room", room.id, props.user);
  };
  const startGame = () => {
    socket.emit("start-game", room);
  };
  const sendMessage = (msg: string) => {
    if (game) {
      msg.length && socket.emit("send_game_message", room.id, props.user, msg);
    } else {
      msg.length && socket.emit("send_room_message", room.id, props.user, msg);
    }
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
    (game && (
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
          <Chat messages={chat} sendMessage={sendMessage} />
        </div>
        <GameController game={game} user={props.user} updateReq={updateReq} />
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
        startGame={startGame}
        joinRoom={joinRoom}
        createRoom={createRoom}
        getRooms={getRooms}
        rejoinSession={rejoinSession}
        sendMessage={sendMessage}
      />
    )
  );
};
