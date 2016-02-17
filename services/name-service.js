"use strict";

class NameService {

    constructor() {
        this.usedPlayerNames = new Set();
    }
    
    doesPlayerNameExist(name) {
        return this.usedPlayerNames.has(name);
    }
    
    getPlayerName() {
        let newPlayerName;
        do {
            newPlayerName = this._generatePlayerName();
        } while (this.usedPlayerNames.has(newPlayerName));
        this.usedPlayerNames.add(newPlayerName);
        return newPlayerName;
    }
    
    returnPlayerName(name) {
        this.usedPlayerNames.delete(name);
    }
    
    usePlayerName(name) {
        this.usedPlayerNames.add(name);
    }
    
    _generatePlayerName() {
        return "Player " + this._getRandomNumber() + this._getRandomNumber() + this._getRandomNumber();
    }
    
    _getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }
}

module.exports = NameService;