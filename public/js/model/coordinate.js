/**
 *  A coordinate that is not scaled to the canvas.
 */
export default class Coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(otherCoordinate) {
        return this.x === otherCoordinate.x && this.y === otherCoordinate.y;
    }
}
