const assert = require('chai').assert;
const Coordinate = require('../models/coordinate');
const Direction = require('../models/direction');
const Player = require('../models/player');
const CoordinateService = require('../services/coordinate-service');

describe('CoordinateService', () => {
    'use strict';

    it('should move player to the next location based on current direction', done => {
        const player = new Player();
        player.segments = [new Coordinate(5, 1),
                           new Coordinate(4, 1),
                           new Coordinate(3, 1),
                           new Coordinate(2, 1),
                           new Coordinate(1, 1)];

        player.changeDirection(Direction.RIGHT);
        CoordinateService.movePlayer(player);
        let expectedSegments = [new Coordinate(6, 1),
                                new Coordinate(5, 1),
                                new Coordinate(4, 1),
                                new Coordinate(3, 1),
                                new Coordinate(2, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move right as expected');

        player.changeDirection(Direction.DOWN);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(6, 2),
                            new Coordinate(6, 1),
                            new Coordinate(5, 1),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move down as expected');

        player.changeDirection(Direction.LEFT);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(5, 2),
                            new Coordinate(6, 2),
                            new Coordinate(6, 1),
                            new Coordinate(5, 1),
                            new Coordinate(4, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move left as expected');

        player.changeDirection(Direction.UP);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(5, 1),
                            new Coordinate(5, 2),
                            new Coordinate(6, 2),
                            new Coordinate(6, 1),
                            new Coordinate(5, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move up as expected');
        done();
    });

    it('should be able to grow player on request', done => {
        const player = new Player();
        player.segments = [new Coordinate(5, 1),
                           new Coordinate(4, 1),
                           new Coordinate(3, 1),
                           new Coordinate(2, 1),
                           new Coordinate(1, 1)];
        player.growNextTurn();
        player.changeDirection(Direction.RIGHT);
        CoordinateService.movePlayer(player);
        let expectedSegments = [new Coordinate(6, 1),
                                new Coordinate(5, 1),
                                new Coordinate(4, 1),
                                new Coordinate(3, 1),
                                new Coordinate(2, 1),
                                new Coordinate(1, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move right and grow as expected');

        player.changeDirection(Direction.DOWN);
        CoordinateService.movePlayer(player);
        expectedSegments = [new Coordinate(6, 2),
                            new Coordinate(6, 1),
                            new Coordinate(5, 1),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1),
                            new Coordinate(2, 1)];
        assert.deepEqual(player.segments, expectedSegments, 'Player did not move down or unexpectedly grew');
        done();
    });
});
