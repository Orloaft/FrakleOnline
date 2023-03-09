import roomService from "@/gameServices/roomService";
import { Server } from "Socket.IO";

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      socket.on("create-room", (host, name) => {
        roomService.createRoom(host, name);
        io.emit("update-rooms", roomService.showRooms());
      });
    });
  }

  res.end();
};

export default SocketHandler;
