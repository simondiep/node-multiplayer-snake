"use strict";
let FoodConsumed = require("../models/food-consumed");
let KillReport = require("../models/kill-report");
let OccupiedCoordinate = require("../models/occupied-coordinate");

const FOOD_TYPE = "food";
const HEAD_TYPE = "head";
const TAIL_TYPE = "tail";

class BoardOccupancyService {
    constructor() {
        this.occupiedCoordinates = {};
    }
    
    addFoodOccupancy(foodId, foodCoordinate) {
        this._addOccupancy(foodId, foodCoordinate, FOOD_TYPE);
    }
    
    addPlayerOccupancy(playerId, playerCoordinates) {
        this._addOccupancy(playerId, playerCoordinates[0], HEAD_TYPE);
        for( let i = 1; i < playerCoordinates.length; i++) {
            this._addOccupancy(playerId, playerCoordinates[i], TAIL_TYPE);
        }
    }
    
    getFoodsConsumed() {
        let foodsConsumed = [];
        for( let key of Object.keys(this.occupiedCoordinates)) {
            let occupiedCoordinate = this.occupiedCoordinates[key];
            if( occupiedCoordinate.isOccupiedByFoodAndPlayer()) {
                foodsConsumed.push(new FoodConsumed(occupiedCoordinate.foodId, occupiedCoordinate.playerIdsWithHead[0]));
            }
        }
        return foodsConsumed;
    }
    
    getKillReports() {
        let killReports = [];
        for( let key of Object.keys(this.occupiedCoordinates)) {
            let occupiedCoordinate = this.occupiedCoordinates[key];
            if( occupiedCoordinate.isOccupiedByMultiplePlayers()) {
                let killerId = occupiedCoordinate.playerIdWithTail;
                if(killerId) {
                    // Heads collided with a tail
                    for( let playerIdWithHead of occupiedCoordinate.playerIdsWithHead) {
                        killReports.push(new KillReport(killerId, playerIdWithHead));
                    }
                } else {
                    // Heads collided
                    killReports.push(new KillReport(null, null, occupiedCoordinate.playerIdsWithHead));
                }
            }
        }
        return killReports;
    }
    
    getOccupiedCoordinates(coordinate) {
        let occupiedCoordinates = [];
        for( let key of Object.keys(this.occupiedCoordinates)) {
            occupiedCoordinates.push(JSON.parse(key));
        }
        return occupiedCoordinates;
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
        let coordinateString = JSON.stringify(coordinate);
        let occupiedCoordinate = this.occupiedCoordinates[coordinateString];
        
        if(typeof occupiedCoordinate === "undefined") {
            occupiedCoordinate = new OccupiedCoordinate();
            this.occupiedCoordinates[coordinateString] = occupiedCoordinate;
        }
        if(type === FOOD_TYPE) {
            occupiedCoordinate.setFoodId(id);
        } else if(type === HEAD_TYPE) {
            occupiedCoordinate.addPlayerIdWithHead(id);
        } else if(type === TAIL_TYPE) {
            occupiedCoordinate.setPlayerIdWithTail(id);
        }
    }
    
        
    _removeOccupancy(id, coordinate, type) {
        let coordinateString = JSON.stringify(coordinate);
        let occupiedCoordinate = this.occupiedCoordinates[coordinateString];
        if(typeof occupiedCoordinate === "undefined") {
            return;
        }
        if(type === FOOD_TYPE) {
            occupiedCoordinate.setFoodId(false);
        } else if(type === HEAD_TYPE) {
            occupiedCoordinate.removePlayerIdWithHead(id);
        } else if(type === TAIL_TYPE) {
            occupiedCoordinate.setPlayerIdWithTail(false);
        }
    }
}

module.exports = BoardOccupancyService;  