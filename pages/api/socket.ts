import gameService, { playerData } from "@/gameServices/gameService";
import roomService, { player } from "@/gameServices/roomService";
import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import { Server } from "socket.io";

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
      socket.on("create-room", (host: player, name: string) => {
        roomService.createRoom(host, name, socket.id);
        socket.join(socket.id);
        io.emit("update-rooms", roomService.showRooms());
        io.to(socket.id).emit("update-room", roomService.getRoom(socket.id));
      });
      socket.on("join-room", (id: string, player: player) => {
        socket.join(id);
        roomService.joinRoom(id, player);

        io.to(id).emit("update-room", roomService.getRoom(id));
      });
      socket.on("game-update", (req, id) => {
        let res = { ...req.game };

        switch (req.type) {
          case "skip":
            res = gameService.skipTurn(res.id);
            break;
          case "new-roll":
            res = gameService.newRoll(res.id);
            break;
          case "score-select":
            res = gameService.scoreSelect(res.id, req.score);
            break;
          case "keep":
            res = gameService.keep(res.id);

            break;
          case "pass-fork":
            res = gameService.passFork(res.id);
            break;
          case "bust":
            res = gameService.bust(res.id);
            break;
        }

        io.to(id).emit("game-update-response", res);
      });
      socket.on("leave-room", (id: string, player: player) => {
        roomService.leaveRoom(id, player);
        !roomService.getRoom(id) &&
          io.emit("update-rooms", roomService.showRooms());
        io.to(id).emit("update-room", roomService.getRoom(id));
      });
      socket.on("start-game", (room) => {
        gameService.createGame(room);
        console.log("starting game");
        io.to(room.id).emit("game-start", gameService.getGame(room.id));
        console.log(gameService.getGame(room.id));
      });
    });
  }

  res.end();
};

export default SocketHandler;
