export class Vector {
  x: number;
  y: number;

  static readonly NULL_VECTOR: Vector = new Vector(0, 0);
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector): Vector {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  subtract(vector: Vector): Vector {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  equals(vector: Vector) {
    return vector.x === this.x && vector.y === this.y;
  }

  static randomIntVector(boundVector: Vector) {
    return new Vector(
      this.getRandomInt(boundVector.x),
      this.getRandomInt(boundVector.y)
    );
  }

  static getRandomInt(n: number): number {
    return Math.floor(Math.random() * n);
  }
}
