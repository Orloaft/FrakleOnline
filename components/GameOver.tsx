import { playerData } from "@/gameServices/gameService";
import Link from "next/link";

export const GameOver = (props: { winner: playerData | undefined }) => {
  return (
    <>
      {props.winner && props.winner.name}
      <Link href="/" className="button">
        Back
      </Link>
    </>
  );
};
