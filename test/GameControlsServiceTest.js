const assert = require("chai").assert;
const Direction = require("../models/direction");
const Player = require("../models/player");
const GameControlsService = require("../services/game-controls-service");

describe("GameControlsService", () => {
    "use strict";

    it("should get valid next moves when moving up", done => {
        const nextMoves = GameControlsService.getValidNextMove(Direction.UP);
        assert.deepEqual(nextMoves, [Direction.LEFT, Direction.RIGHT]);
        done();
    });

    it("should get valid next moves when moving down", done => {
        const nextMoves = GameControlsService.getValidNextMove(Direction.DOWN);
        assert.deepEqual(nextMoves, [Direction.LEFT, Direction.RIGHT]);
        done();
    });

    it("should get valid next moves when moving left", done => {
        const nextMoves = GameControlsService.getValidNextMove(Direction.LEFT);
        assert.deepEqual(nextMoves, [Direction.UP, Direction.DOWN]);
        done();
    });

    it("should get valid next moves when moving right", done => {
        const nextMoves = GameControlsService.getValidNextMove(Direction.RIGHT);
        assert.deepEqual(nextMoves, [Direction.UP, Direction.DOWN]);
        done();
    });

    it("should handle directional key downs and change player direction", done => {
        const player = new Player();
        player.direction = Direction.RIGHT;
        player.directionBeforeMove = Direction.RIGHT;
        let keyCode = 38; // Up arrow
        GameControlsService.handleKeyDown(player, keyCode);
        assert.equal(player.direction, Direction.UP);

        keyCode = 40; // Down arrow
        GameControlsService.handleKeyDown(player, keyCode);
        assert.equal(player.direction, Direction.DOWN);

        player.directionBeforeMove = Direction.UP;
        keyCode = 37; // Left arrow
        GameControlsService.handleKeyDown(player, keyCode);
        assert.equal(player.direction, Direction.LEFT);

        keyCode = 39; // Right arrow
        GameControlsService.handleKeyDown(player, keyCode);
        assert.equal(player.direction, Direction.RIGHT);
        done();
    });

    it("should not handle a non-directional key down", done => {
        const player = new Player();
        player.direction = Direction.RIGHT;
        player.directionBeforeMove = Direction.RIGHT;
        const keyCode = 82; // r
        GameControlsService.handleKeyDown(player, keyCode);
        assert.equal(player.direction, Direction.RIGHT);
        done();
    });
});
