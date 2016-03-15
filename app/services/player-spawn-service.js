'use strict';
const Direction = require('../models/direction');

/**
 * Spawns and/or respawns a player with other entities in mind
 */
class PlayerSpawnService {

    constructor(boardOccupancyService) {
        this.boardOccupancyService = boardOccupancyService;
    }

    // Try to spawn the player in a safe area with enough time to react.  Otherwise don't spawn player if no safe areas
    setupNewSpawn(player, playerLength, requiredFreeLength) {
        let spawnCoordinate;
        let newDirection;

        if (Math.random() < 0.5) {
            // Horizontal
            const randomValue = Math.random();
            if (randomValue < 0.25) {
                // Top Left
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedHorizontalCoordinatesFromTopLeft(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.LEFT;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                } else {
                    newDirection = Direction.RIGHT;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                }
            } else if (randomValue < 0.5) {
                // Top Right
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedHorizontalCoordinatesFromTopRight(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.LEFT;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                } else {
                    newDirection = Direction.RIGHT;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                }
            } else if (randomValue < 0.75) {
                // Bottom Right
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedHorizontalCoordinatesFromBottomRight(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.LEFT;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                } else {
                    newDirection = Direction.RIGHT;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                }
            } else {
                // Bottom Left
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedHorizontalCoordinatesFromBottomLeft(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.LEFT;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                } else {
                    newDirection = Direction.RIGHT;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                }
            }
        } else {
            // Vertical
            const randomValue = Math.random();
            if (randomValue < 0.25) {
                // Top Left
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedVerticalCoordinatesFromTopLeft(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.UP;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                } else {
                    newDirection = Direction.DOWN;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                }
            } else if (randomValue < 0.5) {
                // Top Right
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedVerticalCoordinatesFromTopRight(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.UP;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                } else {
                    newDirection = Direction.DOWN;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                }
            } else if (randomValue < 0.75) {
                // Bottom Right
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedVerticalCoordinatesFromBottomRight(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.UP;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                } else {
                    newDirection = Direction.DOWN;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                }
            } else {
                // Bottom Left
                const possibleSpawnCoordinates =
                    this.boardOccupancyService.getUnoccupiedVerticalCoordinatesFromBottomLeft(requiredFreeLength);
                if (possibleSpawnCoordinates.length === 0) {
                    return;
                }
                if (Math.random() < 0.5) {
                    newDirection = Direction.UP;
                    spawnCoordinate = possibleSpawnCoordinates[0];
                } else {
                    newDirection = Direction.DOWN;
                    spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length - 1];
                }
            }
        }
        this.boardOccupancyService.addPlayerOccupancy(player.id, [spawnCoordinate]);
        player.setStartingSpawn(newDirection, spawnCoordinate, playerLength - 1);
    }
}

module.exports = PlayerSpawnService;
