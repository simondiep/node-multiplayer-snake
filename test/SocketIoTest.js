const assert = require('chai').assert;
const io = require('socket.io-client');
const app = require('../app.js');
const ServerConfig = require('../app/configs/server-config.js');

const socketURL = `http://localhost:${app.get('port')}`;

describe('socket.io connection', () => {
    'use strict';

    it('should provide a new player information to start playing', done => {
        const player1Socket = io.connect(socketURL);
        player1Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        let playerInfoReceived = false;
        let boardInfoReceived = false;
        player1Socket.on(ServerConfig.IO.OUTGOING.NEW_PLAYER_INFO, (playerName, playerColor) => {
            assert.isString(playerName);
            assert.isString(playerColor);
            playerInfoReceived = true;
        });

        player1Socket.on(ServerConfig.IO.OUTGOING.BOARD_INFO, board => {
            assert.isObject(board);
            assert.isTrue(playerInfoReceived);
            boardInfoReceived = true;
        });

        player1Socket.on(ServerConfig.IO.OUTGOING.NEW_STATE, gameData => {
            assert.isObject(gameData);
            if (boardInfoReceived) {
                player1Socket.disconnect();
                done();
            }
        });
    });

    it('should display notifications when a new player joins or leaves', done => {
        // Three total notifications
        // 1: Player 1 will join the game and receive a notification that they have joined
        // 2: Then, Player 2 will join the game
        // 3: Player 2 will leave the game
        const player1Socket = io.connect(socketURL);
        player1Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);

        let player1Notifications = 0;
        player1Socket.on(ServerConfig.IO.OUTGOING.NOTIFICATION, notification => {
            assert.isString(notification);
            player1Notifications++;
            if (player1Notifications === 3) {
                player1Socket.disconnect();
                done();
            }
        });

        const player2Socket = io.connect(socketURL);
        player2Socket.emit(ServerConfig.IO.INCOMING.NEW_PLAYER);
        player2Socket.on(ServerConfig.IO.OUTGOING.NOTIFICATION, notification => {
            assert.isString(notification);
            player2Socket.disconnect();
        });
    });
});
