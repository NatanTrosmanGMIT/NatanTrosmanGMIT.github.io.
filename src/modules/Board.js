import {
  createBlock,
  clearBlock,
  applyEndBlockCSS,
  applyStartBlockCSS,
  applyWallBlockCSS,
} from "./helpers/block";
import { hasClass, removeClass, $, addClass } from "./helpers/dom";
import { CSS_CLASS, CSS_ID, ANIMATION_TYPE } from "./constants";
import EventsHandler from "./events-handler/EventsHandler";
import NodesManager from "./node/NodesManager";
import Visualizer from "./Visualizer";

class Board {
  constructor({
    boardId,
    blockSize,
    delay,
    algorithms,
    initialAlgorithm,
    initialStartDirection,
  }) {
    this.boardId = boardId;
    this.blockSize = blockSize;
    this.width = null;
    this.height = null;
    this.nodeManager = null;
    this.startDirection = initialStartDirection;

    this.isSearching = false;
    this.isPrepared = false;
    this.isSearched = false;
    this.isMakingWalls = false;
    this.isNodeDragged = false;
    this.draggedNodeId = null;
    this.isAlgorithmChanged = false;
    this.algorithms = algorithms || null;
    this.currentAlgorithm = initialAlgorithm || null;

    this.visualizer = new Visualizer(delay);
    this.animationType = ANIMATION_TYPE.DELAYED;
  }

  initialize() {
    this.createNav();
    this.calculateBoardSize();
    this.createBoard();
    this.initializeNodesManager();
    this.nodesManager.createNodes();
    this.nodesManager.setRandomStartNode();
    this.nodesManager.setStartDirection(this.startDirection);
    this.nodesManager.setRandomEndNode();
    applyStartBlockCSS(this.nodesManager.startNode.id, this.startDirection);
    applyEndBlockCSS(this.nodesManager.endNode.id);

    this.setInitialActiveNavAlgorithm();
    this.addBlocksEventListeners();
    this.addBtnsEventListeners();
    EventsHandler.addNavEventListeners(this.handleNavItemOnClick.bind(this));

    this.isPrepared = true;
  }

  initializeNodesManager() {
    this.nodesManager = new NodesManager(
      this.width,
      this.height,
      this.currentAlgorithm,
      this.initialStartDirection
    );
  }

  handleNavItemOnClick(e) {
    const target = e.target;
    if (hasClass(target, CSS_CLASS.BLOCKED)) return;

    $.all(`.${CSS_CLASS.NAVIGATION_ITEM}`).forEach((item) =>
      removeClass(item, CSS_CLASS.ACTIVE)
    );
    addClass(target, CSS_CLASS.ACTIVE);

    this.handleAlgorithmChange(target.dataset.algorithmKey);
  }

  calculateBoardSize() {
    const board = $.id(this.boardId);
    const pxWidth = board.clientWidth;
    const pxHeight = board.clientHeight;

    this.width = Math.floor(pxWidth / this.blockSize);
    this.height = Math.floor(pxHeight / this.blockSize);
  }

  createBoard() {
    const board = $.id(this.boardId);
    const tbody = document.createElement("tbody");

    for (let y = this.height - 1; y >= 0; y--) {
      const row = document.createElement("tr");
      for (let x = 0; x < this.width; x++) {
        createBlock(row, this.blockSize, x, y);
      }
      tbody.appendChild(row);
    }
    board.appendChild(tbody);
  }

  createNav() {
    const nav = $.id(CSS_ID.NAVIGATION);
    for (let [key, algo] of Object.entries(this.algorithms)) {
      const elem = document.createElement("div");
      addClass(elem, CSS_CLASS.NAVIGATION_ITEM);
      elem.innerText = algo.name;
      elem.dataset.algorithmKey = key;
      nav.appendChild(elem);
    }
  }

  setInitialActiveNavAlgorithm() {
    const elems = document.querySelectorAll(`.${CSS_CLASS.NAVIGATION_ITEM}`);
    elems[0].classList.add(CSS_CLASS.ACTIVE);
  }

  handleAlgorithmChange(algoKey) {
    this.setCurrentAlgorithm(algoKey);
    this.isAlgorithmChanged = true;
    this.nodesManager.currentAlgorithm = this.algorithms[algoKey];
    this.nodesManager.recreateNodes();
  }

  addBtnsEventListeners() {
    const startBtn = $.id(CSS_ID.START_BTN);
    const clearBtn = $.id(CSS_ID.CLEAR_BTN);
    const clearWallsBtn = $.id(CSS_ID.CLEAR_WALLS_BTN);

    startBtn.addEventListener("click", (e) => this.handleDelayedStart());
    clearBtn.addEventListener("click", (e) => this.handleClear());
    clearWallsBtn.addEventListener("click", (e) => this.handleClearWalls());
  }

  addBlocksEventListeners() {
    const blocks = document.querySelectorAll(`.${CSS_CLASS.BLOCK}`);

    blocks.forEach((block) => {
      block.addEventListener("mousedown", (e) => {
        e.preventDefault();
        if (e.which === 1 && !this.isSearching) {
          this.handleMouseDown(block);
        }
      });

      block.addEventListener("mouseenter", (e) => {
        e.preventDefault();
        if (!this.isSearching) this.handleMouseEnter(block);
      });

      block.addEventListener("mouseup", (e) => {
        e.preventDefault();
        if (!this.isSearching) this.handleMouseUp(block);
      });

      block.addEventListener("mouseleave", (e) => {
        e.preventDefault();
        if (!this.isSearching) this.handleMouseLeave(block);
      });
    });
  }

  handleDelayedStart() {
    this.prepareDelayedSearchStateStart();
    this.animationType = ANIMATION_TYPE.DELAYED;
    this.handleStart();
  }

  handleInstantStart() {
    this.prepareInstantSearchStateStart();
    this.animationType = ANIMATION_TYPE.INSTANT;
    this.handleStart();
  }

  async handleStart() {
    if (this.isPrepared) {
      this.handleSearchStateStart();

      const [nodesToAnimate, path] = await this.currentAlgorithm.func(
        this.nodesManager.nodes,
        this.nodesManager.startNode,
        this.nodesManager.endNode
      );

      await this.visualizer.run(nodesToAnimate, path, this.animationType);

      this.handleSearchStateEnd();
    }
  }

  handleClear(e) {
    if (!this.isSearching) {
      this.clearBoardAll();
      this.nodesManager.resetNodesAll();
      this.nodesManager.setRandomStartNode();
      this.nodesManager.setRandomEndNode();
      applyStartBlockCSS(this.nodesManager.startNode.id, this.startDirection);
      applyEndBlockCSS(this.nodesManager.endNode.id);
      this.isPrepared = true;
      this.isSearched = false;
      this.isSearching = false;
    }
  }

  handleClearWalls() {
    if (!this.isSearching) {
      this.nodesManager.clearNodesFromWalls();
      this.clearBoardFromWalls();
    }
  }

  handleSearchStateStart() {
    this.isSearching = true;
    this.isPrepared = false;
    this.isSearched = false;
    $.id(CSS_ID.CLEAR_BTN).disabled = true;
    $.id(CSS_ID.CLEAR_WALLS_BTN).disabled = true;
    $.id(CSS_ID.START_BTN).disabled = true;

    const elems = document.querySelectorAll(`.${CSS_CLASS.NAVIGATION_ITEM}`);
    elems.forEach((elem) => {
      elem.classList.add(CSS_CLASS.BLOCKED);
    });
  }

  handleSearchStateEnd() {
    this.nodesManager.resetNodesExpectWalls();
    this.nodesManager.retrieveStartNode();
    this.nodesManager.retrieveEndNode();
    this.isSearching = false;
    this.isPrepared = true;
    this.isSearched = true;
    $.id(CSS_ID.CLEAR_BTN).disabled = false;
    $.id(CSS_ID.CLEAR_WALLS_BTN).disabled = false;
    $.id(CSS_ID.START_BTN).disabled = false;

    const elems = document.querySelectorAll(`.${CSS_CLASS.NAVIGATION_ITEM}`);
    elems.forEach((elem) => {
      elem.classList.remove(CSS_CLASS.BLOCKED);
    });
  }

  prepareDelayedSearchStateStart() {
    this.clearBoardFromNodes();
    applyStartBlockCSS(this.nodesManager.startNode.id, this.startDirection);
    applyEndBlockCSS(this.nodesManager.endNode.id);
    this.isPrepared = true;
  }

  prepareInstantSearchStateStart() {
    this.clearBoardFromNodes();
    applyStartBlockCSS(this.nodesManager.startNode.id, this.startDirection);
    applyEndBlockCSS(this.nodesManager.endNode.id);
    this.isPrepared = true;
  }

  handleMouseDown(block) {
    const id = block.id;

    const isDraggable =
      !this.nodesManager.isNodeUnvisited(id) &&
      !this.nodesManager.isNodeWall(id) &&
      !this.isSearching;

    const canCreateWall =
      !this.isNodeDragged && this.nodesManager.isNodeUnvisited(id);

    if (isDraggable) {
      this.draggedNodeId = id;
      this.isNodeDragged = true;
    } else if (canCreateWall) {
      this.createWall(block);
      this.isMakingWalls = true;
    }
  }

  handleMouseEnter(block) {
    const id = block.id;

    if (this.isNodeDragged && this.nodesManager.isNodeUnvisited(id)) {
      if (this.nodesManager.isNodeStart(this.draggedNodeId)) {
        this.nodesManager.setStartNode(id);
        applyStartBlockCSS(id, this.startDirection);
      } else if (this.nodesManager.isNodeEnd(this.draggedNodeId)) {
        this.nodesManager.setEndNode(id);
        applyEndBlockCSS(id);
      }

      this.nodesManager.setNodeToInitial(this.draggedNodeId);
      this.draggedNodeId = id;

      if (this.isSearched) {
        this.handleInstantStart();
      }
    } else if (this.isMakingWalls && this.nodesManager.isNodeUnvisited(id)) {
      this.createWall(block);
    }
  }

  handleMouseUp(block) {
    const id = block.id;
    if (this.isNodeDragged && !this.nodesManager.isNodeWall(id)) {
      this.isNodeDragged = false;
      this.draggedNodeId = null;
    } else {
      this.isMakingWalls = false;
    }
  }

  handleMouseLeave() {
    if (this.isNodeDragged) {
      clearBlock(this.draggedNodeId);
    }
  }

  createWall(block) {
    this.nodesManager.setNodeToWall(block.id);
    applyWallBlockCSS(block.id);
  }

  setCurrentAlgorithm(algoKey) {
    this.currentAlgorithm = algoKey ? this.algorithms[algoKey] : null;
  }

  clearBoardAll() {
    this.loopBoard((id) => clearBlock(id));
  }

  clearBoardFromNodes() {
    this.loopBoard((id) => {
      if (!$.id(id).classList.contains(CSS_CLASS.WALL)) {
        clearBlock(id);
      }
    });
  }

  clearBoardFromWalls() {
    this.loopBoard((id) => {
      if ($.id(id).classList.contains(CSS_CLASS.WALL)) {
        clearBlock(id);
      }
    });
  }

  loopBoard(callback) {
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        callback(`${x}-${y}`, x, y);
      }
    }
  }
}

export default Board;
