const assert = require('chai').assert;
const Player = require('../app/models/player');
const PlayerContainer = require('../app/models/player-container');

describe('PlayerContainer', () => {
    'use strict';

    it('should get a random active player', done => {
        const playerContainer = new PlayerContainer();
        const player1 = new Player(1);
        const player2 = new Player(2);
        playerContainer.addPlayer(player1);
        playerContainer.addPlayer(player2);
        playerContainer.addSpectatingPlayer(3);
        assert.equal(playerContainer.getAnActivePlayer(player1.id).id, player2.id);
        assert.equal(playerContainer.getAnActivePlayer(player2.id).id, player1.id);
        const player4 = new Player(4);
        const activePlayer = playerContainer.getAnActivePlayer(player1.id);
        assert.isTrue(activePlayer.id === player2.id || activePlayer.id === player4.id);
        done();
    });
});
