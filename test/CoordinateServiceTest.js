var assert = require("chai").assert;
var Board = require("../configs/board");
var Coordinate = require("../models/coordinate");
var Food = require("../models/food");
var Player = require("../models/player");
var CoordinateService = require("../services/coordinate-service");

describe("CoordinateService", function() {
    "use strict";
  
    const NUMBER_OF_COORDINATES_TO_TEST = 10000;
  
    it("should be able to generate a random food location that is within bounds and not overlapping with any players or food", function(done) {
        let existingFood = [];
        let existingPlayers = {};
        
        existingFood.push(new Food(new Coordinate(10,10), "green"));
        existingFood.push(new Food(new Coordinate(20,20), "green"));
        existingFood.push(new Food(new Coordinate(30,30), "green"));
        
        let player1 = new Player(1, "p1", "red");
        player1.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        existingPlayers[1] = player1;
        
        let player2 = new Player(2, "p2", "red");
        player2.segments = [new Coordinate(50,10),new Coordinate(40,10),new Coordinate(30,10),new Coordinate(20,10),new Coordinate(10,10)];
        existingPlayers[2] = player2;
        
        for (let i = 0; i < NUMBER_OF_COORDINATES_TO_TEST; i++) {
            let coordinate = CoordinateService.getUnoccupiedCoordinate(existingFood, existingPlayers);
            // verify coordinate is in bounds
            assert.isTrue(coordinate.x >= 1);
            assert.isTrue(coordinate.x < Board.HORIZONTAL_SQUARES);
            assert.isTrue(coordinate.y >= 1);
            assert.isTrue(coordinate.y < Board.VERTICAL_SQUARES);
            // verify coordinate is not overlapping with snake
            for(let playerLocation of player1.segments) {
                assert.isFalse(coordinate.equals(playerLocation));
            }
            for(let playerLocation of player2.segments) {
                assert.isFalse(coordinate.equals(playerLocation));
            }
            for(let food of existingFood) {
                assert.isFalse(coordinate.equals(food.location));
            }
        }
        done();
    });
});