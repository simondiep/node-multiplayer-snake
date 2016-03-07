'use strict';
const Board = require('../configs/board');
const ServerConfig = require('../configs/server-config');
const Player = require('../models/player');

const ValidationService = require('../services/validation-service');

class PlayerService {

    constructor(playerContainer, playerStatBoard, boardOccupancyService, colorService, imageService,
            nameService, notificationService, playerSpawnService, runGameCycle) {
        this.playerContainer = playerContainer;
        this.playerStatBoard = playerStatBoard;
        this.boardOccupancyService = boardOccupancyService;
        this.colorService = colorService;
        this.imageService = imageService;
        this.nameService = nameService;
        this.notificationService = notificationService;
        this.playerSpawnService = playerSpawnService;
        this.runGameCycle = runGameCycle;
    }

    init(getPlayerStartLength) {
        this.getPlayerStartLength = getPlayerStartLength;
    }

    // previousName and previousImage are optional
    addPlayer(socket, previousName, previousImage) {
        const playerName = this.nameService.getPlayerName();
        const playerColor = this.colorService.getColor();
        const newPlayer = new Player(socket.id, playerName, playerColor);
        this.playerSpawnService.setupNewSpawn(newPlayer, this.getPlayerStartLength(),
            ServerConfig.SPAWN_TURN_LEEWAY);
        this.playerContainer.addPlayer(newPlayer);
        this.playerStatBoard.addPlayer(newPlayer.id, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.BOARD_INFO, Board);
        this.notificationService.broadcastNotification(`${playerName} has joined!`, playerColor);
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

    playerJoinGame(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        this.playerContainer.removeSpectatingPlayer(player.id);
        this.respawnPlayer(player);
        this.notificationService.broadcastNotification(`${player.name} has rejoined the game.`, player.color);
    }

    playerSpectateGame(playerId) {
        const player = this.playerContainer.getPlayer(playerId);
        this.boardOccupancyService.removePlayerOccupancy(player.id, player.getSegments());
        this.playerContainer.addSpectatingPlayer(player.id);
        player.clearAllSegments();
        this.notificationService.broadcastNotification(`${player.name} is now spectating.`, player.color);
    }

    respawnPlayer(player) {
        this.playerSpawnService.setupNewSpawn(player, this.getPlayerStartLength(),
            ServerConfig.SPAWN_TURN_LEEWAY);
        this.playerStatBoard.resetScore(player.id);
        this.playerStatBoard.addDeath(player.id);
    }
}

module.exports = PlayerService;
