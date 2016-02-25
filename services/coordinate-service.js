"use strict";
const Coordinate = require("../models/coordinate");
class CoordinateService {

    static getNextCoordinate(currentCoordinate, direction) {
         return new Coordinate(currentCoordinate.x + direction.x,
                               currentCoordinate.y + direction.y);
    }
    
    static movePlayer(player) {
        player.move(this.getNextCoordinate(player.getHeadLocation(), player.direction));
    }
}

module.exports = CoordinateService;