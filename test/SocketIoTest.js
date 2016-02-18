var assert = require("chai").assert;
var io = require("socket.io-client");
var app = require("../app.js");
var ServerConfig = require("../configs/server-config.js");

var socketURL = "http://localhost:" + app.get("port");

describe("Client Connection",function(){
    "use strict";
    
    it("should provide a new player information to start playing",function(done){
        let player1Socket = io.connect(socketURL);
        player1Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        let playerInfoReceived = false;
        let boardInfoReceived = false;
        player1Socket.on(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO,function(playerName, playerColor){
            assert.isString(playerName);
            assert.isString(playerColor);
            playerInfoReceived = true;
        });
        
        player1Socket.on(ServerConfig.IO.OUTGOING.BOARD_INFO,function(board){
            assert.isObject(board);
            assert.isTrue(playerInfoReceived);
            boardInfoReceived = true;
        });
        
        player1Socket.on(ServerConfig.IO.OUTGOING.NEW_STATE,function(gameData){
            console.log("gameData: " + gameData);
            assert.isObject(gameData);
            if(boardInfoReceived) {
                player1Socket.disconnect();
                done(); 
            }
        });
    });
    
    it("should display notifications when a new player joins or leaves",function(done){
        // Three total notifications
        // 1: Player 1 will join the game and receive a notification that they have joined
        // 2: Then, Player 2 will join the game
        // 3: Player 2 will leave the game
        let player1Socket = io.connect(socketURL);
        player1Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        let player1Notifications = 0;
        player1Socket.on(ServerConfig.IO.OUTGOING.NOTIFICATION,function(notification){
            assert.isString(notification);
            player1Notifications++;
            if(player1Notifications === 3) {
                player1Socket.disconnect();
                done(); 
            }
        });
        
        let player2Socket = io.connect(socketURL);
        player2Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);
        player2Socket.on(ServerConfig.IO.OUTGOING.NOTIFICATION,function(notification){
            assert.isString(notification);
            player2Socket.disconnect();
        });
        
    });
});