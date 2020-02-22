import Game from '#/js/game';
import 'jest-canvas-mock';

describe('game', (): void => {
  test('always ok', (): void => {
    const txt = 'game';
    expect(txt).toBe('game');
    const c = document.createElement('canvas');
    const game = new Game(c);
    expect(game.isGaming).toBe(false);

    // 'コンストラクト'
    // '初期の配置'
    // '勝敗'
    // '裏返り'
    // '初期におけるところ'
  });
  test('初期の配置', (): void => {
    const c = document.createElement('canvas');
    const game = new Game(c);
    game.reset();
    expect(game.cells[3][3].stone).toBe('light');
    expect(game.cells[3][4].stone).toBe('dark');
    expect(game.cells[4][3].stone).toBe('dark');
    expect(game.cells[4][4].stone).toBe('light');

    // '勝敗'
    // '裏返り'
    // '初期におけるところ'
  });
  // game start
  test('isStart', (): void => {
    const c = document.createElement('canvas');
    const game = new Game(c);
    expect(game.isGaming).toBe(false);
    game.start();
    expect(game.isGaming).toBe(true);
  });
  // click

  // '勝敗'
  // '裏返り'
  // '初期におけるところ'
  // 黒番から始まる
  // ここは置けるよね
  // ひっくり返ったか
});

// updater
// draw board
// drow stones
