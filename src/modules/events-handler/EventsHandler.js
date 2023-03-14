import { CSS_CLASS, CSS_ID } from "../constants";
import { $ } from "../helpers/dom";

class EventsHandler {
  static addNavEventListeners(callback) {
    $.all(`.${CSS_CLASS.NAVIGATION_ITEM}`).forEach((item) => {
      item.addEventListener("click", (e) => {
        callback(e);
      });
    });
  }

  static addStartBtnEventListener(callback) {
    $(`#${CSS_ID.START_BTN}`).addEventListener("click", async (e) => {
      callback(e);
    });
  }

  static addClearBtnEventListener(callback) {
    $(`#${CSS_ID.CLEAR_BTN}`).addEventListener("click", (e) => {
      callback(e);
    });
  }

  static addBlocksEventListeners(callbacks) {
    $.all(`.${CSS_CLASS.UNVISITED}`).forEach((block) => {
      block.addEventListener("mousedown", (e) => {
        e.preventDefault();
        callbacks.handleMouseDownOnBlock(e.target);
      });

      block.addEventListener("mouseenter", (e) => {
        e.preventDefault();
        callbacks.handleMouseEnterOnBlock(e.target);
      });

      block.addEventListener("mouseup", (e) => {
        e.preventDefault();
        callbacks.handleMouseUpOnBlock(e.target);
      });

      block.addEventListener("mouseleave", (e) => {
        e.preventDefault();
        callbacks.handleMouseLeaveOnBlock(e.target);
      });
    });
  }
}

export default EventsHandler;
