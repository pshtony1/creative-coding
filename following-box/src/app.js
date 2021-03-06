import { Point } from "./point.js";
import { Dialog } from "./dialog.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.mousePos = new Point();
    this.curItem = null;

    this.items = [];
    this.total = 1;
    for (let i = 0; i < this.total; i++) {
      this.items[i] = new Dialog();
    }

    this.previousWidth = document.body.clientWidth;
    this.previousHeight = document.body.clientHeight;
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    for (let i = 0; i < this.total; i++) {
      this.items[i].resize(
        this.stageWidth,
        this.stageHeight,
        this.previousWidth,
        this.previousHeight,
        true
      );
    }

    window.requestAnimationFrame(this.animate.bind(this));

    document.addEventListener("pointerdown", this.onDown.bind(this));
    document.addEventListener("pointermove", this.onMove.bind(this));
    document.addEventListener("pointerup", this.onUp.bind(this));
  }

  resize(e) {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    // For retina display
    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 3;
    this.ctx.shadowBlur = 6;
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.1)";

    this.ctx.lineWidth = 2;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].resize(
        this.stageWidth,
        this.stageHeight,
        this.previousWidth,
        this.previousHeight,
        false
      );
    }

    this.previousWidth = this.stageWidth;
    this.previousHeight = this.stageHeight;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    window.requestAnimationFrame(this.animate.bind(this));

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].animate(this.ctx);
    }

    if (this.curItem) {
      this.ctx.fillStyle = "#ff4338";
      this.ctx.strokeStyle = "#ff4338";

      this.ctx.beginPath();
      this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(
        this.curItem.centerPos.x,
        this.curItem.centerPos.y,
        8,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
      this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
      this.ctx.stroke();
    }
  }

  onDown(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i].down(this.mousePos.clone());

      // Select current item(that focused)
      if (item) {
        this.curItem = item;
        const index = this.items.indexOf(item);
        this.items.push(this.items.splice(index, 1)[0]);
        break;
      }
    }
  }

  onMove(e) {
    this.mousePos.x = e.clientX;
    this.mousePos.y = e.clientY;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].move(this.mousePos.clone());
    }
  }

  onUp(e) {
    this.curItem = null;

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].up();
    }
  }
}

window.onload = () => {
  new App();
};
