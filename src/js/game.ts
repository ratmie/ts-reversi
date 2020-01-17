import Board from './board';

type Color = 'light' | 'dark';

type Cell = {
  stone: Color | null;
  canPlace: Map<Color, boolean>;
  willTurnOverStones: Map<Color, Position[]>;
};

type Position = [number, number];

export default class Game {
  // player1: Player;
  // player2: Player;

  CELL_NUM = 8;

  readonly CELL_SIZE: number = 50;

  cells: Cell[][];

  board: Board;

  turn: Color;

  isGaming: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.board = new Board(canvas, this.CELL_NUM);
    // this.player1 = new Player();

    this.cells = Array.from(new Array(this.CELL_NUM), () =>
      new Array(this.CELL_NUM).fill(null).map(() => ({
        stone: null,
        canPlace: new Map([
          ['light', true],
          ['dark', true]
        ]),
        willTurnOverStones: new Map([
          ['light', []],
          ['dark', []]
        ])
      }))
    );
    this.turn = 'dark';
    this.isGaming = false;
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
    this.placeDisk(3, 3, 'light');
    this.placeDisk(3, 4, 'dark');
    this.placeDisk(4, 3, 'dark');
    this.placeDisk(4, 4, 'light');
  }

  // clearAllDisks(): void {
  //   console.log('clear');
  // }

  placeDisk(x: number, y: number, color: Color): boolean {
    if (x < 0 || x >= this.CELL_NUM || y < 0 || y >= this.CELL_NUM) {
      throw new Error('place disk at out of board');
    }

    // if (this.cells[x][y].stone != null) {
    //   console.log(
    //     `cell(${x}, ${y} ${this.cells[x][y].stone} `,
    //     'already exist'
    //   );
    //   return false;
    // }

    this.cells[x][y] = {
      stone: color,
      willTurnOverStones: new Map([
        ['light', []],
        ['dark', []]
      ]),
      canPlace: new Map([
        ['light', false],
        ['dark', false]
      ])
    };
    this.board.drawStone(x, y, color === 'dark');
    return true;
  }

  getTurnOverStone(x: number, y: number, color: Color): Position[] {
    // +x方向
    const stonesPlusX: Position[] = [];
    if (x < this.CELL_NUM) {
      let i = x + 1;
      while (
        i < this.CELL_NUM &&
        this.cells[i][y].stone &&
        this.cells[i][y].stone !== color
      ) {
        stonesPlusX.push([i, y]);
        i += 1;
      }
      if (
        i === this.CELL_NUM ||
        !this.cells[i][y].stone ||
        this.cells[i][y].stone !== color
      ) {
        stonesPlusX.length = 0;
      }
    }

    // -x
    const stonesMinusX: Position[] = [];
    if (x > 0) {
      let i = x - 1;
      while (
        i > 0 &&
        this.cells[i][y].stone &&
        this.cells[i][y].stone !== color
      ) {
        stonesMinusX.push([i, y]);
        i -= 1;
      }
      if (
        i === 0 ||
        !this.cells[i][y].stone ||
        this.cells[i][y].stone !== color
      ) {
        stonesMinusX.length = 0;
      }
    }

    // +y
    const stonesPlusY: Position[] = [];
    if (y < this.CELL_NUM) {
      let i = y + 1;
      while (
        i < this.CELL_NUM &&
        this.cells[x][i].stone &&
        this.cells[x][i].stone !== color
      ) {
        stonesPlusY.push([x, i]);
        i += 1;
      }
      if (
        i === this.CELL_NUM ||
        !this.cells[x][i].stone ||
        this.cells[x][i].stone !== color
      ) {
        stonesPlusY.length = 0;
      }
    }

    // -y
    const stonesMinusY: Position[] = [];
    if (y > 0) {
      let i = y - 1;
      while (
        i > 0 &&
        this.cells[x][i].stone &&
        this.cells[x][i].stone !== color
      ) {
        stonesMinusY.push([x, i]);
        i -= 1;
      }
      if (
        i === 0 ||
        !this.cells[x][i].stone ||
        this.cells[x][i].stone !== color
      ) {
        stonesMinusY.length = 0;
      }
    }

    return stonesPlusX
      .concat(stonesMinusX)
      .concat(stonesPlusY)
      .concat(stonesMinusY);
  }

  click(e: MouseEvent): void {
    if (!this.isGaming) return;
    if (!(e.target instanceof Element)) return;
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / this.CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / this.CELL_SIZE);
    console.log(`turn ${this.turn} click ${x}, ${y}`);
    const willTurnOverStones = this.cells[x][y].willTurnOverStones.get(
      this.turn
    );
    console.log({ willTurnOverStones });
    if (!willTurnOverStones || willTurnOverStones.length === 0) {
      console.log('no turn over');
    } else {
      willTurnOverStones.push([x, y]);
      willTurnOverStones.forEach(stone => {
        this.placeDisk(stone[0], stone[1], this.turn);
      });
      this.changeTurn();
    }
  }

  changeTurn(): void {
    if (this.turn === 'dark') {
      this.turn = 'light';
    } else {
      this.turn = 'dark';
    }
    this.judgeCells();
    const turnView = document.getElementById('turn');
    if (turnView && turnView.textContent) {
      turnView.textContent = `${
        this.turn === 'light' ? '白' : '黒'
      }のターンです`;
    }
  }

  start(): void {
    console.log('game start');
    this.isGaming = true;
    this.judgeCells();
  }

  // 各マスに石を置いた時に影響を調べる。
  judgeCells(): void {
    for (let x = 0; x < this.CELL_NUM; x += 1) {
      for (let y = 0; y < this.CELL_NUM; y += 1) {
        const cell = this.cells[x][y];
        if (!cell.stone) {
          const turnOverStonesByDark = this.getTurnOverStone(x, y, 'dark');
          cell.canPlace.set('dark', turnOverStonesByDark.length !== 0);
          cell.willTurnOverStones.set('dark', turnOverStonesByDark);
          const turnOverStonesByLight = this.getTurnOverStone(x, y, 'light');
          cell.canPlace.set('light', turnOverStonesByLight.length !== 0);
          cell.willTurnOverStones.set('light', turnOverStonesByLight);
        }
      }
    }
    console.log(this.cells);
  }
}
