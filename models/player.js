"use strict";

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.growQueued = false;
        this.moveCounter = 0;
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
    
    move(newHeadLocation) {
        // Record the last drawn player direction, to limit the player from moving too quickly back into themselves
        this.directionBeforeMove = this.direction;
        if(this.growQueued) {
            this.growQueued = false;
        } else {
            // pop tail and make it the head
            this.segments.pop();
        }
        this.segments.unshift(newHeadLocation);
        this.moveCounter++;
    }
    
    setDirectionAndStartingLocation(newDirection, newStartingLocation) {
        this.direction = newDirection;
        this.directionBeforeMove = newDirection;
        this.growQueued = false;
        this.segments = newStartingLocation;
        this.moveCounter = 0;
    }
    
    setBase64Image(base64Image) {
        this.base64Image = base64Image;
    }
    
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            direction: this.direction,
            segments: this.segments,
            color: this.color,
            moveCounter: this.moveCounter,
            base64Image: this.base64Image
        };
    }
}

module.exports = Player;    