import { WaveGroup } from "./waveGroup.js";

class App {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.waveGroup = new WaveGroup();

    // Q1. 도대체 bind의 정체가 무엇인가..
    /* A: 콜백 함수로 어떤 객체의 메서드를 전달하게 되면 더 이상 객체(this)의 정보는 남아있지 않다.
          즉, 원래 객체가 전역 객체(window)로 바뀌게 된다.
          이를 막기위해 bind(this 또는 원하는 객체)로 원하는 객체를 콜백함수에 넘겨줄 수 있다. */
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    // Q2. 레티나 디스플레이 고려. 왜 이걸 써야하는지는 모르겠음.
    /* A: 레티나 디스플레이는 보통 디스플레이보다 픽셀 개수가 4배나 많음 (면적 기준. 가로 2배 * 세로 2배) 
          따라서 캔버스의 픽셀 사이즈를 가로 세로 각각 2배씩 늘려주고, 캔버스 내부 컨텍스트의 크기를 2배로 확대시키면
          레티나 디스플레이에서 작게 보이는 현상이 없어짐. */
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.waveGroup.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.waveGroup.draw(this.ctx);

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
