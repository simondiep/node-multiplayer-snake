"use strict";
const ServerConfig = require("../configs/server-config");
const ValidationService = require("../services/validation-service");

class ImageService {

    constructor(players, playerStatBoard, sendNotificationToPlayers) {
        this.players = players;
        this.playerStatBoard = playerStatBoard;
        this.sendNotificationToPlayers = sendNotificationToPlayers;
        this.backgroundImage = false;
    }

    setIo(io) {
        this.io = io;
    }

    clearBackgroundImage(socket) {
        if (this.backgroundImage) {
            const player = this.players[socket.id];
            this.backgroundImage = false;
            this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_BACKGROUND_IMAGE);
            this.sendNotificationToPlayers(`${player.name} has clear the background image.`, player.color);
        }
    }

    clearPlayerImage(socket) {
        const player = this.players[socket.id];
        delete player.base64Image;
        this.playerStatBoard.clearPlayerImage(player.id);
        this.sendNotificationToPlayers(`${player.name} has removed their image.`, player.color);
    }

    updateBackgroundImage(socket, base64Image) {
        const player = this.players[socket.id];
        if (!ValidationService.isValidBase64String(base64Image)) {
            console.log(`${player.name} tried uploading an invalid background image`);
            return;
        }
        this.backgroundImage = base64Image;
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_BACKGROUND_IMAGE, this.backgroundImage);
        this.sendNotificationToPlayers(`${player.name} has updated the background image.`, player.color);
    }

    updatePlayerImage(socket, base64Image) {
        const player = this.players[socket.id];
        if (!ValidationService.isValidBase64String(base64Image)) {
            console.log(`${player.name} tried uploading an invalid player image`);
            return;
        }
        player.setBase64Image(base64Image);
        this.playerStatBoard.setBase64Image(player.id, base64Image);
        this.sendNotificationToPlayers(`${player.name} has uploaded a new image.`, player.color);
    }

    getBackgroundImage() {
        return this.backgroundImage;
    }

    resetGame() {
        this.backgroundImage = false;
    }
}

module.exports = ImageService;
