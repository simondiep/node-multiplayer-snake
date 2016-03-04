'use strict';

const ServerConfig = require('../configs/server-config');

const AdminService = require('../services/admin-service');
const BoardOccupancyService = require('../services/board-occupancy-service');
const BotDirectionService = require('../services/bot-direction-service');
const ColorService = require('../services/color-service');
const CoordinateService = require('../services/coordinate-service');
const FoodService = require('../services/food-service');
const GameControlsService = require('../services/game-controls-service');
const ImageService = require('../services/image-service');
const NameService = require('../services/name-service');
const NotificationService = require('../services/notification-service');
const PlayerService = require('../services/player-service');
const PlayerSpawnService = require('../services/player-spawn-service');

const PlayerContainer = require('../models/player-container');
const PlayerStatBoard = require('../models/player-stat-board');

class GameController {

    constructor() {
        this.playerContainer = new PlayerContainer();
        this.boardOccupancyService = new BoardOccupancyService();
        this.botDirectionService = new BotDirectionService(this.boardOccupancyService);
        this.playerSpawnService = new PlayerSpawnService(this.boardOccupancyService);
        this.colorService = new ColorService();
        this.nameService = new NameService();
        this.notificationService = new NotificationService();
        this.playerStatBoard = new PlayerStatBoard();


        this.foodService = new FoodService(this.playerStatBoard, this.boardOccupancyService,
            this.nameService, this.notificationService);
        this.imageService = new ImageService(this.playerContainer, this.playerStatBoard, this.notificationService);
        this.playerService = new PlayerService(this.playerContainer, this.playerStatBoard,
            this.boardOccupancyService, this.colorService, this.imageService, this.nameService, this.notificationService,
            this.playerSpawnService, this.runGameCycle.bind(this));
        this.adminService = new AdminService(this.playerContainer, this.playerStatBoard, this.boardOccupancyService,
            this.colorService, this.foodService, this.nameService, this.notificationService, this.playerService,
            this.playerSpawnService);
        this.playerService.init(this.adminService.getPlayerStartLength.bind(this.adminService));
    }

    listen(io) {
        this.notificationService.setSockets(io.sockets);
        const self = this;
        io.sockets.on(ServerConfig.IO.DEFAULT_CONNECTION, socket => {
            socket.on(ServerConfig.IO.INCOMING.KEY_DOWN, self._keyDown.bind(self, socket.id));

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

            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_BACKGROUND_IMAGE,
                self.imageService.clearBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.BACKGROUND_IMAGE_UPLOAD,
                self.imageService.updateBackgroundImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.CLEAR_UPLOADED_IMAGE,
                self.imageService.clearPlayerImage.bind(self.imageService, socket.id));
            socket.on(ServerConfig.IO.INCOMING.IMAGE_UPLOAD,
                self.imageService.updatePlayerImage.bind(self.imageService, socket.id));

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
        if (this.playerContainer.getNumberOfPlayers() - this.adminService.getBotNames().length === 0) {
            console.log('Game Paused');
            this.adminService.resetGame();
            this.imageService.resetGame();
            return;
        }

        // Change bots' directions
        for (const botName of this.adminService.getBotNames()) {
            const bot = this.playerContainer.getPlayer(botName);
            if (Math.random() <= ServerConfig.BOT_CHANGE_DIRECTION_PERCENT) {
                this.botDirectionService.changeToRandomDirection(bot);
            }
            this.botDirectionService.changeDirectionIfInDanger(bot);
        }

        const playersToRespawn = [];
        for (const player of this.playerContainer.getPlayers()) {
            // Check if player is spectating
            if (player.segments.length === 0) {
                continue;
            }
            this.boardOccupancyService.removePlayerOccupancy(player.id, player.segments);
            CoordinateService.movePlayer(player);
            if (this.boardOccupancyService.isOutOfBounds(player.getHeadLocation()) ||
                    this.boardOccupancyService.isWall(player.getHeadLocation())) {
                player.clearAllSegments();
                playersToRespawn.push(player);
            } else {
                this.boardOccupancyService.addPlayerOccupancy(player.id, player.segments);
            }
        }

        // Handle player collisions
        const killReports = this.boardOccupancyService.getKillReports();
        for (const killReport of killReports) {
            if (killReport.isSingleKill()) {
                const victim = this.playerContainer.getPlayer(killReport.victimId);
                if (killReport.killerId === killReport.victimId) {
                    // TODO Display suicide announcement
                } else {
                    this.playerStatBoard.addKill(killReport.killerId);
                    this.playerStatBoard.increaseScore(killReport.killerId);
                    this.playerStatBoard.stealScore(killReport.killerId, victim.id);
                    // Steal victim's length
                    this.playerContainer.getPlayer(killReport.killerId).grow(victim.segments.length);
                    // TODO Display kill announcement
                }
                this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                victim.clearAllSegments();
                playersToRespawn.push(victim);
            } else {
                for (const victimId of killReport.victimIds) {
                    const victim = this.playerContainer.getPlayer(victimId);
                    this.boardOccupancyService.removePlayerOccupancy(victim.id, victim.segments);
                    victim.clearAllSegments();
                    playersToRespawn.push(victim);
                }
                // TODO Display multideath announcement
            }
        }

        for (const player of playersToRespawn) {
            this.playerService.respawnPlayer(player);
        }

        this.foodService.consumeAndRespawnFood(this.playerContainer);

        const gameState = {
            players: this.playerContainer,
            food: this.foodService.getFood(),
            playerStats: this.playerStatBoard,
            speed: this.adminService.getGameSpeed(),
            numberOfBots: this.adminService.getBotNames().length,
            startLength: this.adminService.getPlayerStartLength(),
        };
        this.notificationService.broadcastGameState(gameState);

        setTimeout(this.runGameCycle.bind(this), 1000 / this.adminService.getGameSpeed());
    }

    /*******************************
     *  socket.io handling methods *
     *******************************/

    _keyDown(playerId, keyCode) {
        GameControlsService.handleKeyDown(this.playerContainer.getPlayer(playerId), keyCode);
    }
}

module.exports = GameController;
