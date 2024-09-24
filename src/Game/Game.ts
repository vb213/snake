import Board from "./Board";
import Canvas from "../Components/Canvas";
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
  currentScore: number;
  onScoreUpdate: (score: number) => void;
  animator: Animator;
  private intervalId: NodeJS.Timeout | null = null;

  static staticcanvas: Canvas;
  constructor(
    widthFields: number,
    heightFields: number,
    canvas: Canvas,
    handleDeath: () => void
  ) {
    this.direction = Direction.Right;

    this.board = new Board(widthFields, heightFields, canvas, this);
    this.snake = new Snake(new Vector(5, 5));
    this.food = new Vector(7, 9);
    this.running = false;
    this.uiHandleDeath = handleDeath;
    this.directionChanged = false;
    this.currentScore = 0;
    this.animator = new Animator(this.board.draw.bind(this.board));
    //assumed to be replaced
    this.onScoreUpdate = (score) => {
      throw new Error("No score ui update function!!");
    };
    Game.staticcanvas = canvas;
  }

  onBoardReady() {
    if (this.isReady()) {
      this.board.draw();
    }
  }

  reset() {
    this.snake = new Snake(new Vector(5, 5));
    this.newFood();
    this.currentScore = 0;
    this.updateScoreUI();
  }

  private tick() {
    const ate = this.checkFood();

    this.snake.move(this.direction, ate);
    const dead = this.checkDead();
    if (dead) {
      return;
    }

    this.directionChanged = false;
    this.board.draw();
  }

  setOnScoreUpdate(onScoreUpdate: (score: number) => void) {
    this.onScoreUpdate = onScoreUpdate;
  }

  updateScoreUI() {
    this.onScoreUpdate(this.currentScore);
  }

  private increaseScore() {
    this.currentScore += 12345;
    this.updateScoreUI();
  }

  getScore() {
    return this.currentScore;
  }

  checkFood() {
    if (!this.snake.getHeadPosition()) throw new Error("No Snake Head");
    if (this.snake.getHeadPosition()?.equals(this.food)) {
      this.increaseScore();
      this.newFood();
      return true;
    }
    return false;
  }

  private newFood() {
    this.food = Vector.randomIntVector(this.board.getDimensions());
  }

  checkDead() {
    if (!this.board.includesSnake(this.snake) || this.snake.hitItself()) {
      this.stopGame();
      this.uiHandleDeath();
      return true;
    }
    return false;
  }

  isReady() {
    return this.board.isReady();
  }

  startGame() {
    if (this.running) return;
    if (this.isReady()) {
      this.running = true;
      this.intervalId = setInterval(() => this.tick(), 50); // start game logic
      this.animator.start();
    } else {
      setTimeout(this.startGame.bind(this), 100);
    }
  }

  stopGame() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.animator.stop();
      this.running = false;
    }
  }

  getSnake() {
    return this.snake;
  }

  getFood() {
    return this.food;
  }
  changeDirection(newDir: Direction) {
    if (this.directionAllowed(newDir)) {
      this.direction = newDir;
      this.directionChanged = true;
    }
  }

  directionAllowed(newDir: Direction) {
    if (!this.snake.directionAllowed(newDir)) {
      return false;
    }
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
  }

  destroy() {
    this.stopGame();
  }
}

class Animator {
  private updateFunction: () => void;
  private requestId: number | null;

  constructor(updateFunction: () => void) {
    this.updateFunction = updateFunction;
    this.requestId = null;
  }

  // Start the animation loop
  start(): void {
    const animate = () => {
      this.updateFunction(); // Calls the function passed from the component
      this.requestId = requestAnimationFrame(animate); // Loop the animation
    };
    this.requestId = requestAnimationFrame(animate); // Start the loop
  }

  // Stop the animation
  stop(): void {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId); // Stops the animation
      this.requestId = null; // Reset the requestId
    }
  }
}
