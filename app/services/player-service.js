'use strict';
const Board = require('../configs/board');
const ServerConfig = require('../configs/server-config');
const Player = require('../models/player');

const ColorService = require('../services/color-service');
const CoordinateService = require('../services/coordinate-service');
const PlayerSpawnService = require('../services/player-spawn-service');
const ValidationService = require('../services/validation-service');

/**
 * Player-related changes
 */
class PlayerService {

    constructor(playerContainer, playerStatBoard, boardOccupancyService, imageService,
            nameService, notificationService, runGameCycle) {
        this.playerContainer = playerContainer;
        this.playerStatBoard = playerStatBoard;
        this.boardOccupancyService = boardOccupancyService;
        this.imageService = imageService;
        this.nameService = nameService;
        this.notificationService = notificationService;
        this.runGameCycle = runGameCycle;

        this.colorService = new ColorService();
        this.playerSpawnService = new PlayerSpawnService(this.boardOccupancyService);
    }

    init(getPlayerStartLength) {
        this.getPlayerStartLength = getPlayerStartLength;
    }

    // previousName and previousImage are optional
    addPlayer(socket, previousName, previousImage) {
        const playerName = this.nameService.getPlayerName();
        const newPlayer = this.createPlayer(socket.id, playerName);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, playerName, newPlayer.color);
        socket.emit(ServerConfig.IO.OUTGOING.BOARD_INFO, Board);
        this.notificationService.broadcastNotification(`${playerName} has joined!`, newPlayer.color);
        const backgroundImage = this.imageService.getBackgroundImage();
        if (backgroundImage) {
            socket.emit(ServerConfig.IO.OUTGOING.NEW_BACKGROUND_IMAGE, backgroundImage);
        }

        const previousNameCleaned = ValidationService.cleanString(previousName);
        if (ValidationService.isValidPlayerName(previousNameCleaned)) {
            this.changePlayerName(socket, previousName);
        }
        if (previousImage) {
            this.imageService.updatePlayerImage(newPlayer.id, previousImage);
        }

        // Start game if the first player has joined
        if (this.playerContainer.getNumberOfPlayers() === 1) {
            console.log('Game Started');
            this.runGameCycle();
        }
    }

    createPlayer(id, name) {
        const player = new Player(id, name, this.colorService.getColor());
        this.playerSpawnService.setupNewSpawn(player, this.getPlayerStartLength(), ServerConfig.SPAWN_TURN_LEEWAY);
        this.playerContainer.addPlayer(player);
        this.playerStatBoard.addPlayer(player.id, player.name, player.color);
        return player;
    }

    changeColor(socket) {
        const player = this.playerContainer.getPlayer(socket.id);
        const newColor = this.colorService.getColor();
        this.colorService.returnColor(player.color);
        player.color = newColor;
        this.playerStatBoard.changePlayerColor(player.id, newColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, player.name, newColor);
        this.notificationService.broadcastNotification(`${player.name} has changed colors.`, newColor);
    }

    changePlayerName(socket, newPlayerName) {
        const player = this.playerContainer.getPlayer(socket.id);
        const oldPlayerName = player.name;
        const newPlayerNameCleaned = ValidationService.cleanString(newPlayerName);
        if (!ValidationService.isValidPlayerName(newPlayerNameCleaned)) {
            console.log(`${player.name} tried changing to an invalid name`);
            return;
        }
        if (oldPlayerName === newPlayerNameCleaned) {
            return;
        }
        if (this.nameService.doesPlayerNameExist(newPlayerNameCleaned)) {
            socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, oldPlayerName, player.color);
            this.notificationService.broadcastNotification(
                `${player.name} couldn't claim the name ${newPlayerNameCleaned}`, player.color);
        } else {
            this.notificationService.broadcastNotification(
                `${oldPlayerName} is now known as ${newPlayerNameCleaned}`, player.color);
            player.name = newPlayerNameCleaned;
            this.nameService.usePlayerName(newPlayerNameCleaned);
            this.playerStatBoard.changePlayerName(player.id, newPlayerNameCleaned);
            socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, newPlayerNameCleaned, player.color);
        }
    }

    disconnectPlayer(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        if (!player) {
            return;
        }
        this.notificationService.broadcastNotification(`${player.name} has left.`, player.color);
        this.colorService.returnColor(player.color);
        this.nameService.returnPlayerName(player.name);
        this.playerStatBoard.removePlayer(player.id);
        if (player.hasSegments()) {
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.getSegments());
        }
        this.playerContainer.removePlayer(player.id);
    }

    handlePlayerCollisions() {
        const killReports = this.boardOccupancyService.getKillReports();
        for (const killReport of killReports) {
            if (killReport.isSingleKill()) {
                const victim = this.playerContainer.getPlayer(killReport.victimId);
                if (killReport.killerId === killReport.victimId) {
                    this.notificationService.broadcastSuicide(victim.name, victim.color);
                } else {
                    this.playerStatBoard.addKill(killReport.killerId);
                    this.playerStatBoard.increaseScore(killReport.killerId);
                    this.playerStatBoard.stealScore(killReport.killerId, victim.id);
                    // Steal victim's length
                    this.playerContainer.getPlayer(killReport.killerId).grow(victim.getSegments().length);
                    const killer = this.playerContainer.getPlayer(killReport.killerId);
                    this.notificationService.broadcastKill(killer.name, victim.name, killer.color, victim.color,
                        victim.getSegments().length);
                    this.notificationService.notifyPlayerMadeAKill(killReport.killerId);
                }
                this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.getSegments());
                victim.clearAllSegments();
                this.playerContainer.addPlayerIdToRespawn(victim.id);
                this.notificationService.notifyPlayerDied(victim.id);
            } else {
                const victimSummaries = [];
                for (const victimId of killReport.getVictimIds()) {
                    const victim = this.playerContainer.getPlayer(victimId);
                    this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.getSegments());
                    victim.clearAllSegments();
                    this.playerContainer.addPlayerIdToRespawn(victim.id);
                    victimSummaries.push({ name: victim.name, color: victim.color });
                    this.notificationService.notifyPlayerDied(victim.id);
                }
                if (victimSummaries.length > 0) {
                    this.notificationService.broadcastKillEachOther(victimSummaries);
                }
            }
        }
    }

    movePlayers() {
        for (const player of this.playerContainer.getPlayers()) {
            if (this.playerContainer.isSpectating(player.id)) {
                continue;
            }
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.getSegments());
            CoordinateService.movePlayer(player);
            if (this.boardOccupancyService.isOutOfBounds(player.getHeadCoordinate()) ||
                    this.boardOccupancyService.isWall(player.getHeadCoordinate())) {
                player.clearAllSegments();
                this.playerContainer.addPlayerIdToRespawn(player.id);
                this.notificationService.broadcastRanIntoWall(player.name, player.color);
                this.notificationService.notifyPlayerDied(player.id);
            } else {
                this.boardOccupancyService.addPlayerOccupancy(player.id, player.getSegments());
            }
        }
    }

    playerJoinGame(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        this.playerContainer.removeSpectatingPlayerId(player.id);
        this.respawnPlayer(playerId);
        this.notificationService.broadcastNotification(`${player.name} has rejoined the game.`, player.color);
    }

    playerSpectateGame(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        this.boardOccupancyService.removePlayerOccupancy(player.id, player.getSegments());
        this.playerContainer.addSpectatingPlayerId(player.id);
        player.clearAllSegments();
        this.notificationService.broadcastNotification(`${player.name} is now spectating.`, player.color);
    }

    respawnPlayer(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        this.playerSpawnService.setupNewSpawn(player, this.getPlayerStartLength(),
            ServerConfig.SPAWN_TURN_LEEWAY);
        this.playerStatBoard.resetScore(player.id);
        this.playerStatBoard.addDeath(player.id);
        this.playerContainer.removePlayerIdToRespawn(player.id);
    }

    respawnPlayers() {
        for (const playerId of this.playerContainer.getPlayerIdsToRespawn()) {
            this.respawnPlayer(playerId);
        }
    }
}

module.exports = PlayerService;
