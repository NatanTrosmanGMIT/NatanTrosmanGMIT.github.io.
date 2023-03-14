import "./assets/sass/main.scss";
import Board from "./modules/Board";
import { algorithms } from "./modules/algorithms";

const board = new Board({
  boardId: "board",
  blockSize: 25,
  delay: 20,
  algorithms,
  initialAlgorithm: algorithms["bfs"],
  initialStartDirection: "east",
});
board.initialize();
