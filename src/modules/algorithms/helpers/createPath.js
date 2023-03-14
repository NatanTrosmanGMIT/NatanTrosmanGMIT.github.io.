export const createPath = (visitedNodes, start, end, foundEnd) => {
  let path = [];

  if (foundEnd) {
    let foundStart = false;
    let currNode = visitedNodes[end.id];
    path.push(currNode);

    while (!foundStart) {
      path.push(currNode);
      if (currNode.x === start.x && currNode.y === start.y) {
        foundStart = true;
        break;
      }
      if (currNode.prevId) currNode = visitedNodes[currNode.prevId];
    }
  }

  return path.reverse();
};
