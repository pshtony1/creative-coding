export class Point {
  constructor(x, y) {
    // filter x or y is null or undefined
    this.x = x || 0;
    this.y = y || 0;
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
    return this;
  }

  substract(point) {
    this.x -= point.x;
    this.y -= point.y;
    return this;
  }

  reduce(value) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  collide(point, width, height) {
    if (
      this.x >= point.x &&
      this.x <= point.x + width &&
      this.y >= point.y &&
      this.y <= point.y + height
    ) {
      return true;
    }

    return false;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}
