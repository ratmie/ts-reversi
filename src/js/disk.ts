type Color = 'light' | 'dark';

export default class Disk {
  private color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  getColor(): Color {
    return this.color;
  }

  turnOver(): void {
    switch (this.color) {
      case 'light':
        this.color = 'dark';
        break;
      case 'dark':
        this.color = 'light';
        break;
      default:
        throw Error('disk color is invalid');
    }
  }
}
