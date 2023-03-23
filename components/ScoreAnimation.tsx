import { useEffect } from "react";

export const ScoreAnimation = (props: { score: string[] }) => {
  useEffect(() => {
    const points = document.getElementById("points");

    points?.classList.toggle("points-gained");
    points?.classList.toggle("points");
    setTimeout(() => {
      points?.classList.toggle("points-gained");
      points?.classList.toggle("points");
    }, 50);
  }, [props.score]);
  return (
    <>
      {props.score.map((s: string) => {
        return (
          <span
            id="points"
            className="points title"
            style={{ fontSize: "1.5rem" }}
          >
            {" "}
            + {s}
          </span>
        );
      })}
    </>
  );
};
