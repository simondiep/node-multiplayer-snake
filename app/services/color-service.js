'use strict';

/**
 *  Generates new unused colors and stores used colors
 */
class ColorService {

    constructor() {
        this.usedColors = new Set();
    }

    getColor() {
        let newColor;
        do {
            newColor = this._getRandomColor();
        } while (this.usedColors.has(newColor));
        // TODO check if too similar to any used colors
        this.usedColors.add(newColor);
        return newColor;
    }

    returnColor(color) {
        this.usedColors.delete(color);
    }

    // Format is #ABCDEF
    _getRandomColor() {
        return `#${this._getRandomLightHexRGBVal()}${this._getRandomLightHexRGBVal()}${this._getRandomLightHexRGBVal()}`;
    }

    _getRandomLightHexRGBVal() {
        return (Math.floor(Math.random() * 156) + 100).toString(16);
    }
}

module.exports = ColorService;
