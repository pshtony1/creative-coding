const PI2 = Math.PI * 2;

const COLORS = [
  "#E1B000",
  "#EFBB00",
  "#FFC800",
  "#C13227",
  "#CC372B",
  "#D94034",
  "#4A42AD",
  "#544CBB",
  "#5F57CA",
  "#2291A9",
  "#259AB3",
  "#29A5C0",
  "#80B23C",
  "#83BA3A",
  "#8DC63F",
  "#E1B000",
  "#EFBB00",
  "#FFC800",
  "#C13227",
  "#CC372B",
  "#D94034",
  "#4A42AD",
  "#544CBB",
  "#5F57CA",
  "#2291A9",
  "#259AB3",
  "#29A5C0",
  "#80B23C",
  "#83BA3A",
  "#8DC63F",
];

const copyArray = (arr) => {
  let result = [];

  arr.forEach((i) => {
    result.push(i);
  });

  return result;
};

export class Polygon {
  constructor(x, y, radius, sides) {
    this.x = x || 0;
    this.y = y || 0;
    this.radius = radius || 0;
    this.sides = sides || 0;
    this.rotate = 0;
    this.center = parseInt(this.sides / 2, 10);
    this.leftBoxes = [];
    this.rightBoxes = [];

    for (let i = 0; i < this.center; i++) {
      this.leftBoxes.push(i);
    }

    for (let i = this.center + 1; i < this.sides; i++) {
      this.rightBoxes.push(i);
    }
  }

  resize(stageWidth, stageHeight) {
    this.x = stageWidth / 2;
    this.y = stageHeight * 1.8;
    this.radius = stageHeight * 1.2;
  }

  animate(ctx, moveX) {
    ctx.save();

    const angle = PI2 / this.sides;
    const angleGap = 20;

    ctx.translate(this.x, this.y);
    this.rotate += moveX * 0.003;
    ctx.rotate(this.rotate + Math.PI);

    this.changeCenter(angle);

    this.leftBoxes.forEach((i) => {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      this.renderBox(ctx, x, y, COLORS[i], angleGap, angle, i);
    });

    let copied_rightBoxes = copyArray(this.rightBoxes);

    copied_rightBoxes.reverse().forEach((i) => {
      const x = this.radius * Math.cos(angle * i);
      const y = this.radius * Math.sin(angle * i);

      this.renderBox(ctx, x, y, COLORS[i], angleGap, angle, i);
    });

    const centerX = this.radius * Math.cos(angle * this.center);
    const centerY = this.radius * Math.sin(angle * this.center);

    this.renderBox(
      ctx,
      centerX,
      centerY,
      COLORS[this.center],
      angleGap,
      angle,
      this.center
    );

    ctx.restore();
  }

  renderBox(ctx, x, y, color, angleGap, angle, index) {
    const boxX = this.radius * Math.cos(angle * index + this.rotate + Math.PI);
    const sizeFactor = 1 - Math.abs(boxX) / this.radius;
    let size = sizeFactor * 60 + 140;

    const stageHeight = document.body.clientHeight;
    const maxHeight = window.screen.availHeight;
    const resizeFactor = stageHeight / maxHeight;
    size *= resizeFactor;

    ctx.save();

    if (color) ctx.fillStyle = color;
    else ctx.fillStyle = "black";

    ctx.translate(x, y);
    ctx.rotate((((360 / this.sides) * index + 80) * Math.PI) / 180);
    ctx.beginPath();

    for (let j = 0; j < 4; j++) {
      let x2 = size;
      let y2 = size;

      if (j < 2) {
        x2 *= Math.cos(angleGap * (j + 1));
        y2 *= Math.sin(angleGap * (j + 1));
      } else {
        x2 *= Math.cos(Math.PI + angleGap * (j - 1));
        y2 *= Math.sin(Math.PI + angleGap * (j - 1));
      }

      j == 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
    }

    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  changeCenter(angle) {
    const centerX =
      this.radius * Math.cos(angle * this.center + this.rotate + Math.PI);
    let compareX = null;
    let compareIs = null;

    if (centerX < 0) {
      compareX =
        this.radius *
        Math.cos(angle * this.rightBoxes[0] + this.rotate + Math.PI);
      compareIs = "right";
    } else {
      compareX =
        this.radius *
        Math.cos(
          angle * this.leftBoxes[this.leftBoxes.length - 1] +
            this.rotate +
            Math.PI
        );
      compareIs = "left";
    }

    const centerDist = Math.abs(centerX);
    const compareDist = Math.abs(compareX);

    if (compareDist < centerDist) {
      if (compareIs === "right") {
        this.leftBoxes.push(this.center);
        this.center = this.rightBoxes.shift();
        this.rightBoxes.push(this.leftBoxes.shift());
      } else if (compareIs === "left") {
        this.rightBoxes.unshift(this.center);
        this.center = this.leftBoxes.pop();
        this.leftBoxes.unshift(this.rightBoxes.pop());
      }
    }
  }
}
