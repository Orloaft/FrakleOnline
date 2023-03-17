import scoreUtils from "./scoreUtils";
export const diceRoll = (n: number) => {
  let result: number[] = [];
  for (let i = 0; i < n; i++) {
    result.push(Math.floor(Math.random() * 6 + 1));
  }
  result.sort();
  return result;
};
const straight = (result: number[]) => {
  let count = 0;
  if (result.length > 5) {
    for (let i = 0; i < 6; i++) {
      result[i] === i + 1 && count++;
      if (count === 6) {
        return `1-6 straight = 1500`;
      }
    }
    return false;
  }
};
const sixOfAKind = (result: number[]) => {
  if (result.length > 5) {
    for (let i = 0; i < 6; i++) {
      if (result.every((e) => e === i + 1)) {
        return `6 * ${i + 1} = 3000`;
      }
    }
  }
  return false;
};
const fiveOfAKind = (result: number[]) => {
  if (result.length > 4) {
    for (let i = 0; i < 6; i++) {
      let count = 0;
      for (let j = 0; j < result.length; j++) {
        result[j] === i + 1 && count++;
      }
      if (count >= 5) {
        return `5 * ${i + 1} = 2000`;
      }
    }
  }
  return false;
};
const fourOfAKind = (result: number[]) => {
  if (result.length > 3) {
    for (let i = 0; i < 6; i++) {
      let count = 0;
      for (let j = 0; j < result.length; j++) {
        result[j] === i + 1 && count++;
      }
      if (count >= 4) {
        //check for four with a pair
        if (result.length === 6) {
          let remainder = [...result];
          remainder.splice(result.indexOf(i + 1), 1);
          remainder.splice(result.indexOf(i + 1), 1);
          remainder.splice(result.indexOf(i + 1), 1);
          remainder.splice(result.indexOf(i + 1), 1);
          if (remainder[0] === remainder[1]) {
            return `four & pair = 1500`;
          }
        }
        return `4 * ${i + 1} = 1000`;
      }
    }
  }
  return false;
};
const threeOfAKind = (result: number[]) => {
  if (result.length > 2) {
    for (let i = 1; i < 6; i++) {
      let count = 0;
      for (let j = 0; j < result.length; j++) {
        result[j] === i + 1 && count++;
      }
      if (count >= 3) {
        if (result.length === 6) {
          let remainder = [...result];
          remainder.splice(result.indexOf(i + 1), 1);
          remainder.splice(result.indexOf(i + 1), 1);
          remainder.splice(result.indexOf(i + 1), 1);
          if (remainder[0] === remainder[2]) {
            return `2 triplets = 2500`;
          }
        }
        return `3 * ${i + 1} = ${(i + 1) * 100}`;
      }
    }
    return false;
  }
};
const threePairs = (result: number[]) => {
  if (result.length === 6) {
    if (
      result[0] === result[1] &&
      result[2] === result[3] &&
      result[4] === result[5]
    ) {
      return `three pairs = 1500`;
    }
  }
  return false;
};
export const computeResult = (result: number[]) => {
  let scorables = [];
  scorables.push(threePairs(result));
  scorables.push(straight(result));
  scorables.push(sixOfAKind(result));
  scorables.push(fiveOfAKind(result));
  scorables.push(fourOfAKind(result));

  scorables.push(threeOfAKind(result));

  for (let i = 0; i < result.length; i++) {
    result[i] === 1 && scorables.push(`1 = 100`);
    result[i] === 5 && scorables.push(`5 = 50`);
  }
  scorables = scorables.filter((e) => e !== false);
  scorables = scorables.filter((e) => e !== undefined);
  return scorables;
};
export const addToScore = (score: string, result: number[]) => {
  let newResult = [...result];
  switch (score) {
    case `three pairs = 1500`:
      newResult = [];
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `2 triplets = 2500`:
      newResult = [];
      scoreUtils.addScore(2500);
      return { newRoll: newResult, newScore: 2500 };
    case `four & pair = 1500`:
      newResult = [];
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `1-6 straight = 1500`:
      newResult = [];
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `1 = 100`:
      newResult = [...result];
      newResult.splice(result.indexOf(1), 1);
      scoreUtils.addScore(100);
      return { newRoll: newResult, newScore: 100 };
    case `5 = 50`:
      newResult = [...result];
      newResult.splice(result.indexOf(5), 1);
      scoreUtils.addScore(50);
      return { newRoll: newResult, newScore: 50 };
    case `3 * 2 = 200`:
      newResult = [...result];
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      scoreUtils.addScore(200);
      return { newRoll: newResult, newScore: 200 };
    case `3 * 3 = 300`:
      newResult = [...result];
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      scoreUtils.addScore(300);
      return { newRoll: newResult, newScore: 300 };
    case `3 * 4 = 400`:
      newResult = [...result];
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      scoreUtils.addScore(400);
      return { newRoll: newResult, newScore: 400 };
    case `3 * 5 = 500`:
      newResult = [...result];
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      scoreUtils.addScore(500);
      return { newRoll: newResult, newScore: 500 };
    case `3 * 6 = 600`:
      newResult = [...result];
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      scoreUtils.addScore(600);
      return { newRoll: newResult, newScore: 600 };
    case `4 * 1 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `4 * 2 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `4 * 3 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `4 * 4 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `4 * 5 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `4 * 6 = 1000`:
      newResult = [...result];
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      scoreUtils.addScore(1500);
      return { newRoll: newResult, newScore: 1500 };
    case `5 * 1 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `5 * 2 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `5 * 3 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `5 * 4 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `5 * 5 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `5 * 6 = 2000`:
      newResult = [...result];
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      scoreUtils.addScore(2000);
      return { newRoll: newResult, newScore: 2000 };
    case `6 * 1 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      newResult.splice(result.indexOf(1), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
    case `6 * 2 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      newResult.splice(result.indexOf(2), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
    case `6 * 3 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      newResult.splice(result.indexOf(3), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
    case `6 * 4 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      newResult.splice(result.indexOf(4), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
    case `6 * 5 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      newResult.splice(result.indexOf(5), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
    case `6 * 6 = 3000`:
      newResult = [...result];
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      newResult.splice(result.indexOf(6), 1);
      scoreUtils.addScore(3000);
      return { newRoll: newResult, newScore: 3000 };
  }

  return { newRoll: result, newScore: 0 };
};
