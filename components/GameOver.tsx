import { playerData } from "@/gameServices/gameService";
import Link from "next/link";
import { useEffect } from "react";

export const GameOver = (props: { winner: playerData | undefined }) => {
  useEffect(() => {
    sessionStorage.removeItem("gameSessionId");
  }, []);
  return (
    <>
      <span>WINNER: {props.winner && props.winner.name}</span>
      <Link href="/" className="button">
        Back
      </Link>
    </>
  );
};
