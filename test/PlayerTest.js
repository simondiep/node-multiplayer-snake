const assert = require('chai').assert;
const Coordinate = require('../app/models/coordinate');
const Direction = require('../app/models/direction');
const Player = require('../app/models/player');

describe('Player', () => {
    'use strict';

    it('should swap bodies with player', done => {
        const player1 = new Player(1);
        player1._segments = [new Coordinate(4, 2),
                             new Coordinate(4, 1),
                             new Coordinate(3, 1),
                             new Coordinate(2, 1),
                             new Coordinate(1, 1)];
        player1.direction = Direction.DOWN;
        player1.directionBeforeMove = Direction.DOWN;
        player1.growAmount = 1;
        const player2Segments = [new Coordinate(1, 5),
                             new Coordinate(2, 5),
                             new Coordinate(3, 5)];
        const player2Direction = Direction.UP;
        const player2DirectionBeforeMove = Direction.LEFT;
        const player2GrowAmount = 0;

        player1.swapBodies(player2Segments, player2Direction, player2DirectionBeforeMove, player2GrowAmount);
        assert.deepEqual(player1.getSegments(), player2Segments);
        assert.equal(player1.direction, player2Direction);
        assert.equal(player1.directionBeforeMove, player2DirectionBeforeMove);
        assert.equal(player1.growAmount, player2GrowAmount);
        done();
    });
});
