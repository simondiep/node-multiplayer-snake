'use strict';
const CoordinateService = require('../services/coordinate-service');
const GameControlsService = require('../services/game-controls-service');

/**
 * Bot-direction changing logic
 */
class BotDirectionService {

    constructor(boardOccupancyService) {
        this.boardOccupancyService = boardOccupancyService;
    }

    /**
     * Check if the next 2 spaces are occupied.
     * Then check the next 2 left and right spaces
     * Then check the adjacent left and right spaces
     */
    changeDirectionIfInDanger(bot) {
        if (!this.isBotInDanger(bot.getHeadCoordinate(), bot.direction, 2)) {
            return;
        }
        const zeroOrOne = this._getRandomIntegerInRange(0, 1);
        const newDirectionOptions = GameControlsService.getValidNextMove(bot.direction);
        const newDirection = newDirectionOptions[zeroOrOne];
        if (!this.isBotInDanger(bot.getHeadCoordinate(), newDirection, 2)) {
            bot.changeDirection(newDirection);
            return;
        }
        newDirectionOptions.splice(zeroOrOne, 1);
        const otherNewDirection = newDirectionOptions[0];
        if (!this.isBotInDanger(bot.getHeadCoordinate(), otherNewDirection, 2)) {
            bot.changeDirection(otherNewDirection);
            return;
        }
        if (!this.isBotInDanger(bot.getHeadCoordinate(), newDirection, 1)) {
            bot.changeDirection(newDirection);
            return;
        }
        if (!this.isBotInDanger(bot.getHeadCoordinate(), otherNewDirection, 1)) {
            bot.changeDirection(otherNewDirection);
            return;
        }
    }

    changeToRandomDirection(bot) {
        const newDirectionOptions = GameControlsService.getValidNextMove(bot.direction);
        const zeroOrOne = this._getRandomIntegerInRange(0, 1);
        const newDirection = newDirectionOptions[zeroOrOne];
        bot.changeDirection(newDirection);
    }

    isBotInDanger(currentCoordinate, direction, turnsToLookAhead) {
        let coordinate = currentCoordinate;
        for (let i = 0; i < turnsToLookAhead; i++) {
            const nextCoordinate = CoordinateService.getNextCoordinate(coordinate, direction);
            coordinate = nextCoordinate;
            const isOutOfBounds = this.boardOccupancyService.isOutOfBounds(nextCoordinate);
            if (isOutOfBounds) {
                return true;
            }
            const isSafe = this.boardOccupancyService.isSafe(nextCoordinate);
            if (!isSafe) {
                return true;
            }
        }
        return false;
    }

    _getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = BotDirectionService;
