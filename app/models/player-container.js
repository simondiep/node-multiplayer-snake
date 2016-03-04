'use strict';

class PlayerContainer {

    constructor() {
        this._players = new Map();
        this._spectatingPlayerIds = new Set();
    }

    addPlayer(player) {
        this._players.set(player.id, player);
    }

    addSpectatingPlayer(playerId) {
        this._spectatingPlayerIds.add(playerId);
    }

    getPlayer(playerId) {
        return this._players.get(playerId);
    }

    getPlayers() {
        return this._players.values();
    }

    getNumberOfPlayers() {
        return this._players.size;
    }

    getAnActivePlayer(excludedPlayerId) {
        const activePlayerIds = [];
        for (const playerId of this._players.keys()) {
            if (playerId !== excludedPlayerId && !this._spectatingPlayerIds.has(playerId)) {
                activePlayerIds.push(playerId);
            }
        }
        return this._players.get(activePlayerIds[activePlayerIds.length * Math.random() << 0]);
    }

    removePlayer(playerId) {
        this._players.delete(playerId);
    }

    removeSpectatingPlayer(playerId) {
        this._spectatingPlayerIds.delete(playerId);
    }

    toJSON() {
        const response = [];
        this._players.forEach(player => {
            response.push(player);
        });
        return response;
    }
}

module.exports = PlayerContainer;
