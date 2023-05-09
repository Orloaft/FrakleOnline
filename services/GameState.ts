import {
  addToScore,
  checkIfOver,
  computeResult,
  diceRoll,
} from "@/utils/diceUtils";
import { gameData, playerData } from "./gameService";
import roomService, { room } from "./roomService";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
export enum actionType {
  SEND_CHAT,
  NEW_ROLL,
  SCORE_SELECT,
  KEEP,
  START_GAME,
  END_TURN,
  PASS_FORK,
}
export interface actionRequest {
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
  type: actionType;
  roomId: string;
  msg: string;
  player: player | playerData;
  score?: string;
  room?: room;
}
export interface player {
  id: string;
  name: string;
}

let games: gameData[] = [];
let chats: string[][] = [];
// this is going to be the new class handling any game actions
export class GameStateReducer {
  static getGame(gameId: string) {
    return games.find((game) => game.id === gameId);
  }
  static handleAction(req: actionRequest): gameData | void | room {
    switch (req.type) {
      case 0:
        return this.sendMessage(req.roomId, req.player, req.msg, req.io);
      case 1:
        return this.newRoll(req.roomId);
      case 2:
        return this.scoreSelect(req.roomId, req.score);
      case 3:
        return this.keep(req.roomId);
      case 4:
        let room = roomService.getRoom(req.roomId) as room;
        roomService.deleteRoom(room.id);
        return req.io && this.createGame(room, req.io);
      case 5:
        return this.nextTurn(req.roomId);
      case 6:
        return this.passFork(req.roomId);
    }
  }

  static sendMessage(
    gameId: string,
    player: player,
    msg: string,
    io: any
  ): gameData | room {
    let game = games.find((g) => g.id === gameId) as gameData;
    if (game) {
      game.chat.unshift(player.name + ": " + msg);
      game.data.lastPick.pop();
      game.data.lastPick.push(player.name + ": " + msg);
      game.data.isRolling = false;
      io.to(gameId).emit("update-chat", game.chat);
      return game;
    } else {
      roomService.sendMessage(gameId, player, msg);
      return roomService.getRoom(gameId) as room;
    }
  }
  static createGame(
    r: room,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ): gameData {
    let newGame: any;
    let playerArray: playerData[] = r.players.map((p) => {
      return { ...p, points: 0, dice: 0 };
    });

    switch (r.gameRules) {
      case 0:
        newGame = {
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
            isRolling: false,
            lastPick: [""],
            alert: "",
          },
        };
        games.push(newGame);
        break;
      case 1:
        newGame = {
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
            canRoll: false,
            log: [],
            isRolling: false,
            lastPick: [""],
            alert: "",
          },
        };
        games.push(newGame);
        this.setTimer(io, r.id);
    }

    return newGame;
  }
  static bust(gameId: string): gameData {
    let game = games.find((g) => g.id === gameId) as gameData;
    game.data.canRoll = false;
    game.data.scorables = [];
    game.data.canKeep = false;
    game.data.lastPick.pop();
    game.data.lastPick.push("BUST!");
    game.data.currentScore = 0;
    game.data.log.unshift("bust!");

    return game;
  }
  static newRoll(gameId: string): gameData {
    let game = games.find((g) => g.id === gameId) as gameData;
    let player = game.data.players.find(
      (p: playerData) => p.id === game.data.rollingPlayerId
    ) as playerData;

    game.data.lastPick.pop();
    game.data.isRolling = true;
    game.data.canRoll = false;
    game.data.canFork = false;
    game.data.currentRoll = diceRoll(game.data.dice);
    game.data.scorables = computeResult(game.data.currentRoll);

    if (
      game.data.scorables.length === 0 ||
      checkIfOver(game.data.scorables, player)
    ) {
      game = this.bust(gameId);
    }
    game.data.log.unshift(game.data.currentRoll.toString());
    return game;
  }

  static nextTurn(gameId: string): gameData {
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
    game.timer = 1;
    return game;
  }
  static scoreSelect(gameId: string, score: any): gameData {
    let game = games.find((g) => g.id === gameId) as gameData;

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
    if (player && player.points + game.data.currentScore > 10000) {
      this.bust(gameId);
    }

    return game;
  }
  static passFork(gameId: string): gameData {
    let game = games.find((g) => g.id === gameId) as gameData;
    game.data.canFork = false;
    game.data.dice = 6;
    game.data.currentScore = 0;
    return game;
  }
  static keep(gameId: string): gameData {
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
    } // If I am at the end of the turn order start from index 0
    if (game.data.players.indexOf(player) < game.data.players.length - 1) {
      game.data.rollingPlayerId =
        game.data.players[game.data.players.indexOf(player) + 1].id;
      player = game.data.players[game.data.players.indexOf(player) + 1];
    } else {
      game.data.rollingPlayerId = game.data.players[0].id;
      player = game.data.players[0];
    }
    if (
      player.points > 0 &&
      player.id !== prevPlayerId &&
      player.points + game.data.currentScore < 10000
    ) {
      game.data.canFork = true;
    } else {
      game.data.dice = 6;
      game.data.currentScore = 0;
    }
    game.timer = 1;
    game.data.currentRoll = [];
    game.data.canKeep = false;
    game.data.scorables = [];

    return game;
  }
  static setTimer(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    id: string
  ) {
    let game = games.find((g) => g.id === id) as gameData;
    game.data.alert = "Ready?";
    io.to(id).emit("game-update-response", game);
    setTimeout(() => {
      game.data.canRoll = true;
      game.data.alert = "";

      setInterval(() => {
        game.gameRules === 1 && game.timer && (game.timer += 1);
        if (game.timer === 11) {
          if (game.data.scorables.length) {
            game = this.scoreSelect(id, game.data.scorables[0]);
          }
          if (game.data.currentScore && game.data.canKeep) {
            game = this.keep(id);
          } else {
            game.data.canFork && (game.data.canFork = false);
            game = this.nextTurn(id);
          }

          io.to(id).emit("game-update-response", game);
        }
        io.to(id).emit("timer_update", game.timer);
      }, 1000);
      io.to(id).emit("game-update-response", game);
    }, 2000);
  }
}
