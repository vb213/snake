import Canvas from "../Components/Canvas";
import { DoublyLinkedList } from "./DoublyLinkedList";
import { Direction, Game } from "./Game";
import Snake from "./Snake";
import { Vector } from "./Vector";
import snakeheadimg from "../imgs/snakehead.png";
import snakebodyimg from "../imgs/snakebody.png";
import snaketailimg from "../imgs/snaketail.png";
import snakecornerimg from "../imgs/snakecorner.png";
import foodimg from "../imgs/mouseIMG.png";
import ImageLoader from "./ImageLoader";
import { isThrowStatement } from "typescript";

enum Orientation {
  horizontal,
  vertical,
  CornerLeftUp,
  CornerRightUp,
  CornerLeftDown,
  CornerRightDown,
}

class Board {
  static readonly SNAKEHEAD_INDEX = 0;
  static readonly SNAKEBODY_INDEX = 1;
  static readonly SNAKECORNER_INDEX = 2;
  static readonly SNAKETAIL_INDEX = 3;
  static readonly FOOD_INDEX = 4;

  canvas: Canvas;
  boardFields: Vector[][];
  //Width of a field in pxl
  fieldWidth: number = 0;
  game: Game;
  ready: boolean = false;
  private images: {
    [key1: number]: HTMLImageElement;
  } = {}; // Store loaded images

  constructor(
    widthFields: number,
    heightFields: number,
    c: Canvas,
    game: Game
  ) {
    this.loadImages();
    this.canvas = c;
    this.game = game;
    this.boardFields = Array.from({ length: heightFields }, () =>
      Array(widthFields).fill(null)
    );
    this.initBoardPositions(widthFields, heightFields);
    this.loadImages().then(() => {
      this.ready = true;
      game.onBoardReady();
    });
  }

  //hier weiter
  private async loadImages() {
    const imageLoader = new ImageLoader();
    // Load your images here
    const imagePromises = [
      imageLoader
        .loadImage(snakeheadimg)
        .then((img) => (this.images[Board.SNAKEHEAD_INDEX] = img)),
      imageLoader
        .loadImage(snakebodyimg)
        .then((img) => (this.images[Board.SNAKEBODY_INDEX] = img)),
      imageLoader
        .loadImage(snakecornerimg)
        .then((img) => (this.images[Board.SNAKECORNER_INDEX] = img)),
      imageLoader
        .loadImage(snaketailimg)
        .then((img) => (this.images[Board.SNAKETAIL_INDEX] = img)),
      imageLoader
        .loadImage(foodimg)
        .then((img) => (this.images[Board.FOOD_INDEX] = img)),
    ];

    return Promise.all(imagePromises).then(() => {
      console.log("All images loaded");
    });
  }

  isReady() {
    return this.ready;
  }

  getDimensions() {
    return new Vector(this.boardFields[0].length, this.boardFields.length);
  }
  private initBoardPositions(widthFields: number, heightFields: number) {
    const canvasPixelWidth = this.canvas.props.width;
    const canvasPixelHeight = this.canvas.props.height;
    if (!canvasPixelWidth) return;
    if (!canvasPixelHeight) return;
    this.fieldWidth = canvasPixelWidth / widthFields;

    //Fields are squares
    for (let x = 0; x < widthFields; x++) {
      for (let y = 0; y < heightFields; y++) {
        const xField = x * this.fieldWidth;
        const yField = y * this.fieldWidth;
        this.boardFields[x][y] = new Vector(xField, yField);
      }
    }
  }

  includesSnake(snake: Snake) {
    const headPos = snake.getHeadPosition();
    if (!headPos) return false;
    //console.log("Snake head position", headPos);
    return (
      headPos.y >= 0 &&
      headPos.y < this.boardFields.length &&
      headPos.x >= 0 &&
      headPos.x < this.boardFields[0].length
    );
  }

  draw() {
    const snake = this.game.getSnake();
    const food = this.game.getFood();
    this.canvas.cleanUpCanvas();
    this.drawFood(food);
    this.drawSnake(snake);
  }

  private drawFood(food: Vector) {
    this.drawIMG(this.images[Board.FOOD_INDEX], food);
    //const pixelPosition = this.getPixelPositionOnBoard(food);
    //this.canvas.fillSquare(pixelPosition, 20, "#ff0000");
  }

  private drawSnake(snake: Snake) {
    const body: DoublyLinkedList<Vector> = snake.getBody();
    body.print();
    this.drawHead(snake.getHeadPosition());
    body.forEachExceptHeadAndTail(this.drawBodyElement.bind(this));
    if (!snake.hasLengthOne()) {
      this.drawTail(snake.getTailPosition());
    }
  }

  private drawHead(head: Vector) {
    this.drawIMG(this.images[Board.SNAKEHEAD_INDEX], head);
  }

  private drawTail(tail: Vector) {
    this.drawIMG(this.images[Board.SNAKETAIL_INDEX], tail);
  }

  private drawBodyElement(bodyElement: Vector, prev: Vector, next: Vector) {
    const orientation: Orientation = this.getOrientation(
      bodyElement,
      prev,
      next
    );
    const [img, rotation]: [HTMLImageElement, number] =
      this.getBodyImageFromOrientation(orientation);
    this.drawIMG(img, bodyElement, rotation);
  }

  getBodyImageFromOrientation(
    orientation: Orientation
  ): [HTMLImageElement, number] {
    switch (orientation) {
      case Orientation.horizontal:
        return [this.images[Board.SNAKEBODY_INDEX], 0];
      case Orientation.vertical:
        return [this.images[Board.SNAKEBODY_INDEX], 90];
      case Orientation.CornerLeftDown:
        return [this.images[Board.SNAKECORNER_INDEX], 0];
      case Orientation.CornerLeftUp:
        return [this.images[Board.SNAKECORNER_INDEX], 90];
      case Orientation.CornerRightDown:
        return [this.images[Board.SNAKECORNER_INDEX], 180];
      case Orientation.CornerRightUp:
        return [this.images[Board.SNAKECORNER_INDEX], 270];
    }
  }
  private getOrientation(
    bodyElement: Vector,
    prev: Vector,
    next: Vector
  ): Orientation {
    const diffPrev: Vector = prev.subtract(bodyElement);
    const diffNext: Vector = next.subtract(bodyElement);
    const diff: Vector = diffNext.add(diffPrev);

    if (diff.equals(new Vector(1, 1))) {
      return Orientation.CornerLeftUp;
    } else if (diff.equals(new Vector(1, -1))) {
      return Orientation.CornerLeftDown;
    } else if (diff.equals(new Vector(-1, -1))) {
      return Orientation.CornerRightDown;
    } else if (diff.equals(new Vector(-1, 1))) {
      return Orientation.CornerRightUp;
    } else if (diff.equals(Vector.NULL_VECTOR)) {
      return (prev.x = next.x ? Orientation.vertical : Orientation.horizontal);
    }
    //return Orientation.vertical;
    console.log(bodyElement, prev, next);

    throw new Error("Orientation error");
  }

  private drawIMG(
    img: HTMLImageElement,
    fieldPosition: Vector,
    rotation: number = 0
  ) {
    const pixelPosition = this.getPixelPositionOnBoard(fieldPosition);
    //this.canvas.fillSquare(pixelPosition, 20, "#000000");
    this.canvas.drawImage(
      pixelPosition,
      this.fieldWidth,
      this.fieldWidth,
      img,
      rotation
    );
  }

  private getPixelPositionOnBoard(vector: Vector) {
    return this.boardFields[vector.x][vector.y];
  }
}

export default Board;
