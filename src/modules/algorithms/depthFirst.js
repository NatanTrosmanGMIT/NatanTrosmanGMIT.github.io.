import { getNeighboursIds } from "./helpers/neighbours";
import { isSameNode } from "./helpers/nodes";
import { createPath } from "./helpers/createPath";
import { NODE_STATUS } from "../node/constants";

export const depthFirst = (nodes, start, end) => {
  let unvisitedNodesIds = Object.keys(nodes);
  let visitedNodes = {};
  let nodesToAnimate = [];
  let foundEnd = false;

  const search = (currNode, prevId) => {
    if (!currNode) return;
    if (foundEnd) return;

    currNode.prevId = prevId;
    currNode.status = NODE_STATUS.VISITED;
    visitedNodes[currNode.id] = currNode;
    nodesToAnimate.push(currNode);
    unvisitedNodesIds = unvisitedNodesIds.filter((id) => id !== currNode.id);

    if (isSameNode(currNode, end)) {
      foundEnd = true;
      return;
    }

    const neighboursIds = getNeighboursIds(
      unvisitedNodesIds,
      nodes,
      currNode.x,
      currNode.y
    );

    neighboursIds.forEach((id) => search(nodes[id], currNode.id));
  };

  search(nodes[start.id]);

  return [nodesToAnimate, createPath(visitedNodes, start, end, foundEnd)];
};
