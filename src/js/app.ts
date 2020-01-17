import Game from './game';

const main = (): void => {
  console.log('hi');

  const c = document.querySelector('canvas');
  if (!c) return;
  const game = new Game(c);
};

main();
