class LRUCache {
  // capacity = cache size
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = {};
    this.head = null;
    this.tail = null;
  }

  get() {}

  put(key, value) {
    // if key already exists in cache object
    if (this.cache[key]) {
      this.cache[key].value = value;
      // move it to the front
    } else {
      // doesn't exist in the cache object
      if (Object.keys(this.cache).length === this.capacity) {
        // this.removeLast()
      }
      this.addToFront(key, value);
    }
  }

  addToFront(key, value) {
    const newNode = { key, value, next: null };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.cache[key] = value;
  }

  moveToFront(key) {
    const current = this.cache[key];

    if (current === this.head) return;

    let previous = null;
    let node = this.head;

    while (node && node.key !== key) {
      previous = node;
      node = node.next;
    }

    if (!node) return;

    if (node === this.tail) {
      this.tail = previous;
    }

    if (previous) {
      previous.next = node.next;
    }

    node.next = this.head;
    this.head = node;
  }

  removeLast() {
    if (!this.head) return;

    const lastKey = this.tail.key;
    delete this.cache[lastKey];

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else {
      let current = this.head;
      while (current.next !== this.tail) {}
    }
  }
}
