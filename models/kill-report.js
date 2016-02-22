"use strict";

class KillReport {
    
    constructor(killerId, victimId, victimIds) {
        if(arguments.length === 2) {
            this.killerId = killerId;
            this.victimId = victimId;
        } else if (arguments.length === 3) {
            this.victimIds = victimIds;
        }
    }
    
    isSingleKill() {
        return typeof this.killerId !== "undefined";
    }
}

module.exports = KillReport;  