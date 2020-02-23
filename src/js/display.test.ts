import Display from '#/js/display';

describe('Disk', (): void => {
  test('construct', (): void => {
    const display = new Display();
    expect(display.constructor.name).toBe('Display');
  });
});
