var assert = require("chai").assert;
var Coordinate = require("../models/coordinate");
var Player = require("../models/player");

describe("Player", function() {
    "use strict";
  
    // ---+-  Collision at + sign
    //    --
    it("should determine if it collided with itself", function(done) {
        let player = new Player();
        player.segments = [new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.isFalse(player.hasCollidedWithSelf(), "Player should not have detected collision");
        player.segments = [new Coordinate(4,1),new Coordinate(4,2),new Coordinate(5,2),new Coordinate(5,1),new Coordinate(4,1),new Coordinate(3,1),new Coordinate(2,1),new Coordinate(1,1)];
        assert.isTrue(player.hasCollidedWithSelf(), "A collision should have been detected");
        done();
    });
});