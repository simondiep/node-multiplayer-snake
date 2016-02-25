define([
    "view/canvas-view",
    "view/dom-helper"
],

function (CanvasView, DomHelper) {
    "use strict";
    
    class CanvasFactory {
        
        static createCanvasView(squareSizeInPixels, horizontalSquares, verticalSquares) {
            const canvas = DomHelper.createElement("canvas");
            canvas.width = horizontalSquares * squareSizeInPixels;
            canvas.height = verticalSquares * squareSizeInPixels;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            DomHelper.getGameBoardDiv().appendChild(canvas);
            const imageUploadCanvas = this._createImageUploadCanvas(squareSizeInPixels);
            return new CanvasView(canvas, squareSizeInPixels, imageUploadCanvas);
        }
        
        static _createImageUploadCanvas(squareSizeInPixels) {
            const canvas = document.createElement('canvas');
            const roundedSize = Math.floor(squareSizeInPixels);
            canvas.width = roundedSize;
            canvas.height = roundedSize;
            return canvas;
        }
    }

    return CanvasFactory;

});     