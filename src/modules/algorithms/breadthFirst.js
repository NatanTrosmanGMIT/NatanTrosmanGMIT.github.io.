import { getNeighboursIds } from "./helpers/neighbours";
import { getClosestNode, isSameNode } from "./helpers/nodes";
import { createPath } from "./helpers/createPath";
import { NODE_STATUS } from "../node/constants";

export const breadthFirst = (nodes, start, end) => {
  let unvisitedNodesIds = Object.keys(nodes);
  let visitedNodes = {};
  let nodesToAnimate = [];
  let foundEnd = false;

  while (unvisitedNodesIds.length) {
    const currNode = getClosestNode(unvisitedNodesIds, nodes);
    if (!currNode) break;

    currNode.status = NODE_STATUS.VISITED;
    visitedNodes[currNode.id] = currNode;
    nodesToAnimate.push(currNode);

    if (isSameNode(currNode, end)) {
      foundEnd = true;
      break;
    }

    const neighboursIds = getNeighboursIds(
      unvisitedNodesIds,
      nodes,
      currNode.x,
      currNode.y
    );

    neighboursIds.forEach((neighbourId) => {
      visitedNodes[neighbourId] = nodes[neighbourId];
      nodes[neighbourId].status = NODE_STATUS.NEIGHBOUR;
      nodesToAnimate.push(nodes[neighbourId]);

      const isNeighbourFurtherFromStart = currNode.dist < nodes[neighbourId].dist;

      if (isNeighbourFurtherFromStart) {
        nodes[neighbourId].dist = currNode.dist + 1;
        nodes[neighbourId].prevId = currNode.id;
      }
    });
  }

  return [nodesToAnimate, createPath(visitedNodes, start, end, foundEnd)];
};
