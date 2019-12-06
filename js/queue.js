/*
* Queue ini untuk melakukan
* pop: pada brick yang sudah tidak terlihat (dibawah)
* push: menambahkan diatasnya
*/

const Brick = require('./brick');

class Queue {
    constructor() {
        /**
         * @type {Array.<Brick>} Items - Array of Brick
         */
        this.items = [];
    }

    pop() {
        this.items.shift();
    }

    /**
     * @param {Brick} element 
     */
    push(element) {
        this.items.push(element);
    }

    front() {
        return this.items[0];
    }

    back() {
        return this.items[this.size() - 1];
    }

    get(index) {
        return this.items[index];
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