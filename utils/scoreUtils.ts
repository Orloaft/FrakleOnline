function getScoreKeeper() {
  let points = 0;
  let dice = 6;
  return {
    addScore: (score: number) => {
      points += score;
      return points;
    },
    getDice: () => {
      return dice;
    },
    setDice: (n: number) => {
      dice = n;
    },
    setScore: (n: number) => {
      points = n;
    },
  };
}
export default getScoreKeeper();
