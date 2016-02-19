"use strict";

class PlayerStats {

    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.highScore = 0;
        this.deaths = 0;
        //this.kills = 0;
        //this.maxLength = 0;
    }
    
    changeColor(newColor) {
        this.color = newColor;
    }
    
    changeName(newName) {
        this.name = newName;
    }
    
    addDeath() {
        this.deaths++;
    }
    
    increaseScore() {
        this.score++;
        if(this.score > this.highScore) {
            this.highScore = this.score;
        }
    }
    
    resetScore() {
        this.score = 0;
    }
    
    toJSON() {
        return {
            name: this.name,
            color: this.color,
            score: this.score,
            highScore: this.highScore,
            deaths: this.deaths
        };
    }
}

module.exports = PlayerStats;     