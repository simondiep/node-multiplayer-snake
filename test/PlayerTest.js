var assert = require("chai").assert;
var Coordinate = require("../models/coordinate");
var Direction = require("../models/direction");
var Player = require("../models/player");

describe("Player", function() {
    "use strict";
  
    // ---+-  Collision at + sign
    //    --
    it("should determine if it collided with itself", function(done) {
        let player = new Player();
        assert.isFalse(player.hasCollidedWithSelf(), "Player should not have detected collision");
        player.segments = [new Coordinate(4,1),new Coordinate(4,2),new Coordinate(5,2),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.isTrue(player.hasCollidedWithSelf(), "A collision should have been detected");
        done();
    });
    
    it("should move to the next location based on current direction", function(done) {
        let player = new Player();
        player.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        
        player.changeDirection(Direction.RIGHT);
        player.move();
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move right as expected");
        
        player.changeDirection(Direction.DOWN);
        player.move();
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move down as expected");
        
        player.changeDirection(Direction.LEFT);
        player.move();
        expectedSegments = [new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move left as expected");
        
        player.changeDirection(Direction.UP);
        player.move();
        expectedSegments = [new Coordinate(5,1),new Coordinate(5,2),new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move up as expected");
        done();
    });
    
    it("should be able to grow on request", function(done) {
        let player = new Player();
        player.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        player.growNextTurn();
        player.changeDirection(Direction.RIGHT);
        player.move();
        let expectedSegments = [new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move right and grow as expected");
        
        player.changeDirection(Direction.DOWN);
        player.move();
        expectedSegments = [new Coordinate(6,2),new Coordinate(6,1),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1)];
        assert.deepEqual(player.segments, expectedSegments, "Player did not move down or unexpectedly grew");
        done();
    });
});