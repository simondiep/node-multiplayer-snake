'use strict';
const ServerConfig = require('../configs/server-config');

/**
 * Admin-specific functionality
 */
class AdminService {

    constructor(playerContainer, foodService, nameService, notificationService, playerService) {
        this.playerContainer = playerContainer;
        this.foodService = foodService;
        this.nameService = nameService;
        this.notificationService = notificationService;
        this.playerService = playerService;

        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
        this.currentFPS = ServerConfig.STARTING_FPS;
        this.botIds = [];
    }

    changeBots(playerId, botOption) {
        const player = this.playerContainer.getPlayer(playerId);
        if (botOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this._addBot(player);
        } else if (botOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            this._removeBot(player);
        } else if (botOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetBots(player);
        }
    }

    changeFood(playerId, foodOption) {
        const player = this.playerContainer.getPlayer(playerId);
        let notification = player.name;
        if (foodOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this.foodService.generateSingleFood();
            notification += ' has added some food.';
        } else if (foodOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if (this.foodService.getFoodAmount() > 0) {
                this._removeLastFood();
                notification += ' has removed some food.';
            } else {
                notification += ' couldn\'t remove food.';
            }
        } else if (foodOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetFood();
            notification += ' has reset the food.';
        }
        this.notificationService.broadcastNotification(notification, player.color);
    }

    changeSpeed(playerId, speedOption) {
        const player = this.playerContainer.getPlayer(playerId);
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
        this.notificationService.broadcastNotification(notification, player.color);
    }

    changeStartLength(playerId, lengthOption) {
        const player = this.playerContainer.getPlayer(playerId);
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
        this.notificationService.broadcastNotification(notification, player.color);
    }

    getBotIds() {
        return this.botIds;
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
        if (this.botIds.length >= ServerConfig.MAX_BOTS) {
            this.notificationService.broadcastNotification(
                `${playerRequestingAddition.name} tried to add a bot past the limit.`, playerRequestingAddition.color);
            return;
        }
        const newBotId = this.nameService.getBotId();
        const newBot = this.playerService.createPlayer(newBotId, newBotId);
        this.notificationService.broadcastNotification(`${newBot.name} has joined!`, newBot.color);
        this.botIds.push(newBot.id);
    }

    _removeBot(playerRequestingRemoval) {
        if (this.botIds.length > 0) {
            this.playerService.disconnectPlayer(this.botIds.pop());
        } else {
            this.notificationService.broadcastNotification(
                `${playerRequestingRemoval.name} tried to remove a bot that doesn't exist.`, playerRequestingRemoval.color);
        }
    }

    _resetBots(player) {
        while (this.botIds.length > ServerConfig.DEFAULT_STARTING_BOTS) {
            this._removeBot(player);
        }
    }

    _removeLastFood() {
        this.foodService.removeFood(this.foodService.getLastFoodIdSpawned());
    }

    _resetFood() {
        while (this.foodService.getFoodAmount() > ServerConfig.FOOD.DEFAULT_AMOUNT) {
            this._removeLastFood();
        }
        while (this.foodService.getFoodAmount() < ServerConfig.FOOD.DEFAULT_AMOUNT) {
            this.foodService.generateSingleFood();
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
