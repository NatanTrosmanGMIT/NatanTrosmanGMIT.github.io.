import { getRandomNum } from "../helpers/getRandomNum";
import { getDifferentRandomNum } from "../helpers/getDifferentRandomNum";
import updateObject from "../helpers/updateObject";
import { directions } from "../algorithms/helpers/weighted";
import { NODE_STATUS } from "./constants";
import NodeFactory from "./NodeFactory";

class NodesManager {
  constructor(sizeX, sizeY, algorithm, initialStartDirection) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.nodes = {};
    this.currentAlgorithm = algorithm;

    this.startNode = null;
    this.startDirection = initialStartDirection;
    this.endNode = null;
  }

  createNodes() {
    this.loopNodes((id, x, y) => {
      this.createNode(id, x, y);
    });
  }

  createNode(id, x, y) {
    const newNode = NodeFactory.createNode(this.currentAlgorithm.node.type, {
      x,
      y,
      ...this.currentAlgorithm.node.initialValues,
    });
    this.nodes[id] = newNode;
  }

  setRandomStartNode() {
    const randX = getRandomNum(0, this.sizeX - 1);
    const randY = getRandomNum(0, this.sizeY - 1);
    const id = `${randX}-${randY}`;

    this.setStartNode(id);
  }

  setRandomEndNode() {
    const randX = getDifferentRandomNum(0, this.sizeX - 1, this.startNode.x);
    const randY = getDifferentRandomNum(0, this.sizeY - 1, this.startNode.y);
    const id = `${randX}-${randY}`;

    this.setEndNode(id);
  }

  setStartNode(id) {
    updateObject(this.nodes[id], {
      status: NODE_STATUS.START,
      dist: 0,
      direction: this.startDirection ? directions[this.startDirection] : null,
    });
    this.startNode = this.nodes[id];
  }

  setEndNode(id) {
    updateObject(this.nodes[id], {
      status: NODE_STATUS.END,
      dist: Infinity,
    });
    this.endNode = this.nodes[id];
  }

  setStartDirection(direction) {
    this.startDirection = direction;
  }

  setNodeToInitial(id) {
    updateObject(this.nodes[id], this.currentAlgorithm.node.initialValues);
  }

  setNodeToWall(id) {
    this.nodes[id].status = NODE_STATUS.WALL;
  }

  resetNodesExpectWalls() {
    this.loopNodes((id) => {
      if (!this.isNodeWall(id)) {
        this.setNodeToInitial(id);
      }
    });
  }

  clearNodesFromWalls() {
    this.loopNodes((id) => {
      if (this.isNodeWall(id)) {
        this.setNodeToInitial(id);
      }
    });
  }

  resetNodesAll() {
    this.setNodesToInitial();
  }

  setNodesToInitial() {
    this.loopNodes((id) => this.setNodeToInitial(id));
  }

  retrieveStartNode() {
    this.setStartNode(this.startNode.id);
  }

  retrieveEndNode() {
    this.setEndNode(this.endNode.id);
  }

  recreateNodes() {
    this.loopNodes((id, x, y) => {
      if (this.isNodeWall(id)) {
        this.createNode(id, x, y);
        this.setNodeToWall(id);
      } else this.createNode(id, x, y);
    });
    this.retrieveStartNode();
    this.retrieveEndNode();
  }

  isNodeUnvisited(id) {
    return this.nodes[id].status === NODE_STATUS.UNVISITED;
  }
  isNodeWall(id) {
    return this.nodes[id].status === NODE_STATUS.WALL;
  }
  isNodeStart(id) {
    return this.nodes[id].status === NODE_STATUS.START;
  }
  isNodeEnd(id) {
    return this.nodes[id].status === NODE_STATUS.END;
  }

  loopNodes(callback) {
    for (let y = this.sizeY - 1; y >= 0; y--) {
      for (let x = 0; x < this.sizeX; x++) {
        callback(`${x}-${y}`, x, y);
      }
    }
  }
}

export default NodesManager;
