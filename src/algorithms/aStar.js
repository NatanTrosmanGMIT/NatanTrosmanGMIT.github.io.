// Performs A* algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.fScore = heuristic(startNode, finishNode);
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
    updateUnvisitedNeighbors(closestNode, finishNode, grid);
  }
}

function sortNodesByFScore(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
}

function updateUnvisitedNeighbors(node, finishNode, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const tentativeGScore = node.distance + 1;
    if (tentativeGScore < neighbor.distance) {
      neighbor.previousNode = node;
      neighbor.distance = tentativeGScore;
      neighbor.fScore = tentativeGScore + heuristic(neighbor, finishNode);
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.fScore = Infinity;
      node.isVisited = false;
      nodes.push(node);
    }
  }
  return nodes;
}

// Heuristic function to estimate the distance between a node and the finish node.
function heuristic(node, finishNode) {
  const dx = Math.abs(node.col - finishNode.col);
  const dy = Math.abs(node.row - finishNode.row);
  return dx + dy;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the A* method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
