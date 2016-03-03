'use strict';
const Player = require('../models/player');
const ServerConfig = require('../configs/server-config');

class AdminService {

    constructor(players, food, playerStatBoard, boardOccupancyService, colorService, nameService, playerSpawnService,
            generateFood, removeFood, disconnectPlayer, sendNotificationToPlayers) {
        this.players = players;
        this.food = food;
        this.playerStatBoard = playerStatBoard;
        this.boardOccupancyService = boardOccupancyService;
        this.colorService = colorService;
        this.nameService = nameService;
        this.playerSpawnService = playerSpawnService;

        this.generateFood = generateFood;
        this.removeFood = removeFood;
        this.disconnectPlayer = disconnectPlayer;
        this.sendNotificationToPlayers = sendNotificationToPlayers;

        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
        this.currentFPS = ServerConfig.STARTING_FPS;
        this.botNames = [];
    }

    changeBots(socket, botOption) {
        const player = this.players[socket.id];
        if (botOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this._addBot(player);
        } else if (botOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            this._removeBot(player);
        } else if (botOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetBots(player);
        }
    }

    changeFood(socket, foodOption) {
        const player = this.players[socket.id];
        let notification = player.name;
        if (foodOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this.generateFood();
            notification += ' has added some food.';
        } else if (foodOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if (Object.keys(this.food).length > 0) {
                this._removeLastFood();
                notification += ' has removed some food.';
            } else {
                notification += ' couldn\'t remove food.';
            }
        } else if (foodOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetFood();
            notification += ' has reset the food.';
        }
        this.sendNotificationToPlayers(notification, player.color);
    }

    changeSpeed(socket, speedOption) {
        const player = this.players[socket.id];
        let notification = player.name;
        if (speedOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            if (this.currentFPS < ServerConfig.MAX_FPS) {
                notification += ' has raised the game speed.';
                this.currentFPS++;
            } else {
                notification += ' tried to raised the game speed past the limit.';
            }
        } else if (speedOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if (this.currentFPS > ServerConfig.MIN_FPS) {
                notification += ' has lowered the game speed.';
                this.currentFPS--;
            } else {
                notification += ' tried to lower the game speed past the limit.';
            }
        } else if (speedOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetSpeed();
            notification += ' has reset the game speed.';
        }
        this.sendNotificationToPlayers(notification, player.color);
    }

    changeStartLength(socket, lengthOption) {
        const player = this.players[socket.id];
        let notification = player.name;
        if (lengthOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            notification += ' has increased the player start length.';
            this.playerStartLength++;
        } else if (lengthOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if (this.playerStartLength > 1) {
                notification += ' has decreased the player start length.';
                this.playerStartLength--;
            } else {
                notification += ' tried to lower the player start length past the limit.';
            }
        } else if (lengthOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetPlayerStartLength();
            notification += ' has reset the player start length.';
        }
        this.sendNotificationToPlayers(notification, player.color);
    }

    getBotNames() {
        return this.botNames;
    }

    getGameSpeed() {
        return this.currentFPS;
    }

    getPlayerStartLength() {
        return this.playerStartLength;
    }

    resetGame() {
        this._resetBots();
        this._resetFood();
        this._resetSpeed();
        this._resetPlayerStartLength();
    }

    _addBot(playerRequestingAddition) {
        if (this.botNames.length >= ServerConfig.MAX_BOTS) {
            this.sendNotificationToPlayers(`${playerRequestingAddition.name} tried to add a bot past the limit.`,
                playerRequestingAddition.color);
            return;
        }
        const newBotName = this.nameService.getBotName();
        const botColor = this.colorService.getColor();
        const newBot = new Player(newBotName, newBotName, botColor);
        this.playerSpawnService.setupNewSpawn(newBot, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY);
        this.players[newBotName] = newBot;
        this.playerStatBoard.addPlayer(newBot.id, newBotName, botColor);
        this.sendNotificationToPlayers(`${newBotName} has joined!`, botColor);
        this.botNames.push(newBotName);
    }

    _removeBot(playerRequestingRemoval) {
        if (this.botNames.length > 0) {
            this.disconnectPlayer(this.botNames.pop());
        } else {
            this.sendNotificationToPlayers(`${playerRequestingRemoval.name} tried to remove a bot that doesn't exist.`,
                playerRequestingRemoval.color);
        }
    }

    _resetBots(player) {
        while (this.botNames.length > ServerConfig.DEFAULT_STARTING_BOTS) {
            this._removeBot(player);
        }
    }

    _removeLastFood() {
        const lastFood = this.food[Object.keys(this.food)[Object.keys(this.food).length - 1]];
        this.removeFood(lastFood.id);
    }

    _resetFood() {
        while (Object.keys(this.food).length > ServerConfig.FOOD.DEFAULT_AMOUNT) {
            this._removeLastFood();
        }
        while (Object.keys(this.food).length < ServerConfig.FOOD.DEFAULT_AMOUNT) {
            this.generateFood();
        }
    }

    _resetPlayerStartLength() {
        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
    }

    _resetSpeed() {
        this.currentFPS = ServerConfig.STARTING_FPS;
    }
}

module.exports = AdminService;
