"use strict";
const Board = require("../configs/board");
const ServerConfig = require("../configs/server-config");

const BoardOccupancyService = require("../services/board-occupancy-service");
const BotDirectionService = require("../services/bot-direction-service");
const ColorService = require("../services/color-service");
const GameControlsService = require("../services/game-controls-service");
const CoordinateService = require("../services/coordinate-service");
const NameService = require("../services/name-service");
const PlayerSpawnService = require("../services/player-spawn-service");

const Food = require("../models/food");
const Player = require("../models/player");
const PlayerStatBoard = require("../models/player-stat-board");

class GameController {
    constructor(io) {
        this.currentFPS = ServerConfig.STARTING_FPS;
        this.food = {};
        this.players = {};
        this.botNames = [];
        this.playerStartLength = ServerConfig.PLAYER_STARTING_LENGTH;
        this.boardOccupancyService = new BoardOccupancyService();
        this.botDirectionService = new BotDirectionService(this.boardOccupancyService);
        this.playerSpawnService = new PlayerSpawnService(this.boardOccupancyService);
        this.colorService = new ColorService();
        this.nameService = new NameService();
        this.playerStatBoard = new PlayerStatBoard();
        
        for(let i = 0; i < ServerConfig.DEFAULT_FOOD_AMOUNT; i++) {
            this.generateFood();
        }
        
        this.io = io;
        const self = this;
        this.io.sockets.on(ServerConfig.IO.DEFAULT_CONNECTION, function (socket) {
            socket.on(ServerConfig.IO.INCOMING.NEW_PLAYER, self._addPlayer.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.NAME_CHANGE, self._changePlayerName.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.COLOR_CHANGE, self._changeColor.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.KEY_DOWN, self._keyDown.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.BOT_CHANGE, self._changeBots.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.FOOD_CHANGE, self._changeFood.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.SPEED_CHANGE, self._changeSpeed.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.START_LENGTH_CHANGE, self._changeStartLength.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_BACKGROUND_IMAGE, self._clearBackgroundImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.BACKGROUND_IMAGE_UPLOAD, self._updateBackgroundImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_IMAGE, self._clearPlayerImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD, self._updatePlayerImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.JOIN_GAME, self._playerJoinGame.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.SPECTATE_GAME, self._playerSpectateGame.bind(self, socket));
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
        
        for(const botName of this.botNames) {
            const bot = this.players[botName];
            if(Math.random() <= ServerConfig.BOT_CHANGE_DIRECTION_PERCENT) {
                this.botDirectionService.changeToRandomDirection(bot);
            }
            this.botDirectionService.changeDirectionIfInDanger(bot);
        }
        
        const playersToRespawn = [];
        for(const playerId in this.players) {
            const player = this.players[playerId];
            // Check if player is spectating
            if(player.segments.length === 0) {
                continue;
            }
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
            CoordinateService.movePlayer(player);
            if(this.boardOccupancyService.isOutOfBounds(player.getHeadLocation()) || this.boardOccupancyService.isWall(player.getHeadLocation())) {
                player.clearAllSegments();
                playersToRespawn.push(player);
            } else {
                this.boardOccupancyService.addPlayerOccupancy(player.id, player.segments);
            }
        }
        
        const killReports = this.boardOccupancyService.getKillReports();
        for(const killReport of killReports) {
            if(killReport.isSingleKill()) {
                const victim = this.players[killReport.victimId];
                if(killReport.killerId === killReport.victimId) {
                    // TODO Display suicide announcement
                } else {
                    this.playerStatBoard.addKill(killReport.killerId);
                    this.playerStatBoard.increaseScore(killReport.killerId);
                    this.playerStatBoard.stealScore(killReport.killerId, victim.id);
                    // TODO Display kill announcement
                }
                this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                victim.clearAllSegments();
                playersToRespawn.push(victim);
            } else {
                for(const victimId of killReport.victimIds) {
                    const victim = this.players[victimId];
                    this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                    victim.clearAllSegments();
                    playersToRespawn.push(victim); 
                }
                // TODO Display multideath announcement
            }
        }
        
        for(const player of playersToRespawn) {
            this.respawnPlayer(player);
        }
        
        let foodToRespawn = 0;
        const foodsConsumed = this.boardOccupancyService.getFoodsConsumed();
        for(const foodConsumed of foodsConsumed) {
            const playerWhoConsumedFood = this.players[foodConsumed.playerId];
            this._removeFood(foodConsumed.foodId);
            
            playerWhoConsumedFood.growNextTurn();
            this.playerStatBoard.increaseScore(playerWhoConsumedFood.id);
            foodToRespawn++;
        }
        
        for(let i = 0; i < foodToRespawn; i++) {
            this.generateFood();
        }
    
        const gameData = {
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
        const randomUnoccupiedCoordinate = this.boardOccupancyService.getRandomUnoccupiedCoordinate();
        if(!randomUnoccupiedCoordinate) {
            this.sendNotificationToPlayers("Could not add more food.  No room left.", "white");
            return;
        }
        const foodId = this.nameService.getFoodId();
        const food = new Food(foodId, randomUnoccupiedCoordinate, ServerConfig.FOOD_COLOR);
        this.food[foodId] = food;
        this.boardOccupancyService.addFoodOccupancy(food.id, food.location);
    }
    
    respawnPlayer(player) {
        this.playerSpawnService.setupNewSpawn(player, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY);
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
        const newBotName = this.nameService.getBotName();
        const botColor = this.colorService.getColor();
        const newBot = new Player(newBotName, newBotName, botColor);
        this.playerSpawnService.setupNewSpawn(newBot, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY);
        this.players[newBotName] = newBot;
        this.playerStatBoard.addPlayer(newBot.id, newBotName, botColor);
        this.sendNotificationToPlayers(newBotName + " has joined!", botColor);
        this.botNames.push(newBotName);
    }
    
    _addPlayer(socket, previousName, previousImage) {
        const playerName = this.nameService.getPlayerName();
        const playerColor = this.colorService.getColor();
        const newPlayer = new Player(socket.id, playerName, playerColor);
        this.playerSpawnService.setupNewSpawn(newPlayer, this.playerStartLength, ServerConfig.SPAWN_TURN_LEEWAY);
        this.players[socket.id] = newPlayer;
        this.playerStatBoard.addPlayer(newPlayer.id, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, playerName, playerColor);
        socket.emit(ServerConfig.IO.OUTGOING.BOARD_INFO, Board);
        this.sendNotificationToPlayers(playerName + " has joined!", playerColor);
        
        if(previousName) {
            this._changePlayerName(socket, previousName);
        }
        if(previousImage) {
            this._updatePlayerImage(socket, previousImage);
        }
        
        // Start game if the first player has joined
        if(Object.keys(this.players).length === 1) {
            console.log("Game Started");
            this.runGameCycle();
        }
    }
    
    _changeBots(socket, botOption) {
        const player = this.players[socket.id];
        if(botOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            this._addBot(player);
        } else if(botOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            this._removeBot(player);
        } else if(botOption === ServerConfig.INCREMENT_CHANGE.RESET) {
            this._resetBots(player);
        }
    }
    
    _changeColor(socket, newPlayerName) {
        const player = this.players[socket.id];
        const newColor = this.colorService.getColor();
        this.colorService.returnColor(player.color);
        player.color = newColor;
        this.playerStatBoard.changePlayerColor(player.id, newColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, player.name, newColor);
        this.sendNotificationToPlayers(player.name + " has changed colors.", newColor);
    }
    
    _changeFood(socket, foodOption) {
        const player = this.players[socket.id];
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
        const player = this.players[socket.id];
        const oldPlayerName = player.name;
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
            socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, newPlayerName, player.color);
        }
    }
    
    _changeSpeed(socket, speedOption) {
        const player = this.players[socket.id];
        let notification = player.name;
        if(speedOption === ServerConfig.INCREMENT_CHANGE.INCREASE) {
            if(this.currentFPS < ServerConfig.MAX_FPS) {
                notification += " has raised the game speed.";
                this.currentFPS++;
            } else {
                notification += " tried to raised the game speed past the limit.";
            }
        } else if(speedOption === ServerConfig.INCREMENT_CHANGE.DECREASE) {
            if(this.currentFPS > ServerConfig.MIN_FPS) {
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
        const player = this.players[socket.id];
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
        const player = this.players[playerId];
        if(!player) {
            return;
        }
        this.sendNotificationToPlayers(player.name + " has left.", player.color);
        this.colorService.returnColor(player.color);
        this.nameService.returnPlayerName(player.name);
        this.playerStatBoard.removePlayer(player.id);
        if(player.segments.length > 0) {
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
        }
        delete this.players[playerId];
    }
    
    _keyDown(socket, keyCode) {
        GameControlsService.handleKeyDown(this.players[socket.id], keyCode);
    }
    
    _playerJoinGame(socket) {
        const player = this.players[socket.id];
        this.respawnPlayer(player);
        this.sendNotificationToPlayers(player.name + " has rejoined the game.", player.color);
    }
    
    _playerSpectateGame(socket) {
        const player = this.players[socket.id];
        this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
        player.clearAllSegments();
        this.sendNotificationToPlayers(player.name + " is now spectating.", player.color);
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
        const foodToRemove = this.food[foodId];
        this.nameService.returnFoodId(foodId);
        this.boardOccupancyService.removeFoodOccupancy(foodId, foodToRemove.location);
        delete this.food[foodId];
    }
    
    _removeLastFood() {
        const lastFood = this.food[Object.keys(this.food)[Object.keys(this.food).length - 1]];
        this._removeFood(lastFood.id);
    }
    
    _resetFood() {
        while(Object.keys(this.food).length > ServerConfig.DEFAULT_FOOD_AMOUNT) {
            this._removeLastFood();
        }
    }
    
    _resetSpeed() {
        this.currentFPS = ServerConfig.STARTING_FPS;
    }
    
    _clearBackgroundImage(socket, backgroundImage) {
        const player = this.players[socket.id];
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_BACKGROUND_IMAGE );
        this.sendNotificationToPlayers(player.name + " has clear the background image.", player.color);
    }
    
    _clearPlayerImage(socket) {
        const player = this.players[socket.id];
        delete player.base64Image;
        this.playerStatBoard.clearPlayerImage(player.id);
        this.sendNotificationToPlayers(player.name + " has removed their image.", player.color);
    }
    
    _updateBackgroundImage(socket, base64Image) {
        const player = this.players[socket.id];
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_BACKGROUND_IMAGE, base64Image );
        this.sendNotificationToPlayers(player.name + " has updated the background image.", player.color);
    }
    
    _updatePlayerImage(socket, base64Image) {
        const player = this.players[socket.id];
        player.setBase64Image(base64Image);
        this.playerStatBoard.setBase64Image(player.id, base64Image);
        this.sendNotificationToPlayers(player.name + " has uploaded a new image.", player.color);
    }
}

module.exports = GameController;