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

    static getValidNextMove(currentDirection) {
        if(currentDirection == Direction.UP) {
            return [Direction.LEFT, Direction.RIGHT];
        }
        if(currentDirection == Direction.DOWN) {
            return [Direction.LEFT, Direction.RIGHT];
        }
        if(currentDirection == Direction.LEFT) {
            return [Direction.UP, Direction.DOWN];
        }
        if(currentDirection == Direction.RIGHT) {
            return [Direction.UP, Direction.DOWN];
        }
    }

    static handleKeyDown(player, keyCode) {
        let newDirection = KEYCODE_TO_DIRECTION[keyCode];
        if(!newDirection) {
            return;
        }
        let validNextDirections = this.getValidNextMove(player.directionBeforeMove);
        for (let validNextDirection of validNextDirections) {
            if(newDirection === validNextDirection) {
                player.changeDirection(newDirection);
                break;
            }
        }
    }
}

module.exports = GameControlsService;