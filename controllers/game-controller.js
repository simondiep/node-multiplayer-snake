"use strict";
let Board = require("../configs/board");
let ServerConfig = require("../configs/server-config");

let BoardOccupancyService = require("../services/board-occupancy-service");
let ColorService = require("../services/color-service");
let GameControlsService = require("../services/game-controls-service");
let CoordinateService = require("../services/coordinate-service");
let NameService = require("../services/name-service");

let Direction = require("../models/direction");
let Food = require("../models/food");
let Player = require("../models/player");
let PlayerStatBoard = require("../models/player-stat-board");

class GameController {
    constructor(io) {
        this.currentFPS = ServerConfig.DEFAULT_FPS;
        this.food = {};
        this.players = {};
        this.botNames = [];
        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
        this.boardOccupancyService = new BoardOccupancyService();
        this.colorService = new ColorService();
        this.nameService = new NameService();
        this.playerStatBoard = new PlayerStatBoard();
        
        for(let i = 0; i < ServerConfig.DEFAULT_FOOD_AMOUNT; i++) {
            this.generateFood();
        }
        
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
            this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
            return;
        }
        
        for(let botName of this.botNames) {
            let bot = this.players[botName];
            if(this._isBotInDanger(bot.getHeadLocation(), bot.direction) || Math.random() <= ServerConfig.BOT_CHANGE_DIRECTION_PERCENT) {
                let newDirection, nextCoordinate;
                let attempts = 0;
                do {
                    let newDirectionOptions = GameControlsService.getValidNextMove(bot.direction);
                    newDirection = newDirectionOptions[this._getRandomIntegerInRange(0,1)];
                    nextCoordinate = CoordinateService.getNextCoordinate(bot.getHeadLocation(), newDirection);
                    attempts++;
                } while(attempts < ServerConfig.BOT_MAX_CHANGE_DIRECTION_ATTEMPTS && this._isBotInDanger(nextCoordinate, newDirection));
                if(attempts < ServerConfig.BOT_MAX_CHANGE_DIRECTION_ATTEMPTS) {
                    bot.changeDirection(newDirection);
                }
            }
        }
        
        let playersToRespawn = [];
        for(let playerId in this.players) {
            let player = this.players[playerId];
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
            CoordinateService.movePlayer(player);
            if(this.boardOccupancyService.isOutOfBounds(player.getHeadLocation()) || this.boardOccupancyService.isWall(player.getHeadLocation())) {
                player.clearAllSegments();
                playersToRespawn.push(player);
            } else {
                this.boardOccupancyService.addPlayerOccupancy(player.id, player.segments);
            }
        }
        
        let killReports = this.boardOccupancyService.getKillReports();
        for(let killReport of killReports) {
            if(killReport.isSingleKill()) {
                if(killReport.killerId === killReport.victimId) {
                    // TODO Display suicide announcement
                } else {
                    this.playerStatBoard.addKill(killReport.killerId);
                    // TODO Display kill announcement
                }
                let victim = this.players[killReport.victimId];
                this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                victim.clearAllSegments();
                playersToRespawn.push(victim);
            } else {
                for(let victimId of killReport.victimIds) {
                    let victim = this.players[victimId];
                    this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                    victim.clearAllSegments();
                    playersToRespawn.push(victim); 
                }
                // TODO Display multideath announcement
            }
        }
        
        for(let player of playersToRespawn) {
            this.respawnPlayer(player);
        }
        
        let foodToRespawn = 0;
        let foodsConsumed = this.boardOccupancyService.getFoodsConsumed();
        for(let foodConsumed of foodsConsumed) {
            let playerWhoConsumedFood = this.players[foodConsumed.playerId];
            this._removeFood(foodConsumed.foodId);
            
            playerWhoConsumedFood.growNextTurn();
            this.playerStatBoard.increaseScore(playerWhoConsumedFood.id);
            foodToRespawn++;
        }
        
        for(let i = 0; i < foodToRespawn; i++) {
            this.generateFood();
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
        let foodId = this.nameService.getFoodId();
        let food = new Food(foodId, this.boardOccupancyService.getRandomUnoccupiedCoordinate(), ServerConfig.FOOD_COLOR);
        this.food[foodId] = food;
        this.boardOccupancyService.addFoodOccupancy(food.id, food.location);
    }
    
    respawnPlayer(player) {
        this._setupNewSpawn(player);
        this.playerStatBoard.resetScore(player.id);
        this.playerStatBoard.addDeath(player.id);
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
        this._setupNewSpawn(newBot);
        this.players[newBotName] = newBot;
        this.playerStatBoard.addPlayer(newBot.id, newBotName, botColor);
        this.sendNotificationToPlayers(newBotName + " has joined!", botColor);
        this.botNames.push(newBotName);
    }
    
    _addPlayer(socket) {
        let playerName = this.nameService.getPlayerName();
        let playerColor = this.colorService.getColor();
        let newPlayer = new Player(socket.id, playerName, playerColor);
        this._setupNewSpawn(newPlayer);
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
            if(Object.keys(this.food).length > 0) {
                this._removeLastFood();
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
            this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
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
        this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
        delete this.players[playerId];
    }
    
    // Try to spawn the player in a safe area with enough time to react.  Otherwise don't spawn player if no safe areas
    _setupNewSpawn(player) {
        let spawnCoordinate, newDirection;
        if(Math.random() < 0.5) {
            let possibleSpawnCoordinates = this.boardOccupancyService.getUnoccupiedHorizontalCoordinates(ServerConfig.SPAWN_TURN_LEEWAY);
            if(possibleSpawnCoordinates.length === 0) {
                return;
            }
            if(Math.random() < 0.5) {
                newDirection = Direction.LEFT;
                spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length-1];
            } else {
                newDirection = Direction.RIGHT;
                spawnCoordinate = possibleSpawnCoordinates[0];
            }
        } else {
            let possibleSpawnCoordinates = this.boardOccupancyService.getUnoccupiedVerticalCoordinates(ServerConfig.SPAWN_TURN_LEEWAY);
            if(possibleSpawnCoordinates.length === 0) {
                return;
            }
            if(Math.random() < 0.5) {
                newDirection = Direction.UP;
                spawnCoordinate = possibleSpawnCoordinates[possibleSpawnCoordinates.length-1];
            } else {
                newDirection = Direction.DOWN;
                spawnCoordinate = possibleSpawnCoordinates[0];
            }
        }
        let playerStartingCoordinates = new Array(this.playerStartLength).fill(spawnCoordinate);
        player.setDirectionAndStartingLocation(newDirection, playerStartingCoordinates);
    }
    
    _isBotInDanger(currentCoordinate, direction) {
        let nextCoordinate = CoordinateService.getNextCoordinate(currentCoordinate, direction);
        let isOutOfBounds = this.boardOccupancyService.isOutOfBounds(nextCoordinate);
        if(isOutOfBounds) {
            return true;
        }
        let nextSecondCoordinate = CoordinateService.getNextCoordinate(nextCoordinate, direction);
        isOutOfBounds = this.boardOccupancyService.isOutOfBounds(nextSecondCoordinate);
        if(isOutOfBounds) {
            return true;
        }
        let isOccupied = this.boardOccupancyService.isOccupied(nextCoordinate) || this.boardOccupancyService.isOccupied(nextSecondCoordinate);
        return isOccupied;
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
    
    _removeFood(foodId) {
        let foodToRemove = this.food[foodId];
        this.nameService.returnFoodId(foodId);
        this.boardOccupancyService.removeFoodOccupancy(foodId, foodToRemove.location);
        delete this.food[foodId];
    }
    
    _removeLastFood() {
        let lastFood = this.food[Object.keys(this.food)[Object.keys(this.food).length - 1]];
        this._removeFood(lastFood.id);
    }
    
    _resetFood() {
        while(Object.keys(this.food).length > ServerConfig.DEFAULT_FOOD_AMOUNT) {
            this._removeLastFood();
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
    
    _getRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = GameController;