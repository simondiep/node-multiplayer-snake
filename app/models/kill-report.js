'use strict';

class KillReport {

    constructor(killerId, victimId, victimIds) {
        if (victimIds) {
            this._victimIds = victimIds;
        } else {
            this.killerId = killerId;
            this.victimId = victimId;
        }
    }

    getVictimIds() {
        return this._victimIds.slice(0);
    }

    isSingleKill() {
        return typeof this.killerId !== 'undefined';
    }
}

module.exports = KillReport;
