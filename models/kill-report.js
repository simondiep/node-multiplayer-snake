"use strict";

class KillReport {

    constructor(killerId, victimId, victimIds) {
        if (victimIds) {
            this.victimIds = victimIds;
        } else {
            this.killerId = killerId;
            this.victimId = victimId;
        }
    }

    isSingleKill() {
        return typeof this.killerId !== "undefined";
    }
}

module.exports = KillReport;
