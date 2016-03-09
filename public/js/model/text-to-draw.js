export default class TextToDraw {
    constructor(text, coordinate, color) {
        this.text = text;
        this.coordinate = coordinate;
        this.color = color;
        this.counter = 0;
    }

    incrementCounter() {
        this.counter++;
    }
}
