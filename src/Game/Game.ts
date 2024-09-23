import Board from "./Board";
import Canvas from "../Canvas";
import Snake from "./Snake";
import { Vector } from "./Vector";

export enum Direction {
  Up,
  Down,
  Left,
  Right,
}

export enum Speed {
  slow,
  medium,
  fast,
}

export class Game {
  static foodColor: string = "#ff0000";
  static snakeColor: string = "#000000";

  board: Board;
  direction: Direction;
  snake: Snake;
  food: Vector;
  running: boolean;
  uiHandleDeath: () => void;
  directionChanged: boolean;

  private intervalId: NodeJS.Timeout | null = null;

  constructor(
    widthFields: number,
    heightFields: number,
    canvas: Canvas,
    handleDeath: () => void
  ) {
    this.direction = Direction.Right;
    this.board = new Board(widthFields, heightFields, canvas);
    this.snake = new Snake(new Vector(5, 5));
    this.food = new Vector(7, 7);
    this.board.draw(this.snake, this.food);
    this.running = false;
    this.uiHandleDeath = handleDeath;
    this.directionChanged = false;
  }

  reset() {
    this.snake = new Snake(new Vector(5, 5));
    this.food = new Vector(7, 7);
    this.board.draw(this.snake, this.food);
  }

  private tick() {
    const ate = this.checkFood();

    this.snake.move(this.direction, ate);
    const dead = this.checkDead();
    if (dead) {
      return;
    }

    this.directionChanged = false;
    this.board.draw(this.snake, this.food);
  }

  checkFood() {
    if (!this.snake.getHeadPosition()) throw new Error("No Snake Head");
    if (this.snake.getHeadPosition()?.equals(this.food)) {
      this.newFood();
      return true;
    }
    return false;
  }

  private newFood() {
    this.food = Vector.randomIntVector(this.board.getDimensions());
    console.log("this.food", this.food);
  }

  checkDead() {
    if (!this.board.includesSnake(this.snake) || this.snake.hitItself()) {
      this.stopGame();
      this.uiHandleDeath();
      return true;
    }
    return false;
  }
  startGame() {
    console.log("Start Game", this.running);
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this.tick(), 100);
  }

  stopGame() {
    if (this.intervalId) {
      console.log("stop game");
      clearInterval(this.intervalId);
      this.running = false;
    }
  }

  changeDirection(newDir: Direction) {
    //console.log("Changed:", newDir);
    if (this.directionAllowed(newDir)) {
      this.direction = newDir;
      this.directionChanged = true;
    }
  }

  directionAllowed(newDir: Direction) {
    /*
    switch (this.direction) {
      case Direction.Up:
        return newDir !== Direction.Down;
      case Direction.Down:
        return newDir !== Direction.Up;
      case Direction.Left:
        return newDir !== Direction.Right;
      case Direction.Right:
        return newDir !== Direction.Left;
    }
    */
    return this.snake.directionAllowed(newDir);
  }

  destroy() {
    this.stopGame();
  }
}
