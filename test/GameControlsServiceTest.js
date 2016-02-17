var assert = require("chai").assert;
var GameControlsService = require("../services/game-controls-service");
var Direction = require("../models/direction");
var Player = require("../models/player");

describe("GameControlsService", function() {
    "use strict";
  
    it("should not allow a player to move backwards", function(done) {
        let player = new Player();
        player.direction = Direction.RIGHT;
        player.directionBeforeMove = Direction.RIGHT;
        assert.isTrue(GameControlsService._isInvalidDirection(player, Direction.RIGHT));
        assert.isTrue(GameControlsService._isInvalidDirection(player, Direction.LEFT));
        assert.isFalse(GameControlsService._isInvalidDirection(player, Direction.UP));
        
        player.direction = Direction.UP;
        player.directionBeforeMove = Direction.RIGHT;
        assert.isTrue(GameControlsService._isInvalidDirection(player, Direction.UP));
        assert.isTrue(GameControlsService._isInvalidDirection(player, Direction.LEFT));
        assert.isFalse(GameControlsService._isInvalidDirection(player, Direction.RIGHT));
        
        done();
    });
});