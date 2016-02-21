"use strict";
let Board = require("../configs/board");
let ServerConfig = require("../configs/server-config");

let ColorService = require("../services/color-service");
let GameControlsService = require("../services/game-controls-service");
let CoordinateService = require("../services/coordinate-service");
let NameService = require("../services/name-service");

let Food = require("../models/food");
let Player = require("../models/player");
let PlayerStatBoard = require("../models/player-stat-board");

class GameController {
    constructor(io) {
        this.currentFPS = ServerConfig.DEFAULT_FPS;
        this.players = {};
        this.botNames = [];
        this.food = [];
        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
        for(let i = 0; i < ServerConfig.DEFAULT_FOOD_AMOUNT; i++) {
            this.generateFood();
        }
        this.colorService = new ColorService();
        this.nameService = new NameService();
        this.playerStatBoard = new PlayerStatBoard();
        
        this.io = io;
        let self = this;
        this.io.sockets.on(ServerConfig.IO.DEFAULT_CONNECTION, function (socket) {
            socket.on(ServerConfig.IO.INCOMING.NEW_PLAYER, self._addPlayer.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.NAME_CHANGE, self._changePlayerName.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.COLOR_CHANGE, self._changeColor.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.KEY_DOWN, self._keyDown.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.BOT_CHANGE, self._changeBots.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.FOOD_CHANGE, self._changeFood.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.SPEED_CHANGE, self._changeSpeed.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.START_LENGTH_CHANGE, self._changeStartLength.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD, self._updatePlayerImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.DISCONNECT, self._disconnect.bind(self, socket));
        });
    }
    
    runGameCycle() {
        // Pause and reset the game if there aren't any players
        if(Object.keys(this.players).length - this.botNames.length === 0){
            console.log("Game Paused");
            this._resetBots();
            this._resetFood();
            this._resetSpeed();
            return;
        }
        
        // Change bot direction at intervals
        for(let botName of this.botNames) {
            let bot = this.players[botName];
            if(bot.moveCounter%ServerConfig.BOT_CHANGE_DIRECTION_INTERVAL === 0) {
                let newDirection, isInvalidDirection, willGoOutOfBounds;
                let numberOfRetries = 0;
                do {
                    newDirection = CoordinateService.getRandomDirection();
                    numberOfRetries++;
                    isInvalidDirection = GameControlsService.isInvalidDirection(bot, newDirection);
                    willGoOutOfBounds = CoordinateService.isOutOfBoundsAfterNMoves(bot.getHeadLocation(), ServerConfig.BOT_CHANGE_DIRECTION_INTERVAL, newDirection);
                } while (numberOfRetries < 10 && (isInvalidDirection || willGoOutOfBounds));
                bot.changeDirection(newDirection);
            }
        }
        
        for(let playerId in this.players) {
            CoordinateService.movePlayer(this.players[playerId]);
        }
        
        let losingPlayers = [];
        for(let playerId in this.players) {
            let player = this.players[playerId];
            if(this.hasPlayerLost(player)) {
                losingPlayers.push(player);
                continue;
            }
            
            let playerAteFood = false;
            for(let i = 0; i < this.food.length; i++) {
                if(this.food[i].location.equals(player.getHeadLocation())) {
                    this.food.splice(i, 1);
                    playerAteFood = true;
                    break;
                }
            }
            
            if(playerAteFood){
                player.growNextTurn();
                this.playerStatBoard.increaseScore(player.id);
                this.generateFood();
                break;
            }
        }
        
        for(let lostPlayer of losingPlayers) {
            CoordinateService.setStartingLocationAndDirection(lostPlayer, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY, this.food, this.players);
            this.playerStatBoard.resetScore(lostPlayer.id);
            this.playerStatBoard.addDeath(lostPlayer.id);
        }
    
        let gameData = {
            players: this.players,
            food: this.food,
            playerStats: this.playerStatBoard,
            speed: this.currentFPS,
            numberOfBots: this.botNames.length,
            startLength: this.playerStartLength
        };
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_STATE, gameData );
        
        setTimeout(this.runGameCycle.bind(this), 1000/this.currentFPS);
    }
    
    generateFood() {
        let food = new Food(CoordinateService.getUnoccupiedCoordinate(this.food, this.players), ServerConfig.FOOD_COLOR);
        this.food.push(food);
    }
    
    hasPlayerLost(player) {
        return player.hasCollidedWithSelf() || 
               CoordinateService.isOutOfBounds(player.getHeadLocation()) ||
               CoordinateService.hasPlayerCollidedWithAnotherPlayer(player, this.players);
    }
    
    sendNotificationToPlayers(notification, playerColor) {
        console.log(notification);
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NOTIFICATION, notification, playerColor );
    }
    
    /*******************************
     *  socket.io handling methods *
     *******************************/
    _addBot(playerRequestingAddition) {
        if(this.botNames.length >= ServerConfig.MAX_BOTS) {
            this.sendNotificationToPlayers(playerRequestingAddition.name + " tried to add a bot past the limit.", playerRequestingAddition.color);
            return;
        }
        let newBotName = this.nameService.getBotName();
        let botColor = this.colorService.getColor();
        let newBot = new Player(newBotName, newBotName, botColor);
        CoordinateService.setStartingLocationAndDirection(newBot, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY, this.food, this.players);
        this.players[newBotName] = newBot;
        this.playerStatBoard.addPlayer(newBot.id, newBotName, botColor);
        this.sendNotificationToPlayers(newBotName + " has joined!", botColor);
        this.botNames.push(newBotName);
    }
    
    _addPlayer(socket) {
        let playerName = this.nameService.getPlayerName();
        let playerColor = this.colorService.getColor();
        let newPlayer = new Player(socket.id, playerName, playerColor);
        CoordinateService.setStartingLocationAndDirection(newPlayer, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY, this.food, this.players);
        this.players[socket.id] = newPlayer;
        this.playerStatBoard.addPlayer(newPlayer.id, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.BOARD_INFO, Board);
        this.sendNotificationToPlayers(playerName + " has joined!", playerColor);
        // Start game if the first player has joined
        if(Object.keys(this.players).length === 1) {
            console.log("Game Started");
            this.runGameCycle();
        }
    }
    
    _changeBots(socket, botOption) {
        let player = this.players[socket.id];
        if(botOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this._addBot(player);
        } else if(botOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            this._removeBot(player);
        } else if(botOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetBots(player);
        }
    }
    
    _changeColor(socket, newPlayerName) {
        let player = this.players[socket.id];
        let newColor = this.colorService.getColor();
        this.colorService.returnColor(player.color);
        player.color = newColor;
        this.playerStatBoard.changePlayerColor(player.id, newColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, player.name, newColor);
        this.sendNotificationToPlayers(player.name + " has changed colors.", newColor);
    }
    
    _changeFood(socket, foodOption) {
        let player = this.players[socket.id];
        let notification = player.name;
        if(foodOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this.generateFood();
            notification += " has added some food.";
        } else if(foodOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if(this.food.length > 0) {
                this.food.pop();
                notification += " has removed some food.";
            } else {
                notification += " couldn't remove food.";
            }
        } else if(foodOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetFood();
            notification += " has reset the food.";
        }
        this.sendNotificationToPlayers(notification, player.color);
    }
    
    _changePlayerName(socket, newPlayerName) {
        let player = this.players[socket.id];
        let oldPlayerName = player.name;
        if(oldPlayerName === newPlayerName) {
            return;
        }
        if(this.nameService.doesPlayerNameExist(newPlayerName)) {
            socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, oldPlayerName, player.color);
            this.sendNotificationToPlayers(player.name + " couldn't claim the name " + newPlayerName, player.color);
        } else {
            this.sendNotificationToPlayers(oldPlayerName + " is now known as " + newPlayerName, player.color);
            player.name = newPlayerName;
            this.nameService.usePlayerName(newPlayerName);
            this.playerStatBoard.changePlayerName(player.id, newPlayerName);
        }
    }
    
    _changeSpeed(socket, speedOption) {
        let player = this.players[socket.id];
        let notification = player.name;
        if(speedOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            if(this.currentFPS < ServerConfig.MAX_FPS) {
                notification += " has raised the game speed.";
                this.currentFPS++;
            } else {
                notification += " tried to raised the game speed past the limit.";
            }
        } else if(speedOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if(this.currentFPS > ServerConfig.DEFAULT_FPS) {
                notification += " has lowered the game speed.";
                this.currentFPS--;
            } else {
                notification += " tried to lower the game speed past the limit.";
            }
        } else if(speedOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetSpeed();
            notification += " has reset the game speed.";
        }
        this.sendNotificationToPlayers(notification, player.color);
    }
    
    _changeStartLength(socket, lengthOption) {
        let player = this.players[socket.id];
        let notification = player.name;
        if(lengthOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            notification += " has increased the player start length.";
            this.playerStartLength++;
        } else if(lengthOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if(this.playerStartLength > 1) {
                notification += " has decreased the player start length.";
                this.playerStartLength--;
            } else {
                notification += " tried to lower the player start length past the limit.";
            }
        } else if(lengthOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetSpeed();
            notification += " has reset the player start length.";
        }
        this.sendNotificationToPlayers(notification, player.color);
    }
    
    _disconnect(socket) {
        this._disconnectPlayer(socket.id);
    }
    
    _disconnectPlayer(playerId) {
        let player = this.players[playerId];
        if(!player) {
            return;
        }
        this.sendNotificationToPlayers(player.name + " has left.", player.color);
        this.colorService.returnColor(player.color);
        this.nameService.returnPlayerName(player.name);
        this.playerStatBoard.removePlayer(player.id);
        delete this.players[playerId];
    }
    
    _keyDown(socket, keyCode) {
        GameControlsService.handleKeyDown(this.players[socket.id], keyCode);
    }
    
    _removeBot(playerRequestingRemoval) {
        if(this.botNames.length > 0) {
            this._disconnectPlayer(this.botNames.pop());
        } else {
            this.sendNotificationToPlayers(playerRequestingRemoval.name + " tried to remove a bot that doesn't exist.", playerRequestingRemoval.color);
        }
    }
    
    _resetBots(player) {
        while(this.botNames.length > ServerConfig.DEFAULT_STARTING_BOTS) {
            this._removeBot(player);
        }
    }
    
    _resetFood() {
        while(this.food.length > ServerConfig.DEFAULT_FOOD_AMOUNT) {
            this.food.pop();
        }
    }
    
    _resetSpeed() {
        this.currentFPS = ServerConfig.DEFAULT_FPS;
    }
    
    _updatePlayerImage(socket, base64Image) {
        let player = this.players[socket.id];
        player.setBase64Image(base64Image);
        this.playerStatBoard.setBase64Image(player.id, base64Image);
        this.sendNotificationToPlayers(player.name + " has uploaded a new image.", player.color);
    }
    
}

module.exports = GameController;