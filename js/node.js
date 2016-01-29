'use strict';

const DrawingLinePointRadius = 4;
const DrawingLinePointDirection = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right'
};

function Node(image, x, y, width, height) {
    // constructor
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width || image.width;
    this.height = height || image.height;

    this.linesOfDirection = {};
    this.linesOfDirection[DrawingLinePointDirection.TOP] = [];
    this.linesOfDirection[DrawingLinePointDirection.BOTTOM] = [];
    this.linesOfDirection[DrawingLinePointDirection.LEFT] = [];
    this.linesOfDirection[DrawingLinePointDirection.RIGHT] = [];
    this.isFocus = false;
    this.highlightedDrawingLinePointDirection = undefined; // or DrawingLinePointDirection




    this.onRender = function (ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.isFocus) {
            for (var direction in DrawingLinePointDirection) {
                var position = this.getDrawingLinePointPosition(DrawingLinePointDirection[direction]);
                ctx.beginPath();
                ctx.arc(position.x, position.y, DrawingLinePointRadius, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
                if (this.highlightedDrawingLinePointDirection == direction) {
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    };

    this.moveBy = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };

    this.focusOn = function () {
        this.isFocus = true;
    };
    this.focusOff = function () {
        this.isFocus = false;
    };

    this.isInBound = function (x, y) {
        if (this.x <= x && x <= this.x + this.width && this.y <= y && y <= this.y + this.height) {
            return true;
        }
        return false;
    };

    this.isInDrawingLinePointBound = function (x, y) {
        if (this.isInBound(x, y)) {
            var radius = DrawingLinePointRadius;

            // left or right
            if (this.y + (this.height) / 2 - radius <= y && y <= this.y + (this.height) / 2 + radius) {
                if (this.x <= x && x <= this.x + 2 * radius) {
                    return DrawingLinePointDirection.LEFT;
                }
                else if (this.x + this.width - 2 * radius <= x && x <= this.x + this.width) {
                    return DrawingLinePointDirection.RIGHT;
                }
            }
            // up or down
            else if (this.x + (this.width) / 2 - radius <= x && x <= this.x + (this.width) / 2 + radius) {
                // up
                if (this.y <= y && y <= this.y + 2 * radius) {
                    return DrawingLinePointDirection.TOP;
                }
                // down
                else if (this.y + this.height - 2 * radius <= y && y <= this.y + this.height) {
                    return DrawingLinePointDirection.BOTTOM;
                }
                console.log(this.y, this.height, y, this.y + this.height - 2 * radius);
            }
        }
        return false;
    };

    this.getDrawingLinePointPosition = function (drawingLinePointDirection) {
        var radius = DrawingLinePointRadius;
        if (drawingLinePointDirection === DrawingLinePointDirection.LEFT) {
            return {
                x: this.x + radius,
                y: this.y + (this.height) / 2
            };
        }
        else if (drawingLinePointDirection === DrawingLinePointDirection.RIGHT) {
            return {
                x: this.x + this.width - radius,
                y: this.y + (this.height) / 2
            };
        }
        else if (drawingLinePointDirection === DrawingLinePointDirection.TOP) {
            return {
                x: this.x + (this.width) / 2,
                y: this.y + radius
            };
        }
        else if (drawingLinePointDirection === DrawingLinePointDirection.BOTTOM) {
            return {
                x: this.x + (this.width) / 2,
                y: this.y + this.height - radius
            };
        }
        return undefined;
    };
    
    this.getNearestDrawingLinePointDirection = function (x, y){
        var minDistanceSquare;
        var minDirection;
        for(var i in DrawingLinePointDirection){
            var direction = DrawingLinePointDirection[i];
            var position = this.getDrawingLinePointPosition(direction);
            var distanceSquare = (position.x - x) * (position.x - x) + (position.y - y) * (position.y - y);
            if(!!!minDistanceSquare || distanceSquare < minDistanceSquare){
                minDistanceSquare = distanceSquare;
                minDirection = direction;
            }
        }
        return minDirection;
    };
    
    this.addLineofDirection = function(line, direction){
        this.linesOfDirection[direction].push(line);
    };
}