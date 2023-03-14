import {
  getDistanceBetweenNodes,
  getNodeDirection,
  getWeightedManhattanDistance,
} from "./helpers/weighted";
import { getNeighboursIds } from "./helpers/neighbours";
import { getClosestNodeWithHeuristicDist, isSameNode } from "./helpers/nodes";
import { createPath } from "./helpers/createPath";
import { NODE_STATUS } from "../node/constants";

export const astar = (nodes, start, end) => {
  let unvisitedNodesIds = Object.keys(nodes);
  let visitedNodes = {};
  let nodesToAnimate = [];
  let foundEnd = false;

  nodes[start.id].heuristicDistance = getWeightedManhattanDistance(start, end);

  while (unvisitedNodesIds.length) {
    const currNode = getClosestNodeWithHeuristicDist(unvisitedNodesIds, nodes);
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
      nodes[neighbourId].status = NODE_STATUS.NEIGHBOuR;
      nodesToAnimate.push(nodes[neighbourId]);

      const distanceBetweenNodes = getDistanceBetweenNodes(
        currNode,
        nodes[neighbourId]
      );

      const isNeighbourFurtherFromStart =
        currNode.dist + distanceBetweenNodes < nodes[neighbourId].dist;

      if (isNeighbourFurtherFromStart) {
        nodes[neighbourId].dist = currNode.dist + distanceBetweenNodes;
        nodes[neighbourId].direction = getNodeDirection(
          currNode,
          nodes[neighbourId]
        );
        nodes[neighbourId].heuristicDistance = getWeightedManhattanDistance(
          nodes[neighbourId],
          end
        );
        nodes[neighbourId].prevId = currNode.id;
      }
    });
  }
  return [nodesToAnimate, createPath(visitedNodes, start, end, foundEnd)];
};
