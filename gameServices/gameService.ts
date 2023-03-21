import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import roomService, { player, room } from "./roomService";
export interface playerData extends player {
  points: number;
  dice: number;
}
export interface gameData extends room {
  canRoll: boolean | undefined;
  players: playerData[];
  rollingPlayerId: string;
  currentRoll: number[];
  dice: number;
  currentScore: number;
  scorables: any[];
  canKeep: boolean;
  canFork: boolean;
  concluded: boolean;
  log: string[];
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
        canRoll: true,
        log: [],
      });
    },
    nextTurn: (gameId: string) => {
      let game = games.find((g) => g.id === gameId);
    },
    newRoll: (gameId: string) => {
      let game = games.find((g) => g.id === gameId);
      if (game) {
        game.canRoll = false;
        game.canFork = false;
        game.currentRoll = diceRoll(game.dice);
        game.scorables = computeResult(game.currentRoll);
        if (game.scorables.length === 0) {
          game.canKeep = false;
        }
        game.log.unshift(game.currentRoll.toString());
        return game;
      }
    },
    scoreSelect: (gameId: string, score: any) => {
      let game = games.find((g) => g.id === gameId) as gameData;

      if (game) {
        let player = game.players.find(
          (p: playerData) => p.id === game.rollingPlayerId
        ) as playerData;
        let { newRoll, newScore } = addToScore(score, game.currentRoll);
        game.scorables = computeResult(newRoll);
        game.log.unshift(player.name + ` picks: ` + score);
        game.currentRoll = newRoll;
        game.currentScore += newScore;
        game.dice = game.currentRoll.length;
        if (game.dice === 0) {
          game.dice = 6;
        }
        game.canRoll = true;
        game.canKeep = true;

        if (player && player.points + game.currentScore === 10000) {
          game.scorables.length && (game.canKeep = false);
        }
        player &&
          player.points + game.currentScore > 10000 &&
          (game.canKeep = false);
      }
      return game;
    },
    passFork: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      game.canFork = false;
      game.dice = 6;
      game.currentScore = 0;
      return game;
    },
    keep: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;

      let player = game.players.find(
        (p: playerData) => p.id === game.rollingPlayerId
      ) as playerData;
      if (player.points > 0 || game.currentScore >= 500) {
        if (player.points + game.currentScore <= 10000) {
          player.points += game.currentScore;
          game.log.unshift(
            player.name + " kept " + game.currentScore + " points"
          );
        }
      }
      if (player.points === 10000) {
        game.concluded = true;
        roomService.deleteRoom(game.id);
      }
      if (game.players.indexOf(player) < game.players.length - 1) {
        game.rollingPlayerId =
          game.players[game.players.indexOf(player) + 1].id;
        player = game.players[game.players.indexOf(player) + 1];
      } else {
        game.rollingPlayerId = game.players[0].id;
        player = game.players[0];
      }
      if (player.points > 0) {
        game.canFork = true;
      } else {
        game.dice = 6;
        game.currentScore = 0;
      }
      game.currentRoll = [];
      game.canKeep = false;
      game.scorables = [];

      return game;
    },
    skipTurn: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      let player = game.players.find(
        (p: playerData) => p.id === game.rollingPlayerId
      ) as playerData;
      if (game.players.indexOf(player) < game.players.length - 1) {
        game.rollingPlayerId =
          game.players[game.players.indexOf(player) + 1].id;
      } else {
        game.rollingPlayerId = game.players[0].id;
      }
      game.canRoll = true;
      game.canFork = false;
      game.dice = 6;
      game.scorables = [];
      game.log.unshift(player.name + " was skipped");
      return game;
    },
    endGame: (gameId: string) => {},
    bust: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;

      let player = game.players.find(
        (p: playerData) => p.id === game.rollingPlayerId
      ) as playerData;
      game.currentScore = 0;
      game.dice = 6;
      game.currentRoll = [];
      if (game.players.indexOf(player) < game.players.length - 1) {
        game.rollingPlayerId =
          game.players[game.players.indexOf(player) + 1].id;
      } else {
        game.rollingPlayerId = game.players[0].id;
      }
      game.scorables = [];
      game.canRoll = true;
      game.log.unshift("bust!");
      return game;
    },
    removePlayer: (gameId: string, playerID: string) => {},
    getGame: (id: string) => {
      let game: gameData = games.find((g) => g.id === id) as gameData;

      return game;
    },
  };
}

export default gameService();
