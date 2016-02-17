"use strict";
let Coordinate = require("./coordinate");
let Direction = require("./direction");

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.direction = Direction.RIGHT;
        this.directionBeforeMove = Direction.RIGHT;
        this.growQueued = false;
        this.segments = this._generateSegments();
    }
    
    changeDirection(newDirection) {
        this.direction = newDirection;
    }
    
    getHeadLocation() {
        return this.segments[0];
    }
    
    // Growing is not done immediately, but on the next turn
    growNextTurn() {
        this.growQueued = true;
    }
    
    hasCollidedWithSelf() {
        let headSegment = this.getHeadLocation();
        return (this.segments.slice(1).filter(
            function(segment) {
                return segment.equals(headSegment);
            }).length > 0);
    }
    
    move() {
        // Record the last drawn player direction, to limit the player from moving too quickly back into themselves
        this.directionBeforeMove = this.direction;
        if(this.growQueued) {
            this.growQueued = false;
        } else {
            // pop tail and make it the head
            this.segments.pop();
        }
        this.segments.unshift(this._getNextHeadLocation());
    }
    
    reset() {
        this.direction = Direction.RIGHT;
        this.directionBeforeMove = Direction.RIGHT;
        this.growQueued = false;
        this.segments = this._generateSegments();
    }
    
    _generateSegments() {
        return [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
    }
    
    _getNextHeadLocation() {
        return new Coordinate(this.getHeadLocation().x + this.direction.x, 
                              this.getHeadLocation().y + this.direction.y);
    }
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            direction: this.direction,
            segments: this.segments,
            color: this.color
        };
    }
}

module.exports = Player;    