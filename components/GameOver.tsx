import { playerData } from "@/services/gameService";
import { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export const GameOver = ({
  winner,
  setRoom,
}: {
  winner: playerData | undefined;
  setRoom: any;
}) => {
  useEffect(() => {
    sessionStorage.removeItem("gameSessionId");
  }, []);
  return (
    <>
      <ConfettiExplosion />
      <span>WINNER: {winner && winner.name}</span>
      <div
        onClick={() => {
          setRoom(null);
        }}
        className="button"
      >
        Back
      </div>
    </>
  );
};
