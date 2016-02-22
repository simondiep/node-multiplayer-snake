"use strict";

class Food {
    constructor(id, coordinate, color) {
        this.id = id;
        this.location = coordinate;
        this.color = color;
    }
    
    setLocation(coordinate) {
        this.location = coordinate;
    }
}

module.exports = Food;