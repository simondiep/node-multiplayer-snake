define([
    "view/board-view",
    "view/dom-helper"
],

function (BoardView, DomHelper) {
    "use strict";
    
    class BoardViewFactory {
        
        static createBoardView(squareSizeInPixels, horizontalSquares, verticalSquares) {
            let canvas = DomHelper.createElement("canvas");
            canvas.width = horizontalSquares * squareSizeInPixels;
            canvas.height = verticalSquares * squareSizeInPixels;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            DomHelper.getGameBoardDiv().appendChild(canvas);
            return new BoardView(canvas, squareSizeInPixels);
        }
    }

    return BoardViewFactory;

});     