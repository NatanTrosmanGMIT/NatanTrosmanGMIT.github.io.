import { asyncForEach } from "./helpers/asyncForEach";
import asyncDelay from "./helpers/asyncDelay";
import { $ } from "./helpers/dom";
import { NODE_STATUS } from "./node/constants";
import { CSS_CLASS, ANIMATION_TYPE, CSS_ID } from "./constants";

class Visualizer {
  constructor(delay) {
    this.delay = delay;
    this.minDelay = 20;
    this.maxDelay = 100;

    this.prepareSpeedInput();
  }

  async run(nodesToAnimate, path, animationType) {
    if (animationType === ANIMATION_TYPE.DELAYED) {
      await this.runDelayed(nodesToAnimate, path);
    } else if (animationType === ANIMATION_TYPE.INSTANT) {
      this.runInstant(nodesToAnimate, path);
    }
  }

  async runDelayed(nodesToAnimate, path) {
    await asyncForEach(nodesToAnimate, async (node) => {
      const block = $.id(node.id);
      block.classList.remove(CSS_CLASS.UNVISITED);
      if (node.status === NODE_STATUS.VISITED) {
        block.classList.add(CSS_CLASS.VISITED);
        await asyncDelay(this.delay / 5);
      } else if (node.status === NODE_STATUS.NEIGHBOUR) {
        block.classList.add(CSS_CLASS.NEIGHBOUR);
        await asyncDelay(this.delay / 5);
      }
    });

    await asyncForEach(path, async (node) => {
      $.id(node.id).classList.add(CSS_CLASS.PATH);
      await asyncDelay(this.delay);
    });
  }

  runInstant(nodesToAnimate, path) {
    const animationTypePrefix = "instant-";

    nodesToAnimate.forEach((node) => {
      const block = $.id(node.id);
      block.classList.remove(CSS_CLASS.UNVISITED);
      if (node.status === NODE_STATUS.VISITED) {
        block.classList.add(`${animationTypePrefix}${CSS_CLASS.VISITED}`);
      } else if (node.status === NODE_STATUS.NEIGHBOUR) {
        block.classList.add(`${animationTypePrefix}${CSS_CLASS.NEIGHBOUR}`);
      }
    });

    path.forEach((node) => {
      $.id(node.id).classList.add(`${animationTypePrefix}${CSS_CLASS.PATH}`);
    });
  }

  prepareSpeedInput() {
    const input = $.id(CSS_ID.SPEED_INPUT);
    input.min = this.minDelay;
    input.max = this.maxDelay;
    input.value = this.delay;
    input.style.direction = "rtl";
    input.addEventListener("change", (e) => {
      this.delay = e.target.value;
    });
  }
}

export default Visualizer;
