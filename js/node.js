'use strict';

function Node(image, x, y, width, height){
    // constructor
    this.image = image;
    this.x = x;
    this.y = y;
    this.width = width || image.width;
    this.height = width || image.height;

    this.lines = [];
    this.isShowDrawingLinePoint = false;
    this.highlightedDrawingLinePointDirection = undefined; // or DrawingLinePointDirection
    

    const DrawingLinePointRadius = 4;
    const DrawingLinePointDirection = {
        UP : 'up',
        DOWN : 'down',
        LEFT : 'left',
        RIGHT : 'right'
    };
    
    this.onRender = function(ctx){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        for(var i in this.lines){
            this.lines[i].onRender();
        }
        if(this.showDrawingLinePoint){
            for(var direction in DrawingLinePointDirection){
                var position = this.getDrawingLinePointPosition(DrawingLinePointDirection[direction]);
                ctx.beginPath();
                ctx.arc(position.x, position.y, DrawingLinePointRadius, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
                if(this.highlightedDrawingLinePointDirection == direction){
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    };

    this.isInBound = function(x, y){
        if(this.x >= x && this.x + this.width <= x
        && this.y >= y && this.y + this.height <= y){
            return true;
        }
        return false;
    };
    
    this.isInDrawingLinePointBound = function(x, y){
        if(this.isInBound(x, y)){
            var radius = DrawingLinePointRadius;
            
            // left or right
            if(this.y + (this.height)/2 - radius >= y 
            && this.y + (this.height)/2 + radius <= y){
                if(this.x >= x 
                && this.x + 2 * radius <= x){
                    return DrawingLinePointDirection.LEFT;
                }
                else if(this.x + this.width - 2 * radius >= x 
                && this.x + this.width <= x){
                    return DrawingLinePointDirection.RIGHT;
                }
            }
            // up or down
            else if(this.x + (this.width)/2 - radius >= x 
            && this.x + (this.width)/2 + radius <= x){
                // up
                if(this.y >= y 
                && this.y + 2 * radius <= y){
                    return DrawingLinePointDirection.UP;
                }
                // down
                else if(this.y + this.height - 2 * radius >= y
                && this.y + this.height <= y){
                    return DrawingLinePointDirection.DOWN;
                }
            }
        }
        return false;
    };
    
    this.getDrawingLinePointPosition = function(drawingLinePointDirection){
        var radius = DrawingLinePointRadius;
        if(drawingLinePointDirection === DrawingLinePointDirection.LEFT){
            return {
                x: this.x + radius,
                y: this.y + (this.height)/2
            };
        } else if(drawingLinePointDirection === DrawingLinePointDirection.RIGHT){
            return {
                x: this.x + this.width - radius,
                y: this.y + (this.height)/2
            }
        } else if(drawingLinePointDirection === DrawingLinePointDirection.UP){
            return {
                x: this.x + (this.width)/2,
                y: this.y + radius
            }
        } else if(drawingLinePointDirection === DrawingLinePointDirection.DOWN){
            return {
                x: this.x + (this.width)/2,
                y: this.y + this.height - radius
            }
        }
        return undefined;
    }
}