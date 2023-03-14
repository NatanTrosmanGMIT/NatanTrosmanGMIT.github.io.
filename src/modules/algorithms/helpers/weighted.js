/**
 * Possible directions of node
 */
export const directions = {
  north: 0,
  east: 1,
  south: 2,
  west: 3,
};

const directionsName = ["north", "east", "south", "west"];

/**
 * Get direction name by provided index
 */
export const getDirectionName = (index) => directionsName[index];

/**
 * weights of turns calc by degrees
 */
export const weightTurn_90 = 1;
export const weightTurn_180 = 2;

/**
 * weight of move
 */
export const moveWeight = 1;

/**
 * Node can be directed into 4 directions - north, east, south and west
 * The array represents the weight of choosing the next direction
 * 90 degree turn costs 1 points
 * [0] - go north weight
 * [1] - go east weight
 * [2] - go south weight
 * [3] - go west weight
 */
export const northDirectionWeights = [
  0,
  weightTurn_90,
  weightTurn_180,
  weightTurn_90,
];
export const eastDirectionWeights = [
  weightTurn_90,
  0,
  weightTurn_90,
  weightTurn_180,
];
export const southDirectionWeights = [
  weightTurn_180,
  weightTurn_90,
  0,
  weightTurn_90,
];
export const westDirectionWeights = [
  weightTurn_90,
  weightTurn_180,
  weightTurn_90,
  0,
];

export const getDirectionWeightsBasedOnCurrDirection = (currDirection) => {
  if (currDirection === 0) {
    return northDirectionWeights;
  } else if (currDirection === 1) {
    return eastDirectionWeights;
  } else if (currDirection === 2) {
    return southDirectionWeights;
  } else if (currDirection === 3) {
    return westDirectionWeights;
  }
};

/**
 * Get distance between two nodes based on the weight
 */
export const getDistanceBetweenNodes = (node_1, node_2) => {
  // node_2 is up
  if (node_1.y < node_2.y && node_1.x === node_2.x) {
    return northDirectionWeights[node_1.direction] + moveWeight;
  }
  // node_2 is right
  else if (node_1.x < node_2.x && node_1.y === node_2.y) {
    return eastDirectionWeights[node_1.direction] + moveWeight;
  }
  // node_2 is bottom
  else if (node_1.y > node_2.y && node_1.x === node_2.x) {
    return southDirectionWeights[node_1.direction] + moveWeight;
  }
  // node_2 is left
  else if (node_1.x > node_2.x && node_1.y === node_2.y) {
    return westDirectionWeights[node_1.direction] + moveWeight;
  } else {
    throw new Error(
      "Something went wrong when setting the distance between nodes."
    );
  }
};

/**
 * Return direction of node_2 based on their positions
 */
export const getNodeDirection = (node_1, node_2) => {
  if (node_1.y < node_2.y && node_1.x === node_2.x) {
    return directions["north"];
  } else if (node_1.x < node_2.x && node_1.y === node_2.y) {
    return directions["east"];
  } else if (node_1.y > node_2.y && node_1.x === node_2.x) {
    return directions["south"];
  } else if (node_1.x > node_2.x && node_1.y === node_2.y) {
    return directions["west"];
  } else {
    throw new Error("Something went wrong when setting the direction of node.");
  }
};

/**
 * Return manhattan distance between two provided nodes with additional
 * heuristic weight
 *
 */
export const getWeightedManhattanDistance = (node, end) => {
  const xDiff = Math.abs(node.x - end.x);
  const yDiff = Math.abs(node.y - end.y);
  let additionalWeight = 0;
  const weights = getDirectionWeightsBasedOnCurrDirection(node.direction);

  if (node.y < end.y) {
    additionalWeight += weights[0];
    if (node.x < end.x) {
      additionalWeight += weights[1];
    } else if (node.x > end.x) {
      additionalWeight += weights[3];
    }
  } else if (node.y > end.y) {
    additionalWeight += weights[2];
    if (node.x < end.x) {
      additionalWeight += weights[1];
    } else if (node.x > end.x) {
      additionalWeight += weights[3];
    }
  }

  return xDiff + yDiff + additionalWeight;
};
