import { GameStateReducer, actionRequest } from "@/services/GameState";
import roomService, { GameType, player } from "@/services/roomService";

import { Server } from "socket.io";
import { uuid } from "uuidv4";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("get-rooms", () => {
        io.to(socket.id).emit("update-rooms", roomService.showRooms());
      });
      socket.on(
        "create-room",
        (host: player, name: string, isPrivate: boolean) => {
          let roomId = uuid();
          roomService.createRoom(host, name, roomId, isPrivate);
          socket.join(roomId);
          io.emit("update-rooms", roomService.showRooms());
          io.to(socket.id).emit("update-room", roomService.getRoom(roomId));
        }
      );
      socket.on("toggle_game_mode", (id: string, mode: GameType) => {
        roomService.setMode(id, mode);
        io.to(id).emit("update-room", roomService.getRoom(id));
      });

      socket.on("join-room", (id: string, player: player) => {
        socket.join(id);
        roomService.joinRoom(id, player);
        io.to(id).emit("update-room", roomService.getRoom(id));
      });
      socket.on("game-update", (req: actionRequest) => {
        req.io = io;
        io.to(req.roomId).emit(
          "game-update-response",
          GameStateReducer.handleAction(req)
        );
      });
      socket.on("leave-room", (id: string, player: player) => {
        roomService.leaveRoom(id, player);
        !roomService.getRoom(id) &&
          io.emit("update-rooms", roomService.showRooms());
        io.to(id).emit("update-room", roomService.getRoom(id));
      });
      socket.on("rejoin-session", (id) => {
        socket.join(id);
        console.log("rejoined" + id);
        io.to(id).emit("game-update-response", GameStateReducer.getGame(id));
      });

      socket.on("find_room", (roomid: string) => {
        let room = roomService.getRoom(roomid);
        (room && socket.join(roomid)) ||
          io
            .to(socket.id)
            .emit("find_room_res", "sorry the room no longer exists");
      });
    });
  }

  res.end();
};

export default SocketHandler;
