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

  hasLengthOne() {
    return this.head === this.tail;
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

    while (node) {
      callback(node.value);
      node = node.next;
    }
  }

  forEachExceptHeadAndTail(callback: (t: T, t_prev: T, t_next: T) => void) {
    if (this.head === null) return;
    let node: DoublyListNode<T> | null = this.head.next;
    while (node && node.next && node.prev) {
      callback(node.value, node.prev.value, node.next.value);
      node = node.next;
    } //while node != head
  }

  get(i: number) {
    if (!this.head) throw new Error("Index out of bounds!");
    return this.internalGet(i, this.head);
  }

  private internalGet(i: number, node: DoublyListNode<T>): T {
    if (i === 0) {
      return node.value;
    }
    if (!node.next) throw new Error("Index out of bounds!");
    return this.internalGet(i - 1, node.next);
  }

  print(): void {
    let current = this.head;
    const result: T[] = [];
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    console.log("Body:");
    result.forEach((r) => {
      console.log(r);
    });
  }
}
