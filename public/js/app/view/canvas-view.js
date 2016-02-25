define(function () {
    "use strict";
    
    class CanvasView {
        
        constructor(canvas, squareSizeInPixels, imageUploadCanvas) {
            this.height = canvas.height;
            this.width = canvas.width;
            this.context = canvas.getContext("2d");
            this.squareSizeInPixels = squareSizeInPixels;
            this.backgroundImageUploadCanvas = canvas;
            this.imageUploadCanvas = imageUploadCanvas;
            this.showGridLines = false;
        }
        
        clear() {
            this.context.fillStyle = "black";
            this.context.globalAlpha = 1;
            this.context.fillRect(0, 0, this.width, this.height);
            
            if(this.backgroundImage) {
                this.context.drawImage(this.backgroundImage,0,0);
            }
            
            this.context.lineWidth = this.squareSizeInPixels;
            this.context.strokeStyle = "gray";
            this.context.strokeRect(0, 0, this.width, this.height);
            
            if(this.showGridLines) {
                this.context.strokeStyle = "#2a2a2a";
                this.context.lineWidth = 0.5;
                for(let i = this.squareSizeInPixels/2; i < this.width || i < this.height; i += this.squareSizeInPixels) {
                    // draw horizontal lines
                    this.context.moveTo( i, 0 );
                    this.context.lineTo( i, this.height);
                    // draw vertical lines
                    this.context.moveTo( 0, i );
                    this.context.lineTo( this.width, i);
                }
                this.context.stroke();
            }
        }
        
        drawImages(coordinates, base64Image) {
            for(let coordinate of coordinates) {
                this.drawImage(coordinate, base64Image);
            }
        }
        
        drawImage(coordinate, base64Image) {
            let x = coordinate.x * this.squareSizeInPixels;
            let y = coordinate.y * this.squareSizeInPixels;
            let image = new Image();
            image.src = base64Image;
            this.context.drawImage(image, x - (this.squareSizeInPixels / 2), y - (this.squareSizeInPixels / 2), this.squareSizeInPixels, this.squareSizeInPixels);
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
        
        clearBackgroundImage() {
            delete this.backgroundImage;
        }
        
        setBackgroundImage(backgroundImage) {
            this.backgroundImage = new Image();
            this.backgroundImage.src = backgroundImage;
        }
        
        resizeUploadedBackgroundImageAndBase64(image, imageType){
            let maxImageWidth = this.backgroundImageUploadCanvas.width;
            let maxImageHeight = this.backgroundImageUploadCanvas.height;
            if(image.width > maxImageWidth ) {
                image.width = maxImageWidth;
            }
            if(image.height > maxImageHeight ) {
                image.height = maxImageHeight;
            }
            let imageUploadCanvasContext = this.backgroundImageUploadCanvas.getContext("2d");
            // clear canvas for next image
            imageUploadCanvasContext.fillStyle = "black";
            imageUploadCanvasContext.fillRect(0, 0, maxImageWidth, maxImageHeight);
            
            imageUploadCanvasContext.drawImage(image, 0, 0, image.width, image.height);

            return this.backgroundImageUploadCanvas.toDataURL(imageType);
        }
        
        resizeUploadedImageAndBase64(image, imageType){
            let maxImageWidth = this.imageUploadCanvas.width;
            let maxImageHeight = this.imageUploadCanvas.height;
            if(image.width > maxImageWidth ) {
                image.width = maxImageWidth;
            }
            if(image.height > maxImageHeight ) {
                image.height = maxImageHeight;
            }
            let imageUploadCanvasContext = this.imageUploadCanvas.getContext("2d");
            // clear canvas for next image
            imageUploadCanvasContext.fillStyle = "black";
            imageUploadCanvasContext.fillRect(0, 0, maxImageWidth, maxImageHeight);
            
            imageUploadCanvasContext.drawImage(image, 0, 0, image.width, image.height);

            return this.imageUploadCanvas.toDataURL(imageType);
        }
        
        toggleGridLines() {
            this.showGridLines = !this.showGridLines;
        }
    }

    return CanvasView;

});     