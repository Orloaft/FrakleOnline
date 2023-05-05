import gameService, { gameData, playerData } from "@/services/gameService";
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
      socket.on(
        "send_room_message",
        (id: string, player: player | playerData, msg: string) => {
          roomService.sendMessage(id, player, msg);
          io.to(id).emit("update-room", roomService.getRoom(id));
        }
      );
      socket.on(
        "send_game_message",
        (id: string, player: player | playerData, msg: string) => {
          gameService.sendMessage(id, player, msg);

          io.to(id).emit("update-chat", gameService.getGame(id).chat);
        }
      );
      socket.on("join-room", (id: string, player: player) => {
        socket.join(id);
        roomService.joinRoom(id, player);

        io.to(id).emit("update-room", roomService.getRoom(id));
      });
      socket.on("game-update", (req) => {
        let res;

        switch (req.type) {
          case "skip":
            res = gameService.nextTurn(req.id);
            break;
          case "new-roll":
            res = gameService.newRoll(req.id) as gameData;
            break;
          case "score-select":
            res = gameService.scoreSelect(req.id, req.score);
            break;
          case "keep":
            res = gameService.keep(req.id);
            break;
          case "pass-fork":
            res = gameService.passFork(req.id);
            break;
        }

        io.to(req.id).emit("game-update-response", res);
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
        io.to(id).emit("game-update-response", gameService.getGame(id));
      });
      socket.on("start-game", (room) => {
        gameService.createGame(room);
        console.log("starting game");
        io.to(room.id).emit("game-start", gameService.getGame(room.id));
        roomService.deleteRoom(room.id);
        io.emit("update-rooms", roomService.showRooms());
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
