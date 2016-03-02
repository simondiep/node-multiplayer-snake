"use strict";
const StringValidator = require("validator");
const ServerConfig = require("../configs/server-config");


class ValidationService {

    static cleanString(string) {
        if (this.isString(string)) {
            return StringValidator.escape(string.trim());
        }
        return false;
    }

    static isString(stringCandidate) {
        return (typeof stringCandidate === "string" || stringCandidate instanceof String);
    }

    static isValidPlayerName(playerName) {
        return playerName && StringValidator.isLength(playerName.trim(), { min: 1, max: ServerConfig.PLAYER_MAX_NAME_LENGTH });
    }

    static isValidBase64String(base64String) {
        return base64String && StringValidator.isBase64(base64String);
    }
}

module.exports = ValidationService;
