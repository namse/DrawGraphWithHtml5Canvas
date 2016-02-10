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
        var belowMidX = belowNode.x + belowNode.width / 2;
        var belowRightX = belowNode.x + belowNode.width + LEAST_GAP;

        var aboveLeftX = aboveNode.x - LEAST_GAP;
        var aboveMidX = aboveNode.x + aboveNode.width / 2;
        var aboveRightX = aboveNode.x + aboveNode.width + LEAST_GAP;

        var belowTopY = belowNode.y - LEAST_GAP;
        var belowMidY = belowNode.y + belowNode.height / 2;
        var belowBottomY = belowNode.y + belowNode.height + LEAST_GAP;

        var aboveTopY = aboveNode.y - LEAST_GAP;
        var aboveMidY = aboveNode.y + aboveNode.height / 2;
        var aboveBottomY = aboveNode.y + aboveNode.height + LEAST_GAP;

        var midY = (belowMidY + aboveMidY) / 2;

        var leftX = Math.min(belowLeftX, aboveLeftX);
        var midX;
        if (belowLeftX - aboveRightX > 0) {
            midX = aboveRightX + (belowLeftX - aboveRightX) / 2;
        }
        else {
            midX = belowRightX + (aboveLeftX - belowRightX) / 2;
        }
        var rightX = Math.max(belowRightX, aboveRightX);

        this.points = [];

        switch (belowDirection) {
        case DrawingLinePointDirection.TOP:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                if (aboveLeftX < belowMidX && belowMidX <= aboveMidX) {
                    this.points.push(new Point(belowMidX, midY));
                    this.points.push(new Point(aboveLeftX, midY));
                    this.points.push(new Point(aboveLeftX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                else if (aboveMidX < belowMidX && belowMidX <= aboveRightX) {
                    this.points.push(new Point(belowMidX, midY));
                    this.points.push(new Point(aboveRightX, midY));
                    this.points.push(new Point(aboveRightX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                else {
                    this.points.push(new Point(belowMidX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                break;
            case DrawingLinePointDirection.BOTTOM:
                if (belowTopY > aboveBottomY) {
                    this.points.push(new Point(belowMidX, midY));
                    this.points.push(new Point(aboveMidX, midY));
                }
                else {
                    this.points.push(new Point(belowMidX, belowTopY));
                    this.points.push(new Point(midX, belowTopY));
                    this.points.push(new Point(midX, aboveBottomY));
                    this.points.push(new Point(aboveMidX, aboveBottomY));
                }
                break;
            case DrawingLinePointDirection.LEFT:
                if (belowMidX < aboveLeftX) {
                    if (belowTopY > aboveMidY) {
                        this.points.push(new Point(belowMidX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowMidX, belowTopY));
                        this.points.push(new Point(midX, belowTopY));
                        this.points.push(new Point(midX, aboveMidY));
                    }
                }
                else {
                    if (belowTopY > aboveBottomY) {
                        this.points.push(new Point(belowMidX, midY));
                        this.points.push(new Point(aboveLeftX, midY));
                        this.points.push(new Point(aboveLeftX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowMidX, aboveTopY));
                        this.points.push(new Point(aboveLeftX, aboveTopY));
                        this.points.push(new Point(aboveLeftX, aboveMidY));
                    }
                }
                break;
            case DrawingLinePointDirection.RIGHT:

                if (belowMidX < aboveRightX) {
                    if (belowTopY > aboveBottomY) {
                        this.points.push(new Point(belowMidX, midY));
                        this.points.push(new Point(aboveRightX, midY));
                        this.points.push(new Point(aboveRightX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowMidX, aboveTopY));
                        this.points.push(new Point(aboveRightX, aboveTopY));
                        this.points.push(new Point(aboveRightX, aboveMidY));
                    }
                }
                else {
                    if (belowTopY > aboveMidY) {
                        this.points.push(new Point(belowMidX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowMidX, belowTopY));
                        this.points.push(new Point(midX, belowTopY));
                        this.points.push(new Point(midX, aboveMidY));
                    }
                }
                break;
            }
            break;
        case DrawingLinePointDirection.BOTTOM:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                this.points.push(new Point(belowMidX, belowBottomY));
                if (belowLeftX < aboveRightX && aboveMidX < belowMidX) {
                    this.points.push(new Point(leftX, belowBottomY));
                    this.points.push(new Point(leftX, aboveTopY));
                }
                else if (belowMidX <= aboveMidX && aboveLeftX < belowRightX) {
                    this.points.push(new Point(rightX, belowBottomY));
                    this.points.push(new Point(rightX, aboveTopY));
                }
                else {
                    this.points.push(new Point(midX, belowBottomY));
                    this.points.push(new Point(midX, aboveTopY));
                }
                this.points.push(new Point(aboveMidX, aboveTopY));
                break;
            case DrawingLinePointDirection.BOTTOM:
                this.points.push(new Point(belowMidX, belowBottomY));
                // 중앙에 있는 경우
                if (belowLeftX < aboveMidX && aboveMidX < belowRightX) {
                    if (aboveMidX < belowMidX) {
                        this.points.push(new Point(belowLeftX, belowBottomY));
                        this.points.push(new Point(belowLeftX, midY));
                    }
                    else {
                        this.points.push(new Point(belowRightX, belowBottomY));
                        this.points.push(new Point(belowRightX, midY));
                    }
                    this.points.push(new Point(aboveMidX, midY));
                }
                else {
                    this.points.push(new Point(aboveMidX, belowBottomY));
                }
                break;
            case DrawingLinePointDirection.LEFT:
                this.points.push(new Point(belowMidX, belowBottomY));
                //우측의 경우
                if (belowRightX < aboveLeftX) {
                    this.points.push(new Point(midX, belowBottomY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                else {
                    this.points.push(new Point(leftX, belowBottomY));
                    this.points.push(new Point(leftX, aboveMidY));
                }

                break;
            case DrawingLinePointDirection.RIGHT:
                this.points.push(new Point(belowMidX, belowBottomY));
                //좌측의 경우
                if (belowLeftX > aboveRightX) {
                    this.points.push(new Point(midX, belowBottomY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                else {
                    this.points.push(new Point(rightX, belowBottomY));
                    this.points.push(new Point(rightX, aboveMidY));
                }
                // TODO :  y축이 비슷할 경우 처리 안되어있음
                break;
            }
            break;
        case DrawingLinePointDirection.LEFT:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                if (aboveRightX < belowLeftX) {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                else {
                    this.points.push(new Point(leftX, belowMidY));
                    this.points.push(new Point(leftX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                break;
            case DrawingLinePointDirection.BOTTOM:
                if (belowLeftX < aboveMidX) {
                    if (aboveBottomY > belowTopY) {
                        this.points.push(new Point(belowLeftX, belowMidY));
                        this.points.push(new Point(belowLeftX, belowTopY));
                        this.points.push(new Point(midX, belowTopY));
                        this.points.push(new Point(midX, aboveBottomY));
                        this.points.push(new Point(aboveMidX, aboveBottomY));
                    }
                    else {
                        this.points.push(new Point(belowLeftX, belowMidY));
                        this.points.push(new Point(belowLeftX, midY));
                        this.points.push(new Point(aboveMidX, midY));
                    }
                }
                else {
                    if (aboveBottomY > belowMidY) {
                        this.points.push(new Point(midX, belowMidY));
                        this.points.push(new Point(midX, aboveBottomY));
                        this.points.push(new Point(aboveMidX, aboveBottomY));
                    }
                    else {
                        this.points.push(new Point(aboveMidX, belowMidY));
                    }
                }
                break;
            case DrawingLinePointDirection.LEFT:
                if (aboveRightX < belowLeftX && aboveBottomY > belowMidY) {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveBottomY));
                    this.points.push(new Point(aboveLeftX, aboveBottomY));
                    this.points.push(new Point(aboveLeftX, aboveMidY));
                }
                else if (belowRightX < aboveLeftX && aboveMidY > belowTopY) {
                    this.points.push(new Point(belowLeftX, belowMidY));
                    this.points.push(new Point(belowLeftX, belowTopY));
                    this.points.push(new Point(midX, belowTopY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                else {
                    this.points.push(new Point(leftX, belowMidY));
                    this.points.push(new Point(leftX, aboveMidY));
                }
                break;
            case DrawingLinePointDirection.RIGHT:
                if (aboveRightX > belowLeftX) {
                    if (aboveBottomY > belowTopY) {
                        this.points.push(new Point(belowLeftX, belowMidY));
                        this.points.push(new Point(belowLeftX, aboveTopY));
                        this.points.push(new Point(aboveRightX, aboveTopY));
                        this.points.push(new Point(aboveRightX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowLeftX, belowMidY));
                        this.points.push(new Point(belowLeftX, midY));
                        this.points.push(new Point(aboveRightX, midY));
                        this.points.push(new Point(aboveRightX, aboveMidY));
                    }
                }
                else {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                break;
            }
            break;
        case DrawingLinePointDirection.RIGHT:
            switch (aboveDirection) {
            case DrawingLinePointDirection.TOP:
                if (belowRightX < aboveLeftX) {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                else {
                    this.points.push(new Point(rightX, belowMidY));
                    this.points.push(new Point(rightX, aboveTopY));
                    this.points.push(new Point(aboveMidX, aboveTopY));
                }
                break;
            case DrawingLinePointDirection.BOTTOM:
                if (belowRightX > aboveMidX) {
                    if (aboveBottomY < belowTopY) {
                        this.points.push(new Point(belowRightX, belowMidY));
                        this.points.push(new Point(belowRightX, midY));
                        this.points.push(new Point(aboveMidX, midY));
                    }
                    else {
                        this.points.push(new Point(belowRightX, belowMidY));
                        this.points.push(new Point(belowRightX, belowBottomY));
                        this.points.push(new Point(aboveMidX, belowBottomY));
                    }
                }
                else {
                    if (belowMidY > aboveBottomY) {
                        this.points.push(new Point(aboveMidX, belowMidY));
                    }
                    else {
                        this.points.push(new Point(midX, belowMidY));
                        this.points.push(new Point(midX, aboveBottomY));
                        this.points.push(new Point(aboveMidX, aboveBottomY));
                    }
                }
                break;
            case DrawingLinePointDirection.LEFT:
                if (aboveLeftX < belowRightX) {
                    this.points.push(new Point(belowRightX, belowMidY));
                    this.points.push(new Point(belowRightX, midY));
                    this.points.push(new Point(aboveLeftX, midY));
                    this.points.push(new Point(aboveLeftX, aboveMidY));
                }
                else {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                break;
            case DrawingLinePointDirection.RIGHT:
                this.points.push(new Point(rightX, belowMidY));
                this.points.push(new Point(rightX, aboveMidY));
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
        var belowNodeStartPosition = belowNode.getLineStartPosition(belowDirection);
        var aboveNodeStartPosition = aboveNode.getLineStartPosition(aboveDirection);
        ctx.moveTo(belowNodeStartPosition.x, belowNodeStartPosition.y);
        for (var i in this.points) {
            var point = this.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineTo(aboveNodeStartPosition.x, aboveNodeStartPosition.y);
        ctx.stroke();
    };
}