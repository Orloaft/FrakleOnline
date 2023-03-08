import { addToScore, computeResult, diceRoll } from "@/utils/diceUtils";
import scoreUtils from "@/utils/scoreUtils";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export const RollInterface = (props: { player: string }) => {
  const [dice, setDice] = useState<number>(6);
  const [result, setResult] = useState<number[]>([]);
  const [rollDisabled, setRollDisabled] = useState<boolean>(false);
  const handleScoreSelect = (score: string) => {
    setResult(addToScore(score, result));
    setRollDisabled(false);
  };
  useEffect(() => {
    result.length && setDice(result.length);
    !result.length && setDice(6);
  }, [result]);

  return (
    <>
      <div style={{ position: "absolute", top: "20%" }}>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "-70%",
            fontSize: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>{props.player}</span>{" "}
          <span>Score: {scoreUtils.addScore(0)}</span>
        </div>

        <button
          className={styles.button}
          disabled={rollDisabled}
          onClick={() => {
            setResult(diceRoll(dice));
            setRollDisabled(true);
          }}
        >
          Roll {dice} dice
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            {result.map((e) => {
              return (
                <div className={styles.letter} style={{ fontSize: "5rem" }}>
                  {e}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {computeResult(result).map((el) => {
            if (typeof el === "string") {
              return (
                <button
                  className={styles.button}
                  onClick={() => {
                    handleScoreSelect(el);
                  }}
                >
                  {el}
                </button>
              );
            }
          })}
        </div>
      </div>
      <button
        style={{ position: "absolute", top: "0", right: "0" }}
        className={styles.button}
        onClick={() => {
          scoreUtils.setScore(0);
          setDice(6);
          setRollDisabled(false);
          setResult([]);
        }}
      >
        Bust
      </button>
      <Link
        style={{ position: "absolute", bottom: "0", right: "0" }}
        href="/"
        className={styles.button}
      >
        Back
      </Link>
    </>
  );
};
