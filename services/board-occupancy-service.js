"use strict";
let Board = require("../configs/board");
let Coordinate = require("../models/coordinate");
let CoordinateAttribute = require("../models/coordinate-attribute");
let FoodConsumed = require("../models/food-consumed");
let KillReport = require("../models/kill-report");

const FOOD_TYPE = "food";
const HEAD_TYPE = "head";
const TAIL_TYPE = "tail";

class BoardOccupancyService {
    constructor() {
        this.maxColumn = Board.HORIZONTAL_SQUARES;
        this.maxRow = Board.VERTICAL_SQUARES;
        // initialize 2d array
        this.board = new Array( this.maxColumn );
        for (let column=0; column <= this.maxColumn; column++) {
            this.board[column]=new Array(this.maxRow);
            for (let row=0; row <= this.maxRow; row++) {
                this.board[column][row] = new CoordinateAttribute();
                if(column === 0 || row === 0 || column === this.maxColumn || row === this.maxRow) {
                    this.board[column][row].setWall();
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
        for( let i = 1; i < playerCoordinates.length; i++) {
            this._addOccupancy(playerId, playerCoordinates[i], TAIL_TYPE);
        }
    }
    
    getFoodsConsumed() {
        let foodsConsumed = [];
        for (let column=0; column <= this.maxColumn; column++) {
            for (let row=0; row <= this.maxRow; row++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupiedByFoodAndPlayer()) {
                    foodsConsumed.push(new FoodConsumed(coordinateAttribute.foodId, coordinateAttribute.playerIdsWithHead[0]));
                }
            }
        }
        return foodsConsumed;
    }
    
    getKillReports() {
        let killReports = [];
        for (let column=0; column <=this.maxColumn; column++) {
            for (let row=0; row <= this.maxRow; row++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupiedByMultiplePlayers()) {
                    let killerId = coordinateAttribute.playerIdWithTail;
                    if(killerId) {
                        // Heads collided with a tail
                        for( let playerIdWithHead of coordinateAttribute.playerIdsWithHead) {
                            killReports.push(new KillReport(killerId, playerIdWithHead));
                        }
                    } else {
                        // Heads collided
                        killReports.push(new KillReport(null, null, coordinateAttribute.playerIdsWithHead));
                    }
                }
            }
        }
        return killReports;
    }
    
    getRandomUnoccupiedCoordinate() {
        let unoccupiedCoordinates = [];
        for (let column=0; column <= this.maxColumn; column++) {
            for (let row=0; row <= this.maxRow; row++) {
                let coordinateAttribute = this.board[column][row];
                if( !coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                }
            }
        }
        if(unoccupiedCoordinates.length === 0) {
            return false;
        }
        return unoccupiedCoordinates[Math.floor(Math.random() * unoccupiedCoordinates.length)];
    }
    
    getUnoccupiedHorizontalCoordinatesFromTopLeft(requiredFreeLength) {
        for (let row=0; row <= this.maxRow; row++) {
            let unoccupiedCoordinates = [];
            for (let column=0; column <= this.maxColumn; column++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedHorizontalCoordinatesFromTopRight(requiredFreeLength) {
        for (let row=0; row <= this.maxRow; row++) {
            let unoccupiedCoordinates = [];
            for (let column=this.maxColumn; column >= 0; column--) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedHorizontalCoordinatesFromBottomRight(requiredFreeLength) {
        for (let row=this.maxRow; row >= 0; row--) {
            let unoccupiedCoordinates = [];
            for (let column=this.maxColumn; column >= 0; column--) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedHorizontalCoordinatesFromBottomLeft(requiredFreeLength) {
        for (let row=this.maxRow; row >= 0; row--) {
            let unoccupiedCoordinates = [];
            for (let column=0; column <= this.maxColumn; column++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedVerticalCoordinatesFromTopLeft(requiredFreeLength) {
        for (let column=0; column <= this.maxColumn; column++) {
            let unoccupiedCoordinates = [];
            for (let row=0; row <= this.maxRow; row++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedVerticalCoordinatesFromTopRight(requiredFreeLength) {
        for (let column=this.maxColumn; column >= 0; column--) {
            let unoccupiedCoordinates = [];
            for (let row=0; row <= this.maxRow; row++) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedVerticalCoordinatesFromBottomRight(requiredFreeLength) {
        for (let column=this.maxColumn; column >= 0; column--) {
            let unoccupiedCoordinates = [];
            for (let row=this.maxRow; row >= 0; row--) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    getUnoccupiedVerticalCoordinatesFromBottomLeft(requiredFreeLength) {
        for (let column=0; column <= this.maxColumn; column++) {
            let unoccupiedCoordinates = [];
            for (let row=this.maxRow; row >= 0; row--) {
                let coordinateAttribute = this.board[column][row];
                if( coordinateAttribute.isOccupied()) {
                    unoccupiedCoordinates = [];
                } else {
                    unoccupiedCoordinates.push(new Coordinate(column,row));
                    if(unoccupiedCoordinates.length === requiredFreeLength) {
                        return unoccupiedCoordinates;
                    }
                }
            }
        }
        return [];
    }
    
    isOutOfBounds(coordinate) {
        return coordinate.x < 0 || coordinate.x > this.maxColumn || coordinate.y < 0 || coordinate.y > this.maxRow;
    }
        
    isSafe(coordinate) {
        let coordinateAttribute = this.board[coordinate.x][coordinate.y];
        return coordinateAttribute.isSafe();
    }
    
    isWall(coordinate) {
        let coordinateAttribute = this.board[coordinate.x][coordinate.y];
        return coordinateAttribute.isWall();
    }
    
    removeFoodOccupancy(foodId, foodLocation) {
        this._removeOccupancy(foodId, foodLocation, FOOD_TYPE);
    }
    
    removePlayerOccupancy(playerId, playerCoordinates) {
        this._removeOccupancy(playerId, playerCoordinates[0], HEAD_TYPE);
        for( let i = 1; i < playerCoordinates.length; i++) {
            this._removeOccupancy(playerId, playerCoordinates[i], TAIL_TYPE);
        }
    }
    
    _addOccupancy(id, coordinate, type) {
        let coordinateAttribute = this.board[coordinate.x][coordinate.y];
        if(type === FOOD_TYPE) {
            coordinateAttribute.setFoodId(id);
        } else if(type === HEAD_TYPE) {
            coordinateAttribute.addPlayerIdWithHead(id);
        } else if(type === TAIL_TYPE) {
            coordinateAttribute.setPlayerIdWithTail(id);
        }
    }
    
        
    _removeOccupancy(id, coordinate, type) {
        let coordinateAttribute = this.board[coordinate.x][coordinate.y];
        if(type === FOOD_TYPE) {
            coordinateAttribute.setFoodId(false);
        } else if(type === HEAD_TYPE) {
            coordinateAttribute.removePlayerIdWithHead(id);
        } else if(type === TAIL_TYPE) {
            coordinateAttribute.setPlayerIdWithTail(false);
        }
    }
}

module.exports = BoardOccupancyService;  