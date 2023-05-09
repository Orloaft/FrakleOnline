import { player, room } from "./roomService";

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
    alert: string;
  };
}
