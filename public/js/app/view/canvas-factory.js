define([
    "view/canvas-view",
    "view/dom-helper"
],

function (CanvasView, DomHelper) {
    "use strict";
    
    class CanvasFactory {
        
        static createCanvasView(squareSizeInPixels, horizontalSquares, verticalSquares) {
            let canvas = DomHelper.createElement("canvas");
            canvas.width = horizontalSquares * squareSizeInPixels;
            canvas.height = verticalSquares * squareSizeInPixels;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            DomHelper.getGameBoardDiv().appendChild(canvas);
            let imageUploadCanvas = this._createImageUploadCanvas(squareSizeInPixels);
            return new CanvasView(canvas, squareSizeInPixels, imageUploadCanvas);
        }
        
        static _createImageUploadCanvas(squareSizeInPixels) {
            let canvas = document.createElement('canvas');
            let roundedSize = Math.floor(squareSizeInPixels);
            canvas.width = roundedSize;
            canvas.height = roundedSize;
            return canvas;
        }
    }

    return CanvasFactory;

});     