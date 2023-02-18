// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.fScore = calculateFScore(startNode, finishNode);
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByFScore(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    // If we encounter a wall, we skip it.
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateNeighbors(closestNode, grid, finishNode);
  }
}

function calculateFScore(node, finishNode) {
  const hScore = calculateManhattanDistance(node, finishNode);
  return node.distance + hScore;
}

function calculateManhattanDistance(node, finishNode) {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

function sortNodesByFScore(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
}

function updateNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const tentativeDistance = node.distance + 1;
    if (tentativeDistance < neighbor.distance) {
      neighbor.previousNode = node;
      neighbor.distance = tentativeDistance;
      neighbor.fScore = calculateFScore(neighbor, finishNode);
    }
  }
}
