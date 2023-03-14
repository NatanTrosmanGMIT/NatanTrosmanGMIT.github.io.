import { CSS_CLASS } from "../constants";
import { $ } from "./dom";

export const createBlock = (parent, blockSize, x, y) => {
  const block = document.createElement("td");

  block.id = `${x}-${y}`;
  block.classList.add("unvisited");
  block.className = `${CSS_CLASS.BLOCK} ${CSS_CLASS.UNVISITED}`;
  block.style.width = `${blockSize}px`;
  block.style.height = `${blockSize}px`;

  block.dataset.x = x;
  block.dataset.y = y;

  parent.appendChild(block);
};

export const clearBlock = (id) => {
  $.id(id).className = `${CSS_CLASS.BLOCK} ${CSS_CLASS.UNVISITED}`;
};

export const applyStartBlockCSS = (id, direction) => {
  const block = $.id(id);
  block.className = `${CSS_CLASS.BLOCK} ${CSS_CLASS.START}`;
  if (direction) {
    block.classList.add(direction);
  }
};

export const applyEndBlockCSS = (id) => {
  $.id(id).className = `${CSS_CLASS.BLOCK} ${CSS_CLASS.END}`;
};

export const applyWallBlockCSS = (id) => {
  $.id(id).className = `${CSS_CLASS.BLOCK} ${CSS_CLASS.WALL}`;
};
