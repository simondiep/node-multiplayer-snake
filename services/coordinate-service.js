"use strict";
let Coordinate = require("../models/coordinate");
class CoordinateService {

    static getNextCoordinate(currentCoordinate, direction) {
         return new Coordinate(currentCoordinate.x + direction.x,
                               currentCoordinate.y + direction.y);
    }
    
    static movePlayer(player) {
        player.move(new Coordinate(player.getHeadLocation().x + player.direction.x, 
                                   player.getHeadLocation().y + player.direction.y));
    }
}

module.exports = CoordinateService;