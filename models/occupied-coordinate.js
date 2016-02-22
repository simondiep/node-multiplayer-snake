"use strict";

class OccupiedCoordinate {
    constructor() {
        this.foodId = false;
        this.playerIdWithTail = false;
        this.playerIdsWithHead = [];
    }

    isOccupiedByFoodAndPlayer() {
        return this.foodId && this.playerIdsWithHead.length > 0;
    }
    
    isOccupiedByMultiplePlayers() {
        return this.playerIdsWithHead.length >= 2 || (this.playerIdsWithHead.length === 1 && this.playerIdWithTail);
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
}

module.exports = OccupiedCoordinate;  