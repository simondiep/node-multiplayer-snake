'use strict';

class PlayerStats {

    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.score = 0;
        this.highScore = 0;
        this.deaths = 0;
        this.kills = 0;
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

    addKill() {
        this.kills++;
    }

    increaseScore(scoreAmount) {
        let amountToIncrease = scoreAmount;
        if (!amountToIncrease) {
            amountToIncrease = 1;
        }
        this.score += amountToIncrease;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    resetScore() {
        this.score = 0;
    }

    setBase64Image(base64Image) {
        this.base64Image = base64Image;
    }

    toJSON() {
        return {
            name: this.name,
            color: this.color,
            score: this.score,
            highScore: this.highScore,
            deaths: this.deaths,
            kills: this.kills,
            base64Image: this.base64Image,
        };
    }
}

module.exports = PlayerStats;
