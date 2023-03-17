import gameService, { playerData } from "@/gameServices/gameService";
import roomService, { player } from "@/gameServices/roomService";
import { addToScore, diceRoll } from "@/utils/diceUtils";
import { Server } from "Socket.IO";

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
        let player = res.players.find(
          (p: playerData) => p.id === res.rollingPlayerId
        );
        switch (req.type) {
          case "new-roll":
            res.currentRoll = diceRoll(res.dice);
            break;
          case "score-select":
            let { newRoll, newScore } = addToScore(req.score, res.currentRoll);

            res.currentRoll = newRoll;
            res.currentScore += newScore;
            res.dice = res.currentRoll.length;
            if (res.dice === 0) {
              res.dice = 6;
            }
            break;
          case "keep":
            player.points += res.currentScore;
            res.currentScore = 0;
            if (res.players.indexOf(player) < res.players.length - 1) {
              res.rollingPlayerId =
                res.players[res.players.indexOf(player) + 1].id;
            } else {
              res.rollingPlayerId = res.players[0].id;
            }
            res.dice = 6;
            break;
          case "bust":
            player = res.players.find(
              (p: playerData) => p.id === res.rollingPlayerId
            );
            res.currentScore = 0;
            res.dice = 6;
            if (res.players.indexOf(player) < res.players.length - 1) {
              res.rollingPlayerId =
                res.players[res.players.indexOf(player) + 1].id;
            } else {
              res.rollingPlayerId = res.players[0].id;
            }
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
