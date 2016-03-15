'use strict';

class Food {
    constructor(id, coordinate, type, color) {
        this.id = id;
        this.coordinate = coordinate;
        this.type = type;
        this.color = color;
    }

    setCoordinate(coordinate) {
        this.coordinate = coordinate;
    }
}

module.exports = Food;
