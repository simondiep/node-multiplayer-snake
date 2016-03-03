'use strict';

class Player {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.growAmount = 0;
        this.moveCounter = 0;
    }

    changeDirection(newDirection) {
        this.direction = newDirection;
    }

    clearAllSegments() {
        this.segments = [];
    }

    getHeadLocation() {
        return this.segments[0];
    }

    // Growing is not done immediately, but on the next turn
    grow(amount) {
        this.growAmount += amount;
    }

    move(newHeadLocation) {
        // Record the last drawn player direction, to limit the player from moving too quickly back into themselves
        this.directionBeforeMove = this.direction;
        if (this.growAmount > 0) {
            this.growAmount--;
        } else {
            // pop tail and make it the head
            this.segments.pop();
        }
        this.segments.unshift(newHeadLocation);
        this.moveCounter++;
    }

    setStartingSpawn(newDirection, headLocation, growAmount) {
        this.direction = newDirection;
        this.directionBeforeMove = newDirection;
        this.growAmount = growAmount;
        this.segments = [headLocation];
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
            base64Image: this.base64Image,
        };
    }
}

module.exports = Player;
