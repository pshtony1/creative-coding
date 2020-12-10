import { Polygon } from "./polygon.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    this.polygon = new Polygon(
      this.stageWidth / 2,
      this.stageHeight * 1.8,
      this.stageHeight * 1.2,
      41
    );
    console.log(this.polygon);

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));

    this.isDown = false;
    this.moveX = 0;
    this.offsetX = 0;
    document.addEventListener("pointerdown", this.onDown.bind(this));
    document.addEventListener("pointermove", this.onMove.bind(this));
    document.addEventListener("pointerup", this.onUp.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(2, 2);

    this.polygon.resize(this.stageWidth, this.stageHeight);
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.moveX *= 0.92;
    this.polygon.animate(this.ctx, this.moveX, this.stageWidth / 2);
  }

  onDown(e) {
    this.isDown = true;
    this.moveX = 0;
    this.offsetX = e.clientX;
  }

  onMove(e) {
    if (this.isDown) {
      this.moveX = e.clientX - this.offsetX;
      this.offsetX = e.clientX;
    }
  }

  onUp() {
    this.isDown = false;
  }
}

window.onload = () => {
  new App();
};
