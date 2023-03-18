import { playerData } from "@/gameServices/gameService";
import Link from "next/link";

export const GameOver = (props: { winner: playerData | undefined }) => {
  return (
    <>
      <span>WINNER: {props.winner && props.winner.name}</span>
      <Link href="/" className="button">
        Back
      </Link>
    </>
  );
};
