type Color = 'light' | 'dark';

export default class Disk {
  private color: Color;

  constructor(color: Color) {
    this.color = color;
  }

  getColor(): Color {
    return this.color;
  }
}
