import { DoublyLinkedList } from "./DoublyLinkedList";
import { Direction } from "./Game";
import { Vector } from "./Vector";

function directionMap(d: Direction): Vector {
  switch (d) {
    case Direction.Up:
      return new Vector(0, -1);
    case Direction.Down:
      return new Vector(0, 1);
    case Direction.Left:
      return new Vector(-1, 0);
    case Direction.Right:
      return new Vector(1, 0);
  }
}

/*
let dirMap = new Map<Direction, Vector>([
  [Direction.Up, new Vector(0, -1)],
  [Direction.Down, new Vector(0, 1)],
  [Direction.Left, new Vector(-1, 0)],
  [Direction.Right, new Vector(1, 0)],
]);
*/

class Snake {
  private body: DoublyLinkedList<Vector>;
  constructor(startVector: Vector) {
    this.body = new DoublyLinkedList<Vector>();
    this.body.addToFront(startVector);
  }

  getHeadPosition() {
    if (this.body.head === null) throw new Error("Snake has length 0");
    return this.body.getHead();
  }

  move(direction: Direction, ate: boolean) {
    const dirVec = directionMap(direction);
    if (!dirVec) throw new Error("dirVec undefined");
    const newHead = this.body.getHead()?.add(dirVec);
    if (!newHead) throw new Error("newHead undefined");

    this.body.addToFront(newHead);
    if (!ate) {
      console.log("no ate");
      this.body.removeFromEnd();
    }
  }

  getBody(): DoublyLinkedList<Vector> {
    return this.body;
  }

  hitItself() {
    let hitItself = false;
    let head = this.getHeadPosition();
    this.body.forEachExceptHead((b) => {
      if (head && b.equals(head)) {
        hitItself = true;
      }
    });
    return hitItself;
  }

  private getSecondPosition() {
    if (this.body.head?.next) {
      return this.body.head?.next.value;
    }
  }
  directionAllowed(dir: Direction) {
    const dirVec: Vector = directionMap(dir);
    const secondPos = this.getSecondPosition();
    if (!secondPos) return true;
    return !this.getHeadPosition()?.add(dirVec).equals(secondPos);
  }
}

export default Snake;
