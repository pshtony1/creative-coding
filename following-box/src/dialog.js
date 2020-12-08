import { Point } from "./point.js";

const FOLLOW_SPEED = 0.08;
const ROTATE_SPEED = 0.12;
const MAX_ANGLE = 30;
const dt = 1000 / 60;
const WIDTH = 260;
const HEIGHT = 260;

export class Dialog {
  constructor() {
    this.pos = new Point(); // Dialog's position
    this.target = new Point(); // the vector to move
    this.prevPos = new Point(); // Previous Position(1frame before). To get speed by abstracting with this.pos
    this.downPos = new Point(); // the absolute position when clicked (initialize when only clicked)
    this.startPos = new Point();
    this.mousePos = new Point(); // the relative position of this.downPos with this.pos
    this.centerPos = new Point(); // current downPos (changing)
    this.origin = new Point(); // same as this.mousePos but using for the origin position of ctx.rotate()
    this.rotation = 20; // current angle
    this.sideValue = 0;
    this.isDown = false;
  }

  resize(stageWidth, stageHeight) {
    this.pos.x = Math.random() * (stageWidth - WIDTH);
    this.pos.y = Math.random() * (stageHeight - HEIGHT);
    this.target = this.pos.clone();
    this.prevPos = this.pos.clone();
  }

  animate(ctx) {
    const move = this.target.clone().substract(this.pos).reduce(FOLLOW_SPEED);
    this.pos.add(move);

    this.centerPos = this.pos.clone().add(this.mousePos);

    this.swingDrag(ctx);

    this.prevPos = this.pos.clone();
  }

  swingDrag(ctx) {
    const dx = this.pos.x - this.prevPos.x;
    const speedX = Math.abs(dx) / dt;
    const speed = Math.min(Math.max(speedX, 0), 1);

    // MAX_ANGLE 에서 오차범위 50% 까지 각도가 돌게 만듬.
    // 여기서 선언한 rotation은 목표 각도
    let rotation = (MAX_ANGLE / 1) * speed;
    rotation *= (dx > 0 ? 1 : -1) - this.sideValue;

    this.rotation += (rotation - this.rotation) * ROTATE_SPEED; // 이게 호도법으로 나온 각도...

    const tmpPos = this.pos.clone().add(this.origin);

    // Draw Dialog
    ctx.save();
    ctx.translate(tmpPos.x, tmpPos.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.fillStyle = "#f4e55a";
    /* 내가 캔버스의 기준점을 tmpPos로 옮겼기 때문에,
			 그리기 원하는 위치인 this.pos로 만들기 위해서는
			 tmpPos - this.origin = this.pos 이므로,
			 -this.origin의 좌표를 시작점으로 만들어주어야 올바르게 그려진다.
		*/
    ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT);
    ctx.restore();
  }

  down(point) {
    if (point.collide(this.pos, WIDTH, HEIGHT)) {
      this.isDown = true;
      this.startPos = this.pos.clone();
      this.downPos = point.clone();
      this.mousePos = point.clone().substract(this.pos);

      const xRatioValue = this.mousePos.x / WIDTH;
      this.origin.x = WIDTH * xRatioValue;
      this.origin.y = (HEIGHT * this.mousePos.y) / HEIGHT;

      this.sideValue = xRatioValue - 0.5;

      return this;
    }

    return null;
  }

  move(point) {
    if (this.isDown) {
      this.target = this.startPos.clone().add(point).substract(this.downPos);
    }
  }

  up() {
    this.isDown = false;
  }
}
