import Canvas from "../Components/Canvas";
import { DoublyLinkedList } from "./DoublyLinkedList";
import { Direction, Game } from "./Game";
import Snake from "./Snake";
import { Vector } from "./Vector";
import snakeheadimg from "../imgs/snakehead.png";
import snakebodyimg from "../imgs/snakebody.png";
import snaketailimg from "../imgs/snaketail.png";
import foodimg from "../imgs/mouseIMG.png";
import ImageLoader from "./ImageLoader";

class Board {
  canvas: Canvas;
  boardFields: Vector[][];
  //Width of a field in pxl
  fieldWidth: number = 0;
  game: Game;
  ready: boolean = false;
  private images: { [key: string]: HTMLImageElement } = {}; // Store loaded images

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
        .then((img) => (this.images["snakehead"] = img)),
      imageLoader
        .loadImage(snakebodyimg)
        .then((img) => (this.images["snakebody"] = img)),
      imageLoader
        .loadImage(snaketailimg)
        .then((img) => (this.images["snaketail"] = img)),
      imageLoader.loadImage(foodimg).then((img) => (this.images["food"] = img)),
    ];
    console.log("after load", this.images["food"]);

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
    console.log("draw: ", this.canvas === Game.staticcanvas);
    const snake = this.game.getSnake();
    const food = this.game.getFood();
    this.canvas.cleanUpCanvas();
    this.drawFood(food);
    this.drawSnake(snake);
  }

  private drawFood(food: Vector) {
    this.drawIMG(this.images["food"], food);
    //const pixelPosition = this.getPixelPositionOnBoard(food);
    //this.canvas.fillSquare(pixelPosition, 20, "#ff0000");
  }

  private drawSnake(snake: Snake) {
    const body: DoublyLinkedList<Vector> = snake.getBody();
    this.drawHead(snake.getHeadPosition());
    body.forEachExceptHeadAndTail(this.drawBodyElement.bind(this));
    if (!snake.hasLengthOne()) {
      this.drawTail(snake.getTailPosition());
    }
  }

  private drawHead(head: Vector) {
    this.drawIMG(this.images["snakehead"], head);
  }

  private drawTail(tail: Vector) {
    this.drawIMG(this.images["snaketail"], tail);
  }

  private drawBodyElement(bodyElement: Vector) {
    this.drawIMG(this.images["snakebody"], bodyElement);
  }

  private drawIMG(img: HTMLImageElement, fieldPosition: Vector) {
    const pixelPosition = this.getPixelPositionOnBoard(fieldPosition);
    //this.canvas.fillSquare(pixelPosition, 20, "#000000");
    console.log("Draw Image: ", img);
    this.canvas.drawImage(pixelPosition, this.fieldWidth, this.fieldWidth, img);
  }

  private getPixelPositionOnBoard(vector: Vector) {
    return this.boardFields[vector.x][vector.y];
  }
}

export default Board;
