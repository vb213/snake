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

  getHead() {
    return this.head?.value;
  }

  getTail() {
    return this.tail?.value;
  }

  addToEnd(value: T): void {
    const newNode = new DoublyListNode<T>(value);
    let oldTail: DoublyListNode<T> | null = this.tail;
    this.tail = newNode;
    if (oldTail === null) {
      this.head = this.tail;
    } else {
      oldTail.next = this.tail;
      this.tail.prev = oldTail;
    }
  }
  forEach(callback: (t: T) => void) {
    if (this.head === null) return;
    let node: DoublyListNode<T> | null = this.head;
    do {
      callback(node.value);
      node = node.next;
    } while (node);
  }

  forEachExceptHead(callback: (t: T) => void) {
    if (this.head === null) return;
    let node: DoublyListNode<T> | null = this.head.next;
    if (node === null) return;
    do {
      callback(node.value);
      node = node.next;
    } while (node);
  }

  print(): void {
    let current = this.head;
    const result: T[] = [];
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    result.forEach((r) => {
      console.log(r);
    });
  }
}
