import { room } from "@/gameServices/roomService";
import { useEffect, useState } from "react";
import io, { Socket } from "Socket.IO-client";

import { DefaultEventsMap } from "@socket.io/component-emitter";
import axios from "axios";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
export const RoomInterface = () => {
  useEffect(() => socketInitializer(), []);
  const [rooms, setRooms] = useState<room[]>([]);
  const socketInitializer = () => {
    axios
      .get("/api/socket")
      .then(() => {
        socket = io();

        socket.on("connect", () => {
          console.log("connected");
          socket.on(`update-rooms`, (rooms) => {
            setRooms(rooms);
          });
        });
      })
      .catch((err) => err);
  };
  return (
    <section>
      <h1>Rooms:</h1>
      <ul>
        {rooms.map((room) => {
          return <li>{room.name}</li>;
        })}
      </ul>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          let user = localStorage.getItem("user");
          user &&
            socket.emit(
              "create-room",
              JSON.parse(user),
              e.target.room_name.value
            );
          e.target.room_name.value = "";
        }}
      >
        <input type="text" name="room_name"></input>
        <button>make room</button>
      </form>
    </section>
  );
};
