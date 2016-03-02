const assert = require('chai').assert;
const Coordinate = require('../app/models/coordinate');
const Player = require('../app/models/player');
const BoardOccupancyService = require('../app/services/board-occupancy-service');

describe('BoardOccupancyService', () => {
    'use strict';

    let boardOccupancyService;

    beforeEach(() => {
        boardOccupancyService = new BoardOccupancyService();
    });

    it('should detect no kills', done => {
        const player1 = new Player(1);
        player1.segments = [new Coordinate(5, 1),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1),
                            new Coordinate(2, 1),
                            new Coordinate(1, 1)];
        const player2 = new Player(2);
        player2.segments = [new Coordinate(5, 2),
                            new Coordinate(4, 2),
                            new Coordinate(3, 2),
                            new Coordinate(2, 2),
                            new Coordinate(1, 2)];
        const player3 = new Player(3);
        player3.segments = [new Coordinate(5, 3),
                            new Coordinate(4, 3),
                            new Coordinate(3, 3),
                            new Coordinate(2, 3),
                            new Coordinate(1, 3)];
        const player4 = new Player(4);
        player4.segments = [new Coordinate(5, 4),
                            new Coordinate(4, 4),
                            new Coordinate(3, 4),
                            new Coordinate(2, 4),
                            new Coordinate(1, 4)];

        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);

        const killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 0);
        done();
    });

    it('should detect a single player kill', done => {
        const player1 = new Player(1);
        player1.segments = [new Coordinate(4, 2),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1),
                            new Coordinate(2, 1),
                            new Coordinate(1, 1)];
        const player2 = new Player(2);
        player2.segments = [new Coordinate(5, 2),
                            new Coordinate(4, 2),
                            new Coordinate(3, 2),
                            new Coordinate(2, 2),
                            new Coordinate(1, 2)];
        const player3 = new Player(3);
        player3.segments = [new Coordinate(5, 3),
                            new Coordinate(4, 3),
                            new Coordinate(3, 3),
                            new Coordinate(2, 3),
                            new Coordinate(1, 3)];
        const player4 = new Player(4);
        player4.segments = [new Coordinate(5, 4),
                            new Coordinate(4, 4),
                            new Coordinate(3, 4),
                            new Coordinate(2, 4),
                            new Coordinate(1, 4)];

        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);

        const killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 1);
        assert.equal(killReports[0].killerId, 2);
        assert.equal(killReports[0].victimId, 1);
        done();
    });

    it('should detect multiple kills', done => {
        const player1 = new Player(1);
        player1.segments = [new Coordinate(4, 2),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1),
                            new Coordinate(2, 1),
                            new Coordinate(1, 1)];
        const player2 = new Player(2);
        player2.segments = [new Coordinate(5, 2),
                            new Coordinate(4, 2),
                            new Coordinate(3, 2),
                            new Coordinate(2, 2),
                            new Coordinate(1, 2)];
        const player3 = new Player(3);
        player3.segments = [new Coordinate(4, 2),
                            new Coordinate(4, 3),
                            new Coordinate(3, 3),
                            new Coordinate(2, 3),
                            new Coordinate(1, 3)];
        const player4 = new Player(4);
        player4.segments = [new Coordinate(4, 3),
                            new Coordinate(4, 4),
                            new Coordinate(3, 4),
                            new Coordinate(2, 4),
                            new Coordinate(1, 4)];

        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);
        boardOccupancyService.addPlayerOccupancy(player2.id, player2.segments);
        boardOccupancyService.addPlayerOccupancy(player3.id, player3.segments);
        boardOccupancyService.addPlayerOccupancy(player4.id, player4.segments);

        const killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 3);
        assert.equal(killReports[0].killerId, 2);
        assert.equal(killReports[0].victimId, 1);
        assert.equal(killReports[1].killerId, 2);
        assert.equal(killReports[1].victimId, 3);
        assert.equal(killReports[2].killerId, 3);
        assert.equal(killReports[2].victimId, 4);
        done();
    });

    it('should determine if a player has collided with itself', done => {
        const player1 = new Player(1);
        player1.segments = [new Coordinate(4, 2),
                            new Coordinate(4, 1),
                            new Coordinate(4, 2)];

        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);

        const killReports = boardOccupancyService.getKillReports();

        assert.equal(killReports.length, 1);
        assert.equal(killReports[0].killerId, 1);
        assert.equal(killReports[0].victimId, 1);
        done();
    });

    it('should detect food consumed by player', done => {
        const foodId = 'food1';
        const foodLocation = new Coordinate(4, 2);

        boardOccupancyService.addFoodOccupancy(foodId, foodLocation);

        const player1 = new Player(1);
        player1.segments = [new Coordinate(4, 2),
                            new Coordinate(4, 1),
                            new Coordinate(3, 1),
                            new Coordinate(2, 1),
                            new Coordinate(1, 1)];

        boardOccupancyService.addPlayerOccupancy(player1.id, player1.segments);

        let foodsConsumed = boardOccupancyService.getFoodsConsumed();

        assert.equal(foodsConsumed.length, 1);
        assert.equal(foodsConsumed[0].foodId, foodId);
        assert.equal(foodsConsumed[0].playerId, player1.id);

        boardOccupancyService.removeFoodOccupancy(foodId, foodLocation);
        foodsConsumed = boardOccupancyService.getFoodsConsumed();

        assert.equal(foodsConsumed.length, 0);
        done();
    });
});
