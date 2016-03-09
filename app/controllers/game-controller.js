'use strict';

const ServerConfig = require('../configs/server-config');

const AdminService = require('../services/admin-service');
const BoardOccupancyService = require('../services/board-occupancy-service');
const BotDirectionService = require('../services/bot-direction-service');
const FoodService = require('../services/food-service');
const GameControlsService = require('../services/game-controls-service');
const ImageService = require('../services/image-service');
const NameService = require('../services/name-service');
const NotificationService = require('../services/notification-service');
const PlayerService = require('../services/player-service');

const Coordinate = require('../models/coordinate');
const PlayerContainer = require('../models/player-container');
const PlayerStatBoard = require('../models/player-stat-board');

class GameController {

    constructor() {
        // Model Containers
        this.playerContainer = new PlayerContainer();
        this.playerStatBoard = new PlayerStatBoard();

        // Services
        this.nameService = new NameService();
        this.boardOccupancyService = new BoardOccupancyService();
        this.notificationService = new NotificationService();
        this.botDirectionService = new BotDirectionService(this.boardOccupancyService);
        this.foodService = new FoodService(this.playerStatBoard, this.boardOccupancyService,
            this.nameService, this.notificationService);
        this.imageService = new ImageService(this.playerContainer, this.playerStatBoard, this.notificationService);
        this.playerService = new PlayerService(this.playerContainer, this.playerStatBoard, this.boardOccupancyService,
            this.imageService, this.nameService, this.notificationService, this.runGameCycle.bind(this));
        this.adminService = new AdminService(this.playerContainer, this.foodService, this.nameService,
            this.notificationService, this.playerService);
        this.playerService.init(this.adminService.getPlayerStartLength.bind(this.adminService));
    }

    // Listen for Socket IO events
    listen(io) {
        this.notificationService.setSockets(io.sockets);
        const self = this;
        io.sockets.on(ServerConfig.IO.DEFAULT_CONNECTION, socket => {
            socket.on(ServerConfig.IO.INCOMING.CANVAS_CLICKED, self._canvasClicked.bind(self, socket));
            socket.on(ServerConfig.IO.INCOMING.KEY_DOWN, self._keyDown.bind(self, socket.id));

            // Player Service
            socket.on(ServerConfig.IO.INCOMING.NEW_PLAYER,
                self.playerService.addPlayer.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.NAME_CHANGE,
                self.playerService.changePlayerName.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.COLOR_CHANGE,
                self.playerService.changeColor.bind(self.playerService, socket));
            socket.on(ServerConfig.IO.INCOMING.JOIN_GAME,
                self.playerService.playerJoinGame.bind(self.playerService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.SPECTATE_GAME,
                self.playerService.playerSpectateGame.bind(self.playerService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.DISCONNECT,
                self.playerService.disconnectPlayer.bind(self.playerService, socket.id));
            // Image Service
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_BACKGROUND_IMAGE,
                self.imageService.clearBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.BACKGROUND_IMAGE_UPLOAD,
                self.imageService.updateBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_IMAGE,
                self.imageService.clearPlayerImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD,
                self.imageService.updatePlayerImage.bind(self.imageService, socket.id));
            // Admin Service
            socket.on(ServerConfig.IO.INCOMING.BOT_CHANGE,
                self.adminService.changeBots.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.FOOD_CHANGE,
                self.adminService.changeFood.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.SPEED_CHANGE,
                self.adminService.changeSpeed.bind(self.adminService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.START_LENGTH_CHANGE,
                self.adminService.changeStartLength.bind(self.adminService, socket.id));
        });
    }

    runGameCycle() {
        // Pause and reset the game if there aren't any players
        if (this.playerContainer.getNumberOfPlayers() - this.adminService.getBotIds().length === 0) {
            console.log('Game Paused');
            this.boardOccupancyService.initializeBoard();
            this.adminService.resetGame();
            this.nameService.reinitialize();
            this.imageService.resetBackgroundImage();
            this.foodService.reinitialize();
            this.playerContainer.reinitialize();
            this.playerStatBoard.reinitialize();
            return;
        }

        // Change bots' directions
        for (const botId of this.adminService.getBotIds()) {
            const bot = this.playerContainer.getPlayer(botId);
            if (Math.random() <= ServerConfig.BOT_CHANGE_DIRECTION_PERCENT) {
                this.botDirectionService.changeToRandomDirection(bot);
            }
            this.botDirectionService.changeDirectionIfInDanger(bot);
        }

        this.playerService.movePlayers();
        this.playerService.handlePlayerCollisions();
        this.playerService.respawnPlayers();

        this.foodService.consumeAndRespawnFood(this.playerContainer);

        const gameState = {
            players: this.playerContainer,
            food: this.foodService.getFood(),
            playerStats: this.playerStatBoard,
            walls: this.boardOccupancyService.getWallCoordinates(),
            speed: this.adminService.getGameSpeed(),
            numberOfBots: this.adminService.getBotIds().length,
            startLength: this.adminService.getPlayerStartLength(),
        };
        this.notificationService.broadcastGameState(gameState);

        setTimeout(this.runGameCycle.bind(this), 1000 / this.adminService.getGameSpeed());
    }

    /*******************************
     *  socket.io handling methods *
     *******************************/

    _canvasClicked(socket, x, y) {
        const player = this.playerContainer.getPlayer(socket.id);
        const coordinate = new Coordinate(x, y);
        if (this.boardOccupancyService.isPermanentWall(coordinate)) {
            return;
        }
        if (this.boardOccupancyService.isWall(coordinate)) {
            this.boardOccupancyService.removeWall(coordinate);
            this.notificationService.broadcastNotification(`${player.name} has removed a wall`, player.color);
        } else {
            this.boardOccupancyService.addWall(coordinate);
            this.notificationService.broadcastNotification(`${player.name} has added a wall`, player.color);
        }
    }

    _keyDown(playerId, keyCode) {
        GameControlsService.handleKeyDown(this.playerContainer.getPlayer(playerId), keyCode);
    }
}

module.exports = GameController;
