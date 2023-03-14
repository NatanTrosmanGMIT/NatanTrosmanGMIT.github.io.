import { getRandomNum } from "./getRandomNum";

export const getDifferentRandomNum = (min, max, differentFrom) => {
  let rand;
  do {
    rand = getRandomNum(min, max);
  } while (rand === differentFrom);

  return rand;
};
