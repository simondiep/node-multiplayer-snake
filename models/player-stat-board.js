"use strict";
let PlayerStats = require("./player-stats");

class PlayerStatBoard {

    constructor() {
        this.statBoard = new Map();
    }
    
    addDeath(playerId) {
        this.statBoard.get(playerId).addDeath();
    }
    
    addKill(playerId) {
        this.statBoard.get(playerId).addKill();
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
    
    clearPlayerImage(playerId) {
       delete this.statBoard.get(playerId).base64Image; 
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
    
    setBase64Image(playerId, base64Image) {
        this.statBoard.get(playerId).setBase64Image(base64Image);
    }
    
    stealScore(playerId, playerIdToStealFrom) {
        let scoreToSteal = this.statBoard.get(playerIdToStealFrom).score;
        this.statBoard.get(playerId).increaseScore(scoreToSteal);
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