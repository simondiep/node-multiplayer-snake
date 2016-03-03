'use strict';

class Food {
    constructor(id, coordinate, type, color) {
        this.id = id;
        this.location = coordinate;
        this.type = type;
        this.color = color;
    }

    setLocation(coordinate) {
        this.location = coordinate;
    }
}

module.exports = Food;
