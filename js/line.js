'use strict';
/* global DrawingLinePointDirection */
/* global Point */

function Line(nodeA, directionA, nodeB, directionB) {

    this.nodeA = nodeA;
    this.directionA = directionA;
    this.nodeB = nodeB;
    this.directionB = directionB;
    this.points = []; // below -> above

    var belowNode, belowDirection, aboveNode, aboveDirection;

    this.calculateDrawingPoints = function () { // direction for drawingLinePointDirection
        const LEAST_GAP = 10;
        if (nodeA.y > nodeB.y) {
            belowNode = nodeA;
            belowDirection = directionA;

            aboveNode = nodeB;
            aboveDirection = directionB;

        }
        else {
            belowNode = nodeB;
            belowDirection = directionB;
            aboveNode = nodeA;
            aboveDirection = directionA;
        }

        var belowLeftX = belowNode.x - LEAST_GAP;
        var belowCenterX = belowNode.x + belowNode.width / 2;
        var belowRightX = belowNode.x + belowNode.width + LEAST_GAP;

        var aboveLeftX = aboveNode.x - LEAST_GAP;
        var aboveCenterX = aboveNode.x + aboveNode.width / 2;
        var aboveRightX = aboveNode.x + aboveNode.width + LEAST_GAP;

        var midX = (belowCenterX + aboveCenterX) / 2;


        var belowTopY = belowNode.y - LEAST_GAP;
        var belowCenterY = belowNode.y + belowNode.height / 2;
        var belowBottomY = belowNode.y + belowNode.height + LEAST_GAP;

        var aboveTopY = aboveNode.y - LEAST_GAP;
        var aboveCenterY = aboveNode.y + aboveNode.height / 2;
        var aboveBottomY = aboveNode.y + aboveNode.height + LEAST_GAP;

        var midY = (belowCenterY + aboveCenterY) / 2;

        this.points = [];

        switch (belowDirection) {
        case DrawingLinePointDirection.TOP:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                var topY = Math.min(belowTopY, aboveTopY);
                this.points.push(new Point(belowCenterX, topY));
                this.points.push(new Point(aboveCenterX, topY));
                break;
            case DrawingLinePointDirection.BOTTOM:
                this.points.push(new Point(belowCenterX, midY));
                this.points.push(new Point(aboveCenterX, midY));
                break;
            case DrawingLinePointDirection.LEFT:
                if(belowCenterX > aboveLeftX){
                    this.points.push(new Point(belowCenterX, midY));
                    this.points.push(new Point(aboveLeftX, midY));
                    this.points.push(new Point(aboveLeftX, aboveCenterY));
                } else {
                    this.points.push(new Point(belowCenterX, aboveCenterY));
                }
                break;
            case DrawingLinePointDirection.RIGHT:
                if(belowCenterX > aboveLeftX){
                    this.points.push(new Point(belowCenterX, aboveCenterY));
                } else {
                    this.points.push(new Point(belowCenterX, midY));
                    this.points.push(new Point(aboveRightX, midY));
                    this.points.push(new Point(aboveRightX, aboveCenterY));
                }
                break;
            }
            break;
        case DrawingLinePointDirection.BOTTOM:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                break;
            case DrawingLinePointDirection.BOTTOM:
                var bottomY = Math.max(belowBottomY, aboveBottomY);
                this.points.push(new Point(belowCenterX, bottomY));
                this.points.push(new Point(aboveCenterX, bottomY));
                break;
            case DrawingLinePointDirection.LEFT:
                break;
            case DrawingLinePointDirection.RIGHT:
                break;
            }
            break;
        case DrawingLinePointDirection.LEFT:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                break;
            case DrawingLinePointDirection.BOTTOM:
                break;
            case DrawingLinePointDirection.LEFT:
                var leftX = Math.min(belowLeftX, aboveLeftX);
                this.points.push(new Point(leftX, belowCenterY));
                this.points.push(new Point(leftX, aboveCenterY));
                break;
            case DrawingLinePointDirection.RIGHT:
                this.points.push(new Point(midX, belowCenterY));
                this.points.push(new Point(midX, aboveCenterY));
                break;
            }
            break;
        case DrawingLinePointDirection.RIGHT:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                break;
            case DrawingLinePointDirection.BOTTOM:
                break;
            case DrawingLinePointDirection.LEFT:
                this.points.push(new Point(midX, belowCenterY));
                this.points.push(new Point(midX, aboveCenterY));
                break;
            case DrawingLinePointDirection.RIGHT:
                var rightX = Math.max(belowRightX, aboveRightX);
                this.points.push(new Point(rightX, belowCenterY));
                this.points.push(new Point(rightX, aboveCenterY));
                break;
            }
            break;
        }

    };
    this.calculateDrawingPoints();

    this.onRender = function (ctx) {
        this.calculateDrawingPoints();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        var belowNodeStartPosition = belowNode.getDrawingLinePointPosition(belowDirection);
        var aboveNodeStartPosition = aboveNode.getDrawingLinePointPosition(aboveDirection);
        ctx.moveTo(belowNodeStartPosition.x, belowNodeStartPosition.y);
        for (var i in this.points) {
            var point = this.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(aboveNodeStartPosition.x, aboveNodeStartPosition.y);
        ctx.stroke();
    };
}