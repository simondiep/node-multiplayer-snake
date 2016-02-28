"use strict";
const Board = require("../configs/board");
const ServerConfig = require("../configs/server-config");

const AdminService = require("../services/admin-service");
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
        this.food = {};
        this.players = {};
        this.boardOccupancyService = new BoardOccupancyService();
        this.botDirectionService = new BotDirectionService(this.boardOccupancyService);
        this.playerSpawnService = new PlayerSpawnService(this.boardOccupancyService);
        this.colorService = new ColorService();
        this.nameService = new NameService();
        this.playerStatBoard = new PlayerStatBoard();
        this.adminService = new AdminService(this.players,this.food, this.playerStatBoard, this.boardOccupancyService, this.colorService, this.nameService, this.playerSpawnService, this.generateFood.bind(this), this.removeFood.bind(this), this._disconnectPlayer.bind(this), this.sendNotificationToPlayers.bind(this));
        
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
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_BACKGROUND_IMAGE, self._clearBackgroundImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.BACKGROUND_IMAGE_UPLOAD, self._updateBackgroundImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_IMAGE, self._clearPlayerImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD, self._updatePlayerImage.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.JOIN_GAME, self._playerJoinGame.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.SPECTATE_GAME, self._playerSpectateGame.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.DISCONNECT, self._disconnect.bind(self, socket));
            
            socket.on(ServerConfig.IO.INCOMING.BOT_CHANGE, self.adminService.changeBots.bind(self.adminService, socket));
            socket.on(ServerConfig.IO.INCOMING.FOOD_CHANGE, self.adminService.changeFood.bind(self.adminService, socket));
            socket.on(ServerConfig.IO.INCOMING.SPEED_CHANGE, self.adminService.changeSpeed.bind(self.adminService, socket));
            socket.on(ServerConfig.IO.INCOMING.START_LENGTH_CHANGE, self.adminService.changeStartLength.bind(self.adminService, socket));
        });
    }
    
    runGameCycle() {
        // Pause and reset the game if there aren't any players
        if(Object.keys(this.players).length - this.adminService.getBotNames().length === 0){
            console.log("Game Paused");
            this.adminService.resetGame();
            return;
        }
        
        for(const botName of this.adminService.getBotNames()) {
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
            this.removeFood(foodConsumed.foodId);
            
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
            speed: this.adminService.getGameSpeed(),
            numberOfBots: this.adminService.getBotNames().length,
            startLength: this.adminService.getPlayerStartLength()
        };
        this.io.sockets.emit(ServerConfig.IO.OUTGOING.NEW_STATE, gameData );
        
        setTimeout(this.runGameCycle.bind(this), 1000/this.adminService.getGameSpeed());
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
    
    removeFood(foodId) {
        const foodToRemove = this.food[foodId];
        this.nameService.returnFoodId(foodId);
        this.boardOccupancyService.removeFoodOccupancy(foodId, foodToRemove.location);
        delete this.food[foodId];
    }
    
    respawnPlayer(player) {
        this.playerSpawnService.setupNewSpawn(player, this.adminService.getPlayerStartLength(), ServerConfig.SPAWN_TURN_LEEWAY);
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
    
    _addPlayer(socket, previousName, previousImage) {
        const playerName = this.nameService.getPlayerName();
        const playerColor = this.colorService.getColor();
        const newPlayer = new Player(socket.id, playerName, playerColor);
        this.playerSpawnService.setupNewSpawn(newPlayer, this.adminService.getPlayerStartLength(), ServerConfig.SPAWN_TURN_LEEWAY);
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
    
    _changeColor(socket) {
        const player = this.players[socket.id];
        const newColor = this.colorService.getColor();
        this.colorService.returnColor(player.color);
        player.color = newColor;
        this.playerStatBoard.changePlayerColor(player.id, newColor);
        socket.emit(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, player.name, newColor);
        this.sendNotificationToPlayers(player.name + " has changed colors.", newColor);
    }
    
    _changePlayerName(socket, newPlayerName) {
        const player = this.players[socket.id];
        const oldPlayerName = player.name;
        newPlayerName = newPlayerName.trim();
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
    
    _clearBackgroundImage(socket) {
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