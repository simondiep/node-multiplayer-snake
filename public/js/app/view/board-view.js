define(function () {
    "use strict";
    
    class BoardView {
        
        constructor(canvas, squareSizeInPixels) {
            this.height = canvas.height;
            this.width = canvas.width;
            this.context = canvas.getContext("2d");
            this.squareSizeInPixels = squareSizeInPixels;
        }
        
        clear() {
            this.context.fillStyle = "black";
            this.context.globalAlpha = 1;
            this.context.fillRect(0, 0, this.width, this.height);
            
            this.context.lineWidth = this.squareSizeInPixels;
            this.context.strokeStyle = "gray";
            this.context.strokeRect(0, 0, this.width, this.height);
        }
        
        drawSquares(coordinates, color) {
            for(let coordinate of coordinates) {
                this.drawSquare(coordinate, color);
            }
        }
        
        drawSquare(coordinate, color) {
            let x = coordinate.x * this.squareSizeInPixels;
            let y = coordinate.y * this.squareSizeInPixels;
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
            let x = coordinate.x * this.squareSizeInPixels;
            let y = coordinate.y * this.squareSizeInPixels;
            let lengthAroundSquare = this.squareSizeInPixels * 2;
            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.moveTo(x - lengthAroundSquare, y - lengthAroundSquare);
            this.context.lineTo(x + lengthAroundSquare, y - lengthAroundSquare);
            this.context.lineTo(x + lengthAroundSquare, y + lengthAroundSquare);
            this.context.lineTo(x - lengthAroundSquare, y + lengthAroundSquare);
            this.context.closePath();
            this.context.stroke();
        }
    }

    return BoardView;

});     