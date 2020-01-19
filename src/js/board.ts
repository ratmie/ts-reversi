export default class Board {
  c: HTMLCanvasElement;

  ctx: CanvasRenderingContext2D;

  cellNum: number;

  CANVAS_SIZE = 400;

  CELL_SIZE = 50;

  constructor(canvas: HTMLCanvasElement, cellNum: number) {
    this.cellNum = cellNum;
    this.c = canvas;
    const ctx = canvas.getContext('2d');
    if (!(ctx instanceof CanvasRenderingContext2D)) {
      throw new Error('canvas error');
    }
    this.ctx = ctx;
    this.init();
  }

  init(): void {
    this.c.width = this.CANVAS_SIZE;
    this.c.height = this.CANVAS_SIZE;
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
    this.ctx.fillStyle = 'green';
    this.ctx.fill();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 4;
    this.ctx.stroke();
    this.ctx.closePath();

    this.drawLines();
  }

  drawLines(): void {
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;

    for (let i = 0; i < this.cellNum + 1; i += 1) {
      this.ctx.moveTo(i * this.CELL_SIZE, 0);
      this.ctx.lineTo(i * this.CELL_SIZE, this.c.height);
    }
    for (let i = 0; i < this.cellNum + 1; i += 1) {
      this.ctx.moveTo(0, i * this.CELL_SIZE);
      this.ctx.lineTo(this.c.width, i * this.CELL_SIZE);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  drawStone(x: number, y: number, color: boolean): void {
    this.ctx.beginPath();
    this.ctx.arc(
      x * this.CELL_SIZE + this.CELL_SIZE / 2,
      y * this.CELL_SIZE + this.CELL_SIZE / 2,
      20,
      0,
      Math.PI * 2
    );
    this.ctx.fillStyle = color ? 'black' : 'white';
    this.ctx.fill();
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();
    console.log(`draw(${x}, ${y}) ok`);
  }
}
