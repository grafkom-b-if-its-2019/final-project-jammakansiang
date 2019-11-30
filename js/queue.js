/*
* Queue ini untuk melakukan
* pop: pada brick yang sudah tidak terlihat (dibawah)
* push: menambahkan diatasnya
*/
class Queue {
    constructor() {
        this.items = [];
    }

    pop() {
        this.items.shift();
    }

    push(element) {
        this.items.push(element);
    }

    front() {
        return this.items[0];
    }

    back() {
        return this.items[this.size() - 1];
    }

    set(item) {
        var index = this.size() - 1;
        this.items[index] = item;
    }

    size() {
        return this.items.length;
    }
}

module.exports = Queue;