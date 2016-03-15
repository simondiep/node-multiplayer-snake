'use strict';
const Direction = require('../models/direction');

const KEYCODE_TO_DIRECTION = {
    // WASD and arrow keys
    87: Direction.UP,
    65: Direction.LEFT,
    83: Direction.DOWN,
    68: Direction.RIGHT,
    38: Direction.UP,
    37: Direction.LEFT,
    40: Direction.DOWN,
    39: Direction.RIGHT,
};

/**
 * Handles client inputs
 */
class GameControlsService {

    static getValidNextMove(currentDirection) {
        if (currentDirection === Direction.UP) {
            return [Direction.LEFT, Direction.RIGHT];
        }
        if (currentDirection === Direction.DOWN) {
            return [Direction.LEFT, Direction.RIGHT];
        }
        if (currentDirection === Direction.LEFT) {
            return [Direction.UP, Direction.DOWN];
        }
        if (currentDirection === Direction.RIGHT) {
            return [Direction.UP, Direction.DOWN];
        }
        throw new Error(`Invalid direction ${currentDirection}`);
    }

    static handleKeyDown(player, keyCode) {
        const newDirection = KEYCODE_TO_DIRECTION[keyCode];
        if (!newDirection) {
            return;
        }
        const validNextDirections = this.getValidNextMove(player.directionBeforeMove);
        for (const validNextDirection of validNextDirections) {
            if (newDirection === validNextDirection) {
                player.changeDirection(newDirection);
                break;
            }
        }
    }
}

module.exports = GameControlsService;
