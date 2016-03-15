'use strict';
const Board = require('../configs/board');
const Coordinate = require('../models/coordinate');
const CoordinateAttribute = require('../models/coordinate-attribute');
const FoodConsumed = require('../models/food-consumed');
const KillReport = require('../models/kill-report');

const FOOD_TYPE = 'food';
const HEAD_TYPE = 'head';
const TAIL_TYPE = 'tail';
const WALL_TYPE = 'wall';

/**
 * Keeps track of where everything is located on a board
 */
class BoardOccupancyService {
    constructor() {
        this.maxColumn = Board.HORIZONTAL_SQUARES;
        this.maxRow = Board.VERTICAL_SQUARES;
        this.initializeBoard();
    }

    initializeBoard() {
        // initialize 2d array
        this.board = new Array(this.maxColumn);
        for (let column = 0; column <= this.maxColumn; column++) {
            this.board[column] = new Array(this.maxRow);
            for (let row = 0; row <= this.maxRow; row++) {
                this.board[column][row] = new CoordinateAttribute();
                if (column === 0 || row === 0 || column === this.maxColumn || row === this.maxRow) {
                    this.board[column][row].setPermanentWall(true);
                }
            }
        }
    }

    addFoodOccupancy(foodId, foodCoordinate) {
        this._addOccupancy(foodId, foodCoordinate, FOOD_TYPE);
    }

    // Takes in an array of coordinates
    addPlayerOccupancy(playerId, playerCoordinates) {
        this._addOccupancy(playerId, playerCoordinates[0], HEAD_TYPE);
        for (let i = 1; i < playerCoordinates.length; i++) {
            this._addOccupancy(playerId, playerCoordinates[i], TAIL_TYPE);
        }
    }

    addWall(coordinate) {
        this._addOccupancy(null, coordinate, WALL_TYPE);
    }

    getFoodsConsumed() {
        const foodsConsumed = [];
        for (let column = 0; column <= this.maxColumn; column++) {
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupiedByFoodAndPlayer()) {
                    foodsConsumed.push(new FoodConsumed(coordinateAttribute.foodId,
                        coordinateAttribute.getPlayerIdsWithHead()[0]));
                }
            }
        }
        return foodsConsumed;
    }

    getKillReports() {
        const killReports = [];
        for (let column = 0; column <= this.maxColumn; column++) {
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupiedByMultiplePlayers()) {
                    const killerId = coordinateAttribute.playerIdWithTail;
                    if (killerId) {
                        // Heads collided with a tail
                        for (const playerIdWithHead of coordinateAttribute.getPlayerIdsWithHead()) {
                            killReports.push(new KillReport(killerId, playerIdWithHead));
                        }
                    } else {
                        // Heads collided
                        killReports.push(new KillReport(null, null, coordinateAttribute.getPlayerIdsWithHead()));
                    }
                }
            }
        }
        return killReports;
    }

    getRandomUnoccupiedCoordinate() {
        const unoccupiedCoordinates = [];
        for (let column = 0; column <= this.maxColumn; column++) {
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (!coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                }
            }
        }
        if (unoccupiedCoordinates.length === 0) {
            return false;
        }
        return unoccupiedCoordinates[Math.floor(Math.random() * unoccupiedCoordinates.length)];
    }

    getUnoccupiedHorizontalCoordinatesFromTopLeft(requiredFreeLength) {
        for (let row = 0; row <= this.maxRow; row++) {
            let unoccupiedCoordinates = [];
            for (let column = 0; column <= this.maxColumn; column++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedHorizontalCoordinatesFromTopRight(requiredFreeLength) {
        for (let row = 0; row <= this.maxRow; row++) {
            let unoccupiedCoordinates = [];
            for (let column = this.maxColumn; column >= 0; column--) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedHorizontalCoordinatesFromBottomRight(requiredFreeLength) {
        for (let row = this.maxRow; row >= 0; row--) {
            let unoccupiedCoordinates = [];
            for (let column = this.maxColumn; column >= 0; column--) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedHorizontalCoordinatesFromBottomLeft(requiredFreeLength) {
        for (let row = this.maxRow; row >= 0; row--) {
            let unoccupiedCoordinates = [];
            for (let column = 0; column <= this.maxColumn; column++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedVerticalCoordinatesFromTopLeft(requiredFreeLength) {
        for (let column = 0; column <= this.maxColumn; column++) {
            let unoccupiedCoordinates = [];
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedVerticalCoordinatesFromTopRight(requiredFreeLength) {
        for (let column = this.maxColumn; column >= 0; column--) {
            let unoccupiedCoordinates = [];
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedVerticalCoordinatesFromBottomRight(requiredFreeLength) {
        for (let column = this.maxColumn; column >= 0; column--) {
            let unoccupiedCoordinates = [];
            for (let row = this.maxRow; row >= 0; row--) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getUnoccupiedVerticalCoordinatesFromBottomLeft(requiredFreeLength) {
        for (let column = 0; column <= this.maxColumn; column++) {
            let unoccupiedCoordinates = [];
            for (let row = this.maxRow; row >= 0; row--) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column, row));
                    if (unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }

    getWallCoordinates() {
        const wallCoordinates = [];
        for (let column = 0; column <= this.maxColumn; column++) {
            for (let row = 0; row <= this.maxRow; row++) {
                const coordinateAttribute = this.board[column][row];
                if (coordinateAttribute.isWall()) {
                    wallCoordinates.push(new Coordinate(column, row));
                }
            }
        }
        return wallCoordinates;
    }

    isOutOfBounds(coordinate) {
        return coordinate.x < 0 || coordinate.x > this.maxColumn || coordinate.y < 0 || coordinate.y > this.maxRow;
    }

    isSafe(coordinate) {
        const coordinateAttribute = this.board[coordinate.x][coordinate.y];
        return coordinateAttribute.isSafe();
    }

    isPermanentWall(coordinate) {
        const coordinateAttribute = this.board[coordinate.x][coordinate.y];
        return coordinateAttribute.isPermanentWall();
    }

    isWall(coordinate) {
        const coordinateAttribute = this.board[coordinate.x][coordinate.y];
        return coordinateAttribute.isWall();
    }

    removeFoodOccupancy(foodId, foodCoordinate) {
        this._removeOccupancy(foodId, foodCoordinate, FOOD_TYPE);
    }

    removePlayerOccupancy(playerId, playerCoordinates) {
        this._removeOccupancy(playerId, playerCoordinates[0], HEAD_TYPE);
        for (let i = 1; i < playerCoordinates.length; i++) {
            this._removeOccupancy(playerId, playerCoordinates[i], TAIL_TYPE);
        }
    }

    removeWall(coordinate) {
        this._removeOccupancy(null, coordinate, WALL_TYPE);
    }

    _addOccupancy(id, coordinate, type) {
        const coordinateAttribute = this.board[coordinate.x][coordinate.y];
        if (type === FOOD_TYPE) {
            coordinateAttribute.setFoodId(id);
        } else if (type === HEAD_TYPE) {
            coordinateAttribute.addPlayerIdWithHead(id);
        } else if (type === TAIL_TYPE) {
            coordinateAttribute.setPlayerIdWithTail(id);
        } else if (type === WALL_TYPE) {
            coordinateAttribute.setWall(true);
        }
    }


    _removeOccupancy(id, coordinate, type) {
        const coordinateAttribute = this.board[coordinate.x][coordinate.y];
        if (type === FOOD_TYPE) {
            coordinateAttribute.setFoodId(false);
        } else if (type === HEAD_TYPE) {
            coordinateAttribute.removePlayerIdWithHead(id);
        } else if (type === TAIL_TYPE) {
            coordinateAttribute.setPlayerIdWithTail(false);
        } else if (type === WALL_TYPE) {
            coordinateAttribute.setWall(false);
        }
    }
}

module.exports = BoardOccupancyService;
