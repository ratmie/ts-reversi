// 石のテスト
// 裏返す
import Disk from '#/js/disk';

describe('Disk', (): void => {
  test('construct', (): void => {
    const light = new Disk('light');
    expect(light.getColor()).toBe('light');

    const dark = new Disk('dark');
    expect(dark.getColor()).toBe('dark');
  });

  test('turn over', (): void => {
    let disk = new Disk('light');
    disk.turnOver();
    expect(disk.getColor()).toBe('dark');

    disk = new Disk('dark');
    disk.turnOver();
    expect(disk.getColor()).toBe('light');
  });
});
