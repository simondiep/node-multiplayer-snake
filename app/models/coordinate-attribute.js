'use strict';

class CoordinateAttribute {
    constructor() {
        this.wall = false;
        this.permanentWall = false;
        this.foodId = false;
        this.playerIdWithTail = false;
        this._playerIdsWithHead = [];
    }

    getPlayerIdsWithHead() {
        return this._playerIdsWithHead.slice(0);
    }

    isOccupied() {
        return this.wall || this.foodId || this.playerIdWithTail || this._playerIdsWithHead.length > 0;
    }

    isOccupiedByFoodAndPlayer() {
        return this.foodId && this._playerIdsWithHead.length > 0;
    }

    isOccupiedByMultiplePlayers() {
        return this._playerIdsWithHead.length >= 2 || (this._playerIdsWithHead.length === 1 && this.playerIdWithTail);
    }

    isSafe() {
        return !this.wall && !this.playerIdWithTail && this._playerIdsWithHead.length === 0;
    }

    isPermanentWall() {
        return this.permanentWall;
    }

    isWall() {
        return this.wall;
    }

    addPlayerIdWithHead(playerIdWithHead) {
        this._playerIdsWithHead.push(playerIdWithHead);
    }

    removePlayerIdWithHead(playerIdWithHead) {
        const indexOfHead = this._playerIdsWithHead.indexOf(playerIdWithHead);
        this._playerIdsWithHead.splice(indexOfHead, 1);
    }

    setFoodId(foodId) {
        this.foodId = foodId;
    }

    setPlayerIdWithTail(playerIdWithTail) {
        this.playerIdWithTail = playerIdWithTail;
    }

    setPermanentWall() {
        this.permanentWall = true;
        this.wall = true;
    }

    setWall(isWall) {
        if (!this.permanentWall) {
            this.wall = isWall;
        }
    }
}

module.exports = CoordinateAttribute;
