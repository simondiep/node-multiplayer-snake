"use strict";
let PlayerStats = require("./player-stats");

class PlayerStatBoard {

    constructor() {
        this.statBoard = new Map();
    }
    
    addPlayer(playerId, playerName, playerColor) {
        this.statBoard.set(playerId, new PlayerStats(playerName, playerColor));
    }
    
    changePlayerColor(playerId, newColor) {
        this.statBoard.get(playerId).changeColor(newColor);
    }
    
    changePlayerName(playerId, newName) {
        this.statBoard.get(playerId).changeName(newName);
    }
    
    increaseScore(playerId) {
        this.statBoard.get(playerId).increaseScore();
    }
    
    resetScore(playerId) {
        this.statBoard.get(playerId).resetScore();
    }
    
    removePlayer(playerId) {
        this.statBoard.delete(playerId);
    }
    
    toJSON() {
        let response = [];
        this.statBoard.forEach(function(value, key, map) {
            response.push(value); 
        });
        // Sort by score (highest first)
        response.sort(function(stat, anotherStat) {
            return anotherStat.score - stat.score;
        });
        return response;
    }
}

module.exports = PlayerStatBoard;     