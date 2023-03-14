class Node {
  constructor({ status, x, y, prevId, dist }) {
    this.status = status;
    this.id = `${x}-${y}`;
    this.x = x;
    this.y = y;
    this.prevId = prevId;
    this.dist = dist;
  }
}

export default Node;
