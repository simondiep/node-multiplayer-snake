'use strict';
const StringValidator = require('validator');
const ServerConfig = require('../configs/server-config');

/**
 * Regex for a proper data uri
 */
// eslint-disable-next-line no-useless-escape
const DATA_URI_REGEX = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i; // eslint-disable-line max-len

/**
 * Clean and/or validate input
 */
class ValidationService {

    static cleanString(string) {
        if (this.isString(string)) {
            return StringValidator.escape(string.trim());
        }
        return false;
    }

    static isString(stringCandidate) {
        return (typeof stringCandidate === 'string' || stringCandidate instanceof String);
    }

    static isValidPlayerName(playerName) {
        return playerName && StringValidator.isLength(playerName.trim(), { min: 1, max: ServerConfig.PLAYER_MAX_NAME_LENGTH });
    }

    static isValidBase64DataURI(uri) {
        return !!uri.match(DATA_URI_REGEX);
    }
}

module.exports = ValidationService;
