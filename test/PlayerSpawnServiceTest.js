const assert = require('chai').assert;
const Coordinate = require('../app/models/coordinate');
const Direction = require('../app/models/direction');
const Player = require('../app/models/player');
const BoardOccupancyService = require('../app/services/board-occupancy-service');
const CoordinateService = require('../app/services/coordinate-service');
const PlayerSpawnService = require('../app/services/player-spawn-service');

describe('PlayerSpawnService', () => {
    'use strict';

    const NUMBER_OF_PLAYERS_TO_SPAWN = 100;
    let player;
    let boardOccupancyService;
    let playerSpawnService;

    beforeEach(() => {
        player = new Player();
        player.changeDirection(Direction.RIGHT);
        boardOccupancyService = new BoardOccupancyService();
        playerSpawnService = new PlayerSpawnService(boardOccupancyService);
        boardOccupancyService.addPlayerOccupancy('player2', [new Coordinate(11, 10)]);
        boardOccupancyService.addPlayerOccupancy('player3', [new Coordinate(11, 11)]);
    });

    it('should spawn player in an unoccupied space with enough spaces ahead', done => {
        const playerLength = 5;
        const requiredFreeLength = 10;

        for (let playersSpawned = 0; playersSpawned < NUMBER_OF_PLAYERS_TO_SPAWN; playersSpawned++) {
            playerSpawnService.setupNewSpawn(player, playerLength, requiredFreeLength);
            assert.equal(player.getSegments().length + player.growAmount, playerLength);

            let currentCoordinate = player.getHeadLocation();
            for (let spacesAhead = 0; spacesAhead < requiredFreeLength - 1; spacesAhead++) {
                currentCoordinate = CoordinateService.getNextCoordinate(currentCoordinate, player.direction);
                assert.isTrue(boardOccupancyService.isSafe(currentCoordinate));
            }
        }
        done();
    });
});
