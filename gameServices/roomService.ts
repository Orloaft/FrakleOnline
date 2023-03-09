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

const rooms: room[] = [];

function roomService() {
  return {
    createRoom: (host: player, name: string) => {
      rooms.push({ id: uuid(), name: name, players: [host], host: host });
    },
    showRooms: () => {
      return rooms;
    },
    deleteRoom: (id: string) => {
      rooms.filter((room) => room.id !== id);
    },
    joinRoom: (id: string, player: player) => {
      rooms.find((room) => room.id === id)?.players.push(player);
    },
  };
}
export default roomService();
