"use strict";
let Direction = require("../models/direction");

const KEYCODE_TO_DIRECTION = {
    87 : Direction.UP,    //W
    65 : Direction.LEFT,  //A
    83 : Direction.DOWN,  //S
    68 : Direction.RIGHT, //D
    38 : Direction.UP,    //up arrow
    37 : Direction.LEFT,  //left arrow
    40 : Direction.DOWN,  //down arrow
    39 : Direction.RIGHT  //right arrow
};

class GameControlsService {

    static handleKeyDown(player, keyCode) {
        let newDirection = KEYCODE_TO_DIRECTION[keyCode];
        if(!this._isInvalidDirection(player, newDirection)) {
            player.changeDirection(newDirection); 
        }
    }

    // Check if a new direction is going backwards
    static _isInvalidDirection(player, newDirection) {
        return (!newDirection) ||
            (newDirection == player.direction) ||
            (newDirection == Direction.UP && player.directionBeforeMove == Direction.DOWN) ||
            (newDirection == Direction.DOWN && player.directionBeforeMove == Direction.UP) ||
            (newDirection == Direction.LEFT && player.directionBeforeMove == Direction.RIGHT) ||
            (newDirection == Direction.RIGHT && player.directionBeforeMove == Direction.LEFT);
    }
}

module.exports = GameControlsService;