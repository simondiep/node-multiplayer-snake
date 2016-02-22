var assert = require("chai").assert;
var Board = require("../configs/board");
var Coordinate = require("../models/coordinate");
var Direction = require("../models/direction");
var Food = require("../models/food");
var Player = require("../models/player");
var CoordinateService = require("../services/coordinate-service");

describe("CoordinateService", function() {
    "use strict";
  
    const NUMBER_OF_COORDINATES_TO_TEST = 10000;
  
    it("should be able to generate a random food location that is within bounds and not overlapping with any players or food", function(done) {
        let occupiedCoordinates = [new Coordinate(10,10),new Coordinate(20,20),new Coordinate(30,30),new Coordinate(50,10),new Coordinate(40,10),new Coordinate(30,10),new Coordinate(20,10),new Coordinate(10,10),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        for (let i = 0; i < NUMBER_OF_COORDINATES_TO_TEST; i++) {
            let coordinate = CoordinateService.getUnoccupiedCoordinate(occupiedCoordinates);
            // verify coordinate is in bounds
            assert.isTrue(coordinate.x >= 1);
            assert.isTrue(coordinate.x < Board.HORIZONTAL_SQUARES);
            assert.isTrue(coordinate.y >= 1);
            assert.isTrue(coordinate.y < Board.VERTICAL_SQUARES);
            // verify coordinate is not overlapping with snake
            for(let occupiedCoordinate of occupiedCoordinates) {
                assert.isFalse(coordinate.equals(occupiedCoordinate));
            }
        }
        done();
    });
    
    it("should move player to the next location based on current direction", function(done) {
        let player = new Player();
        player.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        player.changeDirection(Direction.RIGHT);
        CoordinateService.movePlayer(player);
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move right as expected");
        
        player.changeDirection(Direction.DOWN);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move down as expected");
        
        player.changeDirection(Direction.LEFT);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move left as expected");
        
        player.changeDirection(Direction.UP);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(5,1),new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move up as expected");
        done();
    });
    
    it("should be able to grow player on request", function(done) {
        let player = new Player();
        player.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        player.growNextTurn();
        player.changeDirection(Direction.RIGHT);
        CoordinateService.movePlayer(player);
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move right and grow as expected");
        
        player.changeDirection(Direction.DOWN);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move down or unexpectedly grew");
        done();
    });
});