import { NODE_STATUS } from "../../node/constants";

/**
 * Get node neighbours's ids
 */
export const getNeighboursIds = (unvisitedNodesIds, nodes, x, y) => {
  let arr = [];
  if (
    nodes[`${x}-${y + 1}`] &&
    nodes[`${x}-${y + 1}`].status !== NODE_STATUS.WALL
  ) {
    arr.push(`${x}-${y + 1}`);
  }
  if (
    nodes[`${x + 1}-${y}`] &&
    nodes[`${x + 1}-${y}`].status !== NODE_STATUS.WALL
  ) {
    arr.push(`${x + 1}-${y}`);
  }
  if (
    nodes[`${x}-${y - 1}`] &&
    nodes[`${x}-${y - 1}`].status !== NODE_STATUS.WALL
  ) {
    arr.push(`${x}-${y - 1}`);
  }
  if (
    nodes[`${x - 1}-${y}`] &&
    nodes[`${x - 1}-${y}`].status !== NODE_STATUS.WALL
  ) {
    arr.push(`${x - 1}-${y}`);
  }

  return arr.filter((potentialNeighbourId) =>
    unvisitedNodesIds.find((nodeId) => potentialNeighbourId === nodeId)
  );
};
