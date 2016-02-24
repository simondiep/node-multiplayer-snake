"use strict";

class CoordinateAttribute {
    constructor() {
        this.wall = false;
        this.foodId = false;
        this.playerIdWithTail = false;
        this.playerIdsWithHead = [];
    }
    
    isOccupied() {
        return this.wall || this.foodId || this.playerIdWithTail || this.playerIdsWithHead.length > 0;
    }

    isOccupiedByFoodAndPlayer() {
        return this.foodId && this.playerIdsWithHead.length > 0;
    }
    
    isOccupiedByMultiplePlayers() {
        return this.playerIdsWithHead.length >= 2 || (this.playerIdsWithHead.length === 1 && this.playerIdWithTail);
    }
    
    isWall() {
        return this.wall;
    }
    
    addPlayerIdWithHead(playerIdWithHead) {
        this.playerIdsWithHead.push(playerIdWithHead);
    }
    
    removePlayerIdWithHead(playerIdWithHead) {
        let indexOfHead = this.playerIdsWithHead.indexOf(playerIdWithHead);
        this.playerIdsWithHead.splice(indexOfHead, 1);
    }
    
    setFoodId(foodId) {
        this.foodId = foodId;
    }
    
    setPlayerIdWithTail(playerIdWithTail) {
        this.playerIdWithTail = playerIdWithTail;
    }
    
    setWall() {
        this.wall = true;
    }
}

module.exports = CoordinateAttribute;  