"use strict";
let PlayerStats = require("./player-stats");

class ScoreBoard {

    constructor() {
        this.scoreBoard = new Map();
    }
    
    addPlayer(playerId, playerName, playerColor) {
        this.scoreBoard.set(playerId, new PlayerStats(playerName, playerColor));
    }
    
    changePlayerName(playerId, newName) {
        this.scoreBoard.get(playerId).changeName(newName);
    }
    
    increaseScore(playerId) {
        this.scoreBoard.get(playerId).increaseScore();
    }
    
    resetScore(playerId) {
        this.scoreBoard.get(playerId).resetScore();
    }
    
    removePlayer(playerId) {
        this.scoreBoard.delete(playerId);
    }
    
    toJSON() {
        let response = [];
        this.scoreBoard.forEach(function(value, key, map) {
            response.push(value); 
        });
        // Sort by score (highest first)
        response.sort(function(stat, anotherStat) {
            return anotherStat.score - stat.score;
        });
        return response;
    }
}

module.exports = ScoreBoard;     