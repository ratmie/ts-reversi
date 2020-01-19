import Board from './board';

type Color = 'light' | 'dark';

type Cell = {
  stone: Color | null;
  canPlace: Map<Color, boolean>;
  willTurnOverStones: Map<Color, Position[]>;
};

type Position = [number, number];

export default class Game {
  readonly CELL_NUM = 8;

  readonly CELL_SIZE = 50;

  cells: Cell[][];

  board: Board;

  turn: Color;

  isGaming: boolean;

  score: Map<Color, number>;

  canPlace: Map<Color, number>;

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
    this.score = new Map([
      ['light', 0],
      ['dark', 0]
    ]);
    this.canPlace = new Map([
      ['light', 0],
      ['dark', 0]
    ]);
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
    if (!(x in this.cells && y in this.cells[x])) {
      throw new Error('place disk at out of board');
    }

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

  getTurnOverStoneDirection(
    x: number,
    y: number,
    vecX: number,
    vecY: number,
    color: Color
  ): Position[] {
    if (vecX === 0 && vecY === 0) {
      throw new Error('vector error');
    }
    const stones: Position[] = [];
    if (!(x in this.cells && y in this.cells[x])) {
      console.log('out of bounds');
      return stones;
    }
    let i = x + vecX;
    let j = y + vecY;
    while (
      i in this.cells &&
      j in this.cells[i] &&
      this.cells[i][j].stone &&
      this.cells[i][j].stone !== color
    ) {
      stones.push([i, j]);
      i += vecX;
      j += vecY;
    }
    if (
      !(i in this.cells) ||
      !(j in this.cells[i]) ||
      !this.cells[i][j].stone ||
      this.cells[i][j].stone !== color
    ) {
      stones.length = 0;
    }
    return stones;
  }

  getTurnOverStone(x: number, y: number, color: Color): Position[] {
    return this.getTurnOverStoneDirection(x, y, 1, 0, color)
      .concat(this.getTurnOverStoneDirection(x, y, -1, 0, color))
      .concat(this.getTurnOverStoneDirection(x, y, 0, 1, color))
      .concat(this.getTurnOverStoneDirection(x, y, 0, -1, color))
      .concat(this.getTurnOverStoneDirection(x, y, 1, 1, color))
      .concat(this.getTurnOverStoneDirection(x, y, -1, 1, color))
      .concat(this.getTurnOverStoneDirection(x, y, 1, -1, color))
      .concat(this.getTurnOverStoneDirection(x, y, -1, -1, color));
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
    let scoreDark = 0;
    let scoreLight = 0;
    let canPlaceDark = 0;
    let canPlaceLight = 0;
    for (let x = 0; x < this.CELL_NUM; x += 1) {
      for (let y = 0; y < this.CELL_NUM; y += 1) {
        const cell = this.cells[x][y];
        switch (cell.stone) {
          case 'dark':
            canPlaceDark += 1;
            break;
          case 'light':
            canPlaceLight += 1;
            break;
          default: {
            const turnOverStonesByDark = this.getTurnOverStone(x, y, 'dark');
            cell.canPlace.set('dark', turnOverStonesByDark.length !== 0);
            scoreDark += turnOverStonesByDark.length;
            cell.willTurnOverStones.set('dark', turnOverStonesByDark);
            const turnOverStonesByLight = this.getTurnOverStone(x, y, 'light');
            cell.canPlace.set('light', turnOverStonesByLight.length !== 0);
            scoreLight += turnOverStonesByLight.length;
            cell.willTurnOverStones.set('light', turnOverStonesByLight);
            break;
          }
        }
      }
    }
    this.score.set('dark', scoreDark);
    this.score.set('light', scoreLight);
    this.canPlace.set('dark', canPlaceDark);
    this.canPlace.set('light', canPlaceLight);
    if (canPlaceDark === 0 && canPlaceLight === 0) {
      const winner = scoreDark > scoreLight ? 'dark' : 'light';
      console.log('Game set. ');
      console.log(`${winner} win !!`);
    }
    console.log(this.cells);
  }
}
