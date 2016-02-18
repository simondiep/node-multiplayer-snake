define([
    "config/client-config",
    "view/board-view-factory",
    "view/game-view",
    "socketio"
],

function (ClientConfig, BoardViewFactory, GameView, io) {
    "use strict";
    
    class GameController {

        constructor() {
            this.gameView = new GameView(this.keyDownCallback.bind(this), this.playerNameUpdatedCallback.bind(this), this.speedChangeCallback.bind(this), this.foodChangeCallback.bind(this));
            this.players = {};
            this.food = {};
            this.socket = io();
            this._initializeSocketIoHandlers();
            this.socket.emit(ClientConfig.IO.OUTGOING.NEW_PLAYER);
        }
       
        renderGame() {
            this.boardView.clear();
            for(let foodId in this.food) {
                let food = this.food[foodId];
                this.boardView.drawSquare(food.location, food.color);
            }
            for(let playerId in this.players) {
                let player = this.players[playerId];
                this.boardView.drawSquares(player.segments, player.color);
            }
            
            let self = this;
            // Run in a loop
            setTimeout(function() {
                requestAnimationFrame(self.renderGame.bind(self));
            }, 1000 / ClientConfig.FPS);
        }
        
        /*******************
         *  View Callbacks *
         *******************/
        
        foodChangeCallback(option) {
            this.socket.emit(ClientConfig.IO.OUTGOING.FOOD_CHANGE, option);
        }
        
        keyDownCallback(keyCode) {
            this.socket.emit(ClientConfig.IO.OUTGOING.KEY_DOWN, keyCode);
        }
        
        playerNameUpdatedCallback(name) {
            this.socket.emit(ClientConfig.IO.OUTGOING.NAME_CHANGE, name);
        }
        
        speedChangeCallback(option) {
            this.socket.emit(ClientConfig.IO.OUTGOING.SPEED_CHANGE, option);
        }
        
        /*******************************
         *  socket.io handling methods *
         *******************************/
        
        _createBoard(board) {
            this.boardView = BoardViewFactory.createBoardView(board.SQUARE_SIZE_IN_PIXELS, board.HORIZONTAL_SQUARES, board.VERTICAL_SQUARES);
            this.boardView.clear();
            this.gameView.ready();
            this.renderGame();
        }
        
        _handleNewGameData(gameData) {
            this.players = gameData.players;
            this.food = gameData.food;
            this.gameView.showFoodAmount(gameData.food.length);
            this.gameView.showSpeed(gameData.speed);
            
            // Display scores
            let formattedScores = "";
            for( let playerStat of gameData.scoreBoard) {
                formattedScores+= "<span style='color:"+playerStat.color+"'>" + playerStat.name + "</span>" +
                                  " Score: " + playerStat.score + "&nbsp;&nbsp; High: " + playerStat.highScore + "<br/>";
            }
            let scoreBoardElement = document.getElementById("scoreBoard");
            scoreBoardElement.innerHTML = formattedScores;
        }
        
        _handleNotification(notification) {
            let notificationElement = document.getElementById("notifications");
            let formattedNotification = "<span class='timelabel'>" + new Date().toLocaleTimeString() + " -</span> " + notification + "<br/>";
            notificationElement.innerHTML = formattedNotification + notificationElement.innerHTML;
        }
        
        _updatePlayerName(playerName, playerColor) {
            this.gameView.updatePlayerName(playerName, playerColor);
        }
        
        _initializeSocketIoHandlers() {
            this.socket.on(ClientConfig.IO.INCOMING.NEW_PLAYER_INFO, this._updatePlayerName.bind(this));
            this.socket.on(ClientConfig.IO.INCOMING.BOARD_INFO, this._createBoard.bind(this));
            this.socket.on(ClientConfig.IO.INCOMING.NEW_STATE, this._handleNewGameData.bind(this));
            this.socket.on(ClientConfig.IO.INCOMING.NOTIFICATION, this._handleNotification.bind(this));
        }
    }
    
    return GameController;
});