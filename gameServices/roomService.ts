import { uuid } from "uuidv4";

export interface player {
  id: string;
  name: string;
}

export interface room {
  id: string;
  name: string;
  players: player[];
  host: player;
}

let rooms: room[] = [];

function roomService() {
  return {
    createRoom: (host: player, name: string, socketId: string) => {
      rooms.push({ id: socketId, name: name, players: [host], host: host });
    },
    showRooms: () => {
      return rooms;
    },
    getRoom: (id: string) => {
      return rooms.find((r) => r.id === id);
    },
    deleteRoom: (id: string) => {
      rooms = rooms.filter((room) => room.id !== id);
    },
    joinRoom: (id: string, player: player) => {
      let room = rooms.find((r) => r.id === id);
      room && room.players.push(player);
    },
    leaveRoom: (id: string, player: player) => {
      let oldRoom = rooms.find((room) => room.id === id);

      if (oldRoom !== undefined) {
        oldRoom.players = oldRoom.players.filter((p) => p.id !== player.id);
        oldRoom.players.find((p) => p.id === oldRoom?.host.id) &&
          (oldRoom.host = oldRoom.players[0]);
        oldRoom.players.length === 0 &&
          (rooms = rooms.filter((r) => r.id !== id));
      }
    },
  };
}
export default roomService();
