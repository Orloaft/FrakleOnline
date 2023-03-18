import roomService, { player, room } from "@/gameServices/roomService";
import { useEffect, useState } from "react";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import axios from "axios";
import { Room } from "./Room";
import { gameData, playerData } from "@/gameServices/gameService";
import { RollInterface } from "./RollInterface";

import { io, Socket } from "socket.io-client";
import { GameOver } from "./GameOver";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
export const RoomInterface = (props: { user: player }) => {
  const [room, setRoom] = useState<any>(false);
  const [game, setGame] = useState<gameData>();
  useEffect(() => {
    socketInitializer();
    socket && socket.emit("get-rooms");
  }, []);
  const [rooms, setRooms] = useState<room[]>([]);

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
            setGame(res);
          });
          socket.on(`update-room`, (room: room) => {
            setRoom(room);
          });
          socket.on(`game-start`, (game: gameData) => {
            setGame(game);
          });
        });
      })
      .catch((err) => err);
  };
  const updateReq = (req: any) => {
    socket.emit(
      "game-update",
      {
        ...req,
        game: game,
      },
      room.id
    );
  };
  if (game && game.concluded) {
    return (
      <GameOver
        winner={game.players.find((p: playerData) => p.points === 10000)}
      />
    );
  }
  return (
    (game && (
      <RollInterface
        game={game}
        player={props.user}
        updateReq={updateReq}
        roomId={room.id}
      />
    )) ||
    (room && room.players.find((p: player) => p.id === props.user.id) && (
      <>
        <Room room={room} />
        <button
          className="button"
          onClick={() => {
            socket.emit("leave-room", room.id, props.user);
          }}
        >
          Leave
        </button>
        {room.host.id === props.user.id && (
          <button
            className="button"
            onClick={() => {
              socket.emit("start-game", room);
            }}
          >
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
                onClick={() => {
                  socket.emit("join-room", room.id, props.user);
                }}
              >
                {room.name}
              </li>
            );
          })}
        </ul>
        <button className="button" onClick={() => socket.emit("get-rooms")}>
          refresh
        </button>
        <form
          onSubmit={(e: any) => {
            e.preventDefault();

            socket.emit("create-room", props.user, e.target.room_name.value);
            e.target.room_name.value = "";
          }}
        >
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
