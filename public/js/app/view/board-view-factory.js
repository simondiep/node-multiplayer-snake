define([
    "view/board-view"
],

function (BoardView) {
    "use strict";
    
    class BoardViewFactory {
        
        static createBoardView(squareSizeInPixels, horizontalSquares, verticalSquares) {
            let canvas = document.createElement("canvas");
            canvas.width = horizontalSquares * squareSizeInPixels;
            canvas.height = verticalSquares * squareSizeInPixels;
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            document.getElementById("gameBoard").appendChild(canvas);
            return new BoardView(canvas, squareSizeInPixels);
        }
    }

    return BoardViewFactory;

});     