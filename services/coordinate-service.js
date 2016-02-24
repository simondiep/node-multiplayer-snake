"use strict";
let Board = require("../configs/board");
let Coordinate = require("../models/coordinate");
let Direction = require("../models/direction");

class CoordinateService {

    static getNextCoordinate(currentCoordinate, direction) {
         return new Coordinate(currentCoordinate.x + direction.x,
                               currentCoordinate.y + direction.y);
    }

    static getRandomDirection() {
        let keys = Object.keys(Direction);
        return Direction[keys[ keys.length * Math.random() << 0]];
    }
    
    static isOutOfBoundsAfterNMoves(location, n, direction){
        return this.isOutOfBounds(new Coordinate(location.x + (direction.x * n),
                                                 location.y + (direction.y * n)));
    }

    static setStartingLocationAndDirection(player, playerLength, turnLeeway, occupiedCoordinates) {
        let newDirection = this.getRandomDirection();
        let proposedHeadLocation, proposedFutureLocation;
        do {
            proposedHeadLocation = this.getUnoccupiedCoordinate(occupiedCoordinates);
        } while( this.isOutOfBoundsAfterNMoves(proposedHeadLocation, turnLeeway, newDirection) ) ; 
        
        let playerSegments = [];
        for( let i = 0; i < playerLength; i++) {
            playerSegments.push(this._getNextPlayerTailSegment(proposedHeadLocation, newDirection));
        }
        
        player.setDirectionAndStartingLocation(newDirection,playerSegments);
    }
    
    static movePlayer(player) {
        player.move(new Coordinate(player.getHeadLocation().x + player.direction.x, 
                                   player.getHeadLocation().y + player.direction.y));
    }

    static getUnoccupiedCoordinate(occupiedCoordinates) {
        let maxX = Board.HORIZONTAL_SQUARES - 1;
        let maxY = Board.VERTICAL_SQUARES - 1;
        let coordinate, matches;
        do {
            coordinate = new Coordinate(this._getRandomIntegerInRange(1, maxX ),
                                        this._getRandomIntegerInRange(1, maxY ));
            matches = false;
            for(let occupiedCoordinate of occupiedCoordinates) {
                if(coordinate.equals(occupiedCoordinate)) {
                    matches = true;
                    break;
                }
            }
        } while (matches);
        
        return coordinate; 
    }
    
    static isOutOfBounds(coordinate) {
        return (coordinate.x <= 0) ||
               (coordinate.y <= 0) ||
               (coordinate.x >= Board.HORIZONTAL_SQUARES) ||
               (coordinate.y >= Board.VERTICAL_SQUARES);
    }
    
    static _getNextPlayerTailSegment(location, direction) {
        return new Coordinate(location.x + (direction.x * -1),location.y + (direction.y * -1));
    }
    
    static _getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = CoordinateService;