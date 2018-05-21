import ClientConfig from '../config/client-config.js';

/**
 * Handles all requests related to the canvas
 */
export default class CanvasView {
    constructor(canvas, squareSizeInPixels, imageUploadCanvas, canvasClickHandler) {
        this.height = canvas.height;
        this.width = canvas.width;
        this.context = canvas.getContext('2d');
        this.squareSizeInPixels = squareSizeInPixels;
        this.backgroundImageUploadCanvas = canvas;
        this.imageUploadCanvas = imageUploadCanvas;
        this.showGridLines = false;
        this._initializeClickListeners(canvas, canvasClickHandler);
    }

    clear() {
        this.context.fillStyle = 'black';
        this.context.globalAlpha = 1;
        this.context.fillRect(0, 0, this.width, this.height);

        if (this.backgroundImage) {
            this.context.drawImage(this.backgroundImage, 0, 0);
        }

        if (this.showGridLines) {
            this.context.strokeStyle = '#2a2a2a';
            this.context.lineWidth = 0.5;
            for (let i = this.squareSizeInPixels / 2; i < this.width || i < this.height; i += this.squareSizeInPixels) {
                // draw horizontal lines
                this.context.moveTo(i, 0);
                this.context.lineTo(i, this.height);
                // draw vertical lines
                this.context.moveTo(0, i);
                this.context.lineTo(this.width, i);
            }
            this.context.stroke();
        }
    }

    drawImages(coordinates, base64Image) {
        for (const coordinate of coordinates) {
            this.drawImage(coordinate, base64Image);
        }
    }

    drawImage(coordinate, base64Image) {
        const x = coordinate.x * this.squareSizeInPixels;
        const y = coordinate.y * this.squareSizeInPixels;
        const image = new Image();
        image.src = base64Image;
        this.context.drawImage(image, x - (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2),
            this.squareSizeInPixels, this.squareSizeInPixels);
    }

    drawSquares(coordinates, color) {
        for (const coordinate of coordinates) {
            this.drawSquare(coordinate, color);
        }
    }

    drawSquare(coordinate, color) {
        const x = coordinate.x * this.squareSizeInPixels;
        const y = coordinate.y * this.squareSizeInPixels;
        this.context.fillStyle = color;
        this.context.beginPath();
        this.context.moveTo(x - (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2));
        this.context.lineTo(x + (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2));
        this.context.lineTo(x + (this.squareSizeInPixels / 2), y + (this.squareSizeInPixels / 2));
        this.context.lineTo(x - (this.squareSizeInPixels / 2), y + (this.squareSizeInPixels / 2));
        this.context.closePath();
        this.context.fill();
    }

    drawSquareAround(coordinate, color) {
        const x = coordinate.x * this.squareSizeInPixels;
        const y = coordinate.y * this.squareSizeInPixels;
        const lengthAroundSquare = this.squareSizeInPixels * 2;
        this.context.lineWidth = this.squareSizeInPixels;
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(x - lengthAroundSquare, y - lengthAroundSquare);
        this.context.lineTo(x + lengthAroundSquare, y - lengthAroundSquare);
        this.context.lineTo(x + lengthAroundSquare, y + lengthAroundSquare);
        this.context.lineTo(x - lengthAroundSquare, y + lengthAroundSquare);
        this.context.closePath();
        this.context.stroke();
    }

    drawFadingText(textToDraw, turnsToShow) {
        this.context.save();
        this.context.globalAlpha = this._getOpacityFromCounter(textToDraw.counter, turnsToShow);
        this.context.lineWidth = 1;
        this.context.strokeStyle = 'black';
        this.context.fillStyle = textToDraw.color;
        this.context.font = ClientConfig.CANVAS_TEXT_STYLE;

        const textWidth = this.context.measureText(textToDraw.text).width;
        const textHeight = 24;
        let x = textToDraw.coordinate.x * this.squareSizeInPixels - textWidth / 2;
        let y = textToDraw.coordinate.y * this.squareSizeInPixels + textHeight / 2;
        if (x < 0) {
            x = 0;
        } else if (x > (this.width - textWidth)) {
            x = this.width - textWidth;
        }
        if (y < textHeight) {
            y = textHeight;
        } else if (y > this.height) {
            y = this.height;
        }
        // Draw text specifying the bottom left corner
        this.context.strokeText(textToDraw.text, x, y);
        this.context.fillText(textToDraw.text, x, y);
        this.context.restore();
    }

    clearBackgroundImage() {
        delete this.backgroundImage;
    }

    setBackgroundImage(backgroundImage) {
        this.backgroundImage = new Image();
        this.backgroundImage.src = backgroundImage;
    }

    resizeUploadedBackgroundImageAndBase64(image, imageType) {
        const imageToDraw = image;
        const maxImageWidth = this.backgroundImageUploadCanvas.width;
        const maxImageHeight = this.backgroundImageUploadCanvas.height;
        if (imageToDraw.width > maxImageWidth) {
            imageToDraw.width = maxImageWidth;
        }
        if (imageToDraw.height > maxImageHeight) {
            imageToDraw.height = maxImageHeight;
        }
        const imageUploadCanvasContext = this.backgroundImageUploadCanvas.getContext('2d');
        imageUploadCanvasContext.clearRect(0, 0, maxImageWidth, maxImageHeight);
        imageUploadCanvasContext.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height);

        return this.backgroundImageUploadCanvas.toDataURL(imageType);
    }

    resizeUploadedImageAndBase64(image, imageType) {
        const imageToDraw = image;
        const maxImageWidth = this.imageUploadCanvas.width;
        const maxImageHeight = this.imageUploadCanvas.height;
        if (imageToDraw.width > maxImageWidth) {
            imageToDraw.width = maxImageWidth;
        }
        if (imageToDraw.height > maxImageHeight) {
            imageToDraw.height = maxImageHeight;
        }
        const imageUploadCanvasContext = this.imageUploadCanvas.getContext('2d');
        imageUploadCanvasContext.clearRect(0, 0, maxImageWidth, maxImageHeight);
        imageUploadCanvasContext.drawImage(imageToDraw, 0, 0, imageToDraw.width, imageToDraw.height);

        return this.imageUploadCanvas.toDataURL(imageType);
    }

    toggleGridLines() {
        this.showGridLines = !this.showGridLines;
    }

    // Gets a fade-in/fade-out opacity
    _getOpacityFromCounter(counter, turnsToShow) {
        if (counter < turnsToShow * 0.1 || counter > turnsToShow * 0.9) {
            return 0.33;
        } else if (counter < turnsToShow * 0.2 || counter > turnsToShow * 0.8) {
            return 0.66;
        }
        return 1;
    }

    _initializeClickListeners(canvas, canvasClickHandler) {
        const self = this;
        canvas.addEventListener('click', event => {
            const x = event.pageX - canvas.offsetLeft;
            const y = event.pageY - canvas.offsetTop;
            const xCoord = Math.round(x / self.squareSizeInPixels);
            const yCoord = Math.round(y / self.squareSizeInPixels);
            canvasClickHandler(xCoord, yCoord);
        }, false);
    }
}
