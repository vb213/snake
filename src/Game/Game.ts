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

  private intervalId: NodeJS.Timeout | null = null;

  constructor(widthFields: number, heightFields: number, canvas: Canvas) {
    this.direction = Direction.Right;
    this.board = new Board(widthFields, heightFields, canvas);
    this.snake = new Snake(new Vector(5, 5));
    this.food = new Vector(7, 7);
    this.board.draw(this.snake, this.food);

    this.startGame();
    setTimeout(() => {
      this.stopGame();
    }, 5000);
  }

  private tick() {
    console.log("Direction:", this.direction);
    this.snake.move(this.direction);
    //check if food
    //prolong snake
    this.board.draw(this.snake, this.food);
  }

  startGame() {
    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stopGame() {
    if (this.intervalId) {
      console.log("stop game");
      clearInterval(this.intervalId);
    }
  }

  changeDirection(newDir: Direction) {
    //console.log("Changed:", newDir);
    this.direction = newDir;
  }

  destroy() {
    this.stopGame();
  }
}
