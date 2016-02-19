"use strict";
let PlayerStats = require("./player-stats");

class PlayerStatBoard {

    constructor() {
        this.statBoard = new Map();
    }
    
    addDeath(playerId) {
        this.statBoard.get(playerId).addDeath();
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
        // Sort by score (highest first, then least number of deaths)
        response.sort(function(stat, anotherStat) {
            let scoreComparison = anotherStat.score - stat.score;
            if(scoreComparison === 0) {
                return stat.deaths - anotherStat.deaths;
            }
            return scoreComparison;
        });
        return response;
    }
}

module.exports = PlayerStatBoard;     