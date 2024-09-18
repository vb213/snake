import { DoublyLinkedList } from "./DoublyLinkedList";
import { Direction } from "./Game";
import { Vector } from "./Vector";

function directionMap(d: Direction): Vector {
  switch (d) {
    case Direction.Up:
      console.log("Up");
      return new Vector(0, -1);
    case Direction.Down:
      console.log("Down");
      return new Vector(0, 1);
    case Direction.Left:
      console.log("Left");
      return new Vector(-1, 0);
    case Direction.Right:
      console.log("Right");
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

  move(direction: Direction) {
    const dirVec = directionMap(direction);
    if (!dirVec) return;
    const newHead = this.body.head?.value.add(dirVec);
    if (!newHead) return;
    this.body.addToFront(newHead);
    this.body.removeFromEnd();
  }

  getBody(): DoublyLinkedList<Vector> {
    return this.body;
  }
}

export default Snake;
