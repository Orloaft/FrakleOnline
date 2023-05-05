import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import roomService, { player, room } from "./roomService";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export interface playerData extends player {
  points: number;
  dice: number;
}
export interface gameData extends room {
  timer?: number;
  data: {
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
    isRolling: boolean;
    lastPick: string[];
  };
}
let games: gameData[] = [];

function gameService() {
  return {
    createGame: (r: room) => {
      let playerArray: playerData[] = r.players.map((p) => {
        return { ...p, points: 0, dice: 0 };
      });
      switch (r.gameRules) {
        case 0:
          games.push({
            ...r,
            data: {
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
              isRolling: true,
              lastPick: [""],
            },
          });
        case 1:
          games.push({
            ...r,
            timer: 1,
            data: {
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
              isRolling: true,
              lastPick: [""],
            },
          });
      }
    },
    sendMessage: (gameId: string, player: player, msg: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      console.log(gameId, games);
      game.chat.unshift(player.name + ": " + msg);
    },
    setTimer: (
      io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
      id: string
    ) => {
      let game = games.find((g) => g.id === id) as gameData;

      setInterval(() => {
        game.gameRules === 1 && game.timer && (game.timer += 1);
        console.log(game.timer);
        io.to(id).emit("timer_update", game.timer);
      }, 1000);
    },
    nextTurn: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;

      let player = game.data.players.find(
        (p: playerData) => p.id === game.data.rollingPlayerId
      ) as playerData;
      game.data.dice = 6;
      game.data.lastPick.pop();
      game.data.currentScore = 0;
      if (game.data.players.indexOf(player) < game.data.players.length - 1) {
        game.data.rollingPlayerId =
          game.data.players[game.data.players.indexOf(player) + 1].id;
      } else {
        game.data.rollingPlayerId = game.data.players[0].id;
      }
      game.data.scorables = [];
      game.data.canRoll = true;
      return game;
    },
    newRoll: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      console.log(gameId, games);
      if (game) {
        game.data.lastPick.pop();
        game.data.isRolling = true;
        game.data.canRoll = false;
        game.data.canFork = false;
        game.data.currentRoll = diceRoll(game.data.dice);
        game.data.scorables = computeResult(game.data.currentRoll);
        if (game.data.scorables.length === 0) {
          game.data.canKeep = false;
          game.data.lastPick.pop();
          game.data.lastPick.push("BUST!");
          game.data.currentScore = 0;

          game.data.log.unshift("bust!");
        }
        game.data.log.unshift(game.data.currentRoll.toString());
        return game;
      }
    },
    scoreSelect: (gameId: string, score: any) => {
      let game = games.find((g) => g.id === gameId) as gameData;

      if (game) {
        game.data.isRolling = false;
        let player = game.data.players.find(
          (p: playerData) => p.id === game.data.rollingPlayerId
        ) as playerData;
        let { newRoll, newScore } = addToScore(score, game.data.currentRoll);
        game.data.lastPick.pop();
        game.data.lastPick.push("+ " + score);
        game.data.scorables = computeResult(newRoll);
        game.data.log.unshift(player.name + ` picks: ` + score);
        game.data.currentRoll = newRoll;
        game.data.currentScore += newScore;
        game.data.dice = game.data.currentRoll.length;
        if (game.data.dice === 0) {
          game.data.dice = 6;
          game.data.lastPick.pop();
          game.data.lastPick.push("HOT DICE");
        }
        game.data.canRoll = true;
        (player.points > 0 || game.data.currentScore >= 500) &&
          (game.data.canKeep = true);

        if (player && player.points + game.data.currentScore === 10000) {
          game.data.scorables.length && (game.data.canKeep = false);
        }
        player &&
          player.points + game.data.currentScore > 10000 &&
          (game.data.canKeep = false);
      }
      return game;
    },
    passFork: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      game.data.canFork = false;
      game.data.dice = 6;
      game.data.currentScore = 0;
      return game;
    },
    keep: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      game.data.lastPick.pop();
      game.data.lastPick.push("+ " + game.data.currentScore.toString());
      let prevPlayerId = game.data.rollingPlayerId;
      let player = game.data.players.find(
        (p: playerData) => p.id === game.data.rollingPlayerId
      ) as playerData;
      if (player.points > 0 || game.data.currentScore >= 500) {
        if (player.points + game.data.currentScore <= 10000) {
          player.points += game.data.currentScore;
          game.data.log.unshift(
            player.name + " kept " + game.data.currentScore + " points"
          );
        }
      }
      if (player.points === 10000) {
        game.data.concluded = true;
        roomService.deleteRoom(game.id);
      }
      if (game.data.players.indexOf(player) < game.data.players.length - 1) {
        game.data.rollingPlayerId =
          game.data.players[game.data.players.indexOf(player) + 1].id;
        player = game.data.players[game.data.players.indexOf(player) + 1];
      } else {
        game.data.rollingPlayerId = game.data.players[0].id;
        player = game.data.players[0];
      }
      if (player.points > 0 && player.id !== prevPlayerId) {
        game.data.canFork = true;
      } else {
        game.data.dice = 6;
        game.data.currentScore = 0;
      }
      game.data.currentRoll = [];
      game.data.canKeep = false;
      game.data.scorables = [];

      return game;
    },
    skipTurn: (gameId: string) => {
      let game = games.find((g) => g.id === gameId) as gameData;
      let player = game.data.players.find(
        (p: playerData) => p.id === game.data.rollingPlayerId
      ) as playerData;
      if (game.data.players.indexOf(player) < game.data.players.length - 1) {
        game.data.rollingPlayerId =
          game.data.players[game.data.players.indexOf(player) + 1].id;
      } else {
        game.data.rollingPlayerId = game.data.players[0].id;
      }
      game.data.canRoll = true;
      game.data.canFork = false;
      game.data.dice = 6;
      game.data.scorables = [];
      game.data.log.unshift(player.name + " was skipped");
      return game;
    },
    endGame: (gameId: string) => {},

    removePlayer: (gameId: string, playerID: string) => {},
    getGame: (id: string) => {
      let game: gameData = games.find((g) => g.id === id) as gameData;

      return game;
    },
  };
}

export default gameService();
