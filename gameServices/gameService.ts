import { player, room } from "./roomService";
export interface playerData extends player {
  points: number;
  dice: number;
}
export interface gameData extends room {
  players: playerData[];
  rollingPlayerId: string;
  currentRoll: number[];
  dice: number;
  currentScore: number;
  scorables: string[];
  canKeep: boolean;
  canFork: boolean;
  concluded: boolean;
}
let games: gameData[] = [];
function gameService() {
  return {
    createGame: (r: room) => {
      let playerArray: playerData[] = r.players.map((p) => {
        return { ...p, points: 0, dice: 0 };
      });
      games.push({
        ...r,
        players: playerArray,
        rollingPlayerId: r.host.id,
        currentRoll: [],
        dice: 6,
        currentScore: 0,
        scorables: [],
        canKeep: false,
        canFork: false,
        concluded: false,
      });
    },
    // nextTurn: (gameId: string) => {
    //   let game = games.find((g) => g.id === gameId);
    //   game && (game.rollingPlayerId = playerId);
    // },
    getGame: (id: string) => {
      return games.find((g) => g.id === id);
    },
  };
}

export default gameService();
