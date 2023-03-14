import NodeWeighted from "./NodeWeighted";

class NodeHeuristic extends NodeWeighted {
  constructor({ heuristicDistance, ...props }) {
    super(props);
    this.heuristicDistance = heuristicDistance;
  }
}

export default NodeHeuristic;
