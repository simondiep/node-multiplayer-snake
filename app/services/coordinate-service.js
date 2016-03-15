'use strict';
const Coordinate = require('../models/coordinate');

/**
 * Coordinate arithmetics
 */
class CoordinateService {

    static getNextCoordinate(currentCoordinate, direction) {
        return new Coordinate(currentCoordinate.x + direction.x,
                               currentCoordinate.y + direction.y);
    }

    static movePlayer(player) {
        player.move(this.getNextCoordinate(player.getHeadCoordinate(), player.direction));
    }
}

module.exports = CoordinateService;
