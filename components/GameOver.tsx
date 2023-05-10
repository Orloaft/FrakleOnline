import { playerData } from "@/services/gameService";
import { useEffect } from "react";

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
