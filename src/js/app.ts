import Board from './board';
import Game from './game';

const main = (): void => {
  const hello = 'hello world';
  console.log('hi');

  const button = document.getElementById('start');

  const c = document.querySelector('canvas');
  if (!c) return;
  const game = new Game(c);
  if (button) {
    button.onclick = () => console.log('start');
  }
};

main();
