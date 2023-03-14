import Node from "./Node";

class NodeWeighted extends Node {
  constructor({ direction, ...props }) {
    super(props);
    this.direction = direction;
  }
}

export default NodeWeighted;
