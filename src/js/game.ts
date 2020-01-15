import Board from './board';

type Color = 'light' | 'dark';

type Cell = {
  stone: Color | null;
};

export default class Game {
  // player1: Player;

  // player2: Player;

  board: Board;

  CELL_NUM = 8;

  readonly CELL_SIZE: number = 50;

  cells: Cell[][];

  turn: Color | null;

  constructor(canvas: HTMLCanvasElement) {
    this.board = new Board(canvas, this.CELL_NUM);
    // this.player1 = new Player();

    this.cells = Array.from(new Array(this.CELL_NUM), () =>
      new Array(this.CELL_NUM).fill(null).map(() => ({
        stone: null
      }))
    );
    this.turn = null;
    this.reset();
    canvas.addEventListener('mousedown', e => {
      this.click(e);
    });
    const button = document.getElementById('start');
    if (button) {
      button.onclick = () => this.start();
    }
  }

  reset(): void {
    // this.clearAllDisks();
    this.placeDisk(3, 3, 'dark');
    this.placeDisk(3, 4, 'light');
    this.placeDisk(4, 3, 'light');
    this.placeDisk(4, 4, 'dark');
  }

  // clearAllDisks(): void {
  //   console.log('clear');
  // }

  placeDisk(x: number, y: number, color: Color): boolean {
    if (x < 0 || x >= this.CELL_NUM || y < 0 || y >= this.CELL_NUM) {
      throw new Error('place disk at out of board');
    }

    if (this.cells[x][y].stone != null) {
      console.log(
        `cell(${x}, ${y} ${this.cells[x][y].stone} `,
        'already exist'
      );
      return false;
    }

    this.cells[x][y].stone = color;
    this.board.drawStone(x, y, color === 'dark');

    return true;
  }

  click(e): void {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / this.CELL_SIZE);
    console.log(x, y);
    if (this.turn) {
      this.placeDisk(x, y, this.turn);
      this.changeTurn();
    }
  }

  changeTurn(): void {
    if (this.turn === 'dark') {
      this.turn = 'light';
    } else {
      this.turn = 'dark';
    }
  }

  start(): void {
    console.log('game start');
    this.turn = 'dark';
  }
}
