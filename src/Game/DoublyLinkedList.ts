class DoublyListNode<T> {
  value: T;
  next: DoublyListNode<T> | null = null;
  prev: DoublyListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

export class DoublyLinkedList<T> {
  head: DoublyListNode<T> | null = null;
  tail: DoublyListNode<T> | null = null;

  addToFront(value: T): void {
    const newNode = new DoublyListNode(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  removeFromEnd(): void {
    if (!this.tail) return;

    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail.prev;
      if (this.tail) this.tail.next = null;
    }
  }

  forEach(callback: (t: T) => void) {
    if (this.head === null) return;
    let node: DoublyListNode<T> = this.head;
    do {
      callback(node.value);
    } while (node.next !== null);
  }

  print(): void {
    let current = this.head;
    const result: T[] = [];
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    console.log(result);
  }
}
