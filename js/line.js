'use strict';
/* global DrawingLinePointDirection */
/* global Point */

function Line(nodeA, directionA, nodeB, directionB) {

    this.nodeA = nodeA;
    this.directionA = directionA;
    this.nodeB = nodeB;
    this.directionB = directionB;
    this.points = []; // below -> above
    this.isCurve = false;
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
                    if (aboveBottomY > belowTopY) {
                        this.points.push(new Point(belowRightX, belowMidY));
                        this.points.push(new Point(belowRightX, aboveTopY));
                        this.points.push(new Point(aboveLeftX, aboveTopY));
                        this.points.push(new Point(aboveLeftX, aboveMidY));
                    }
                    else {
                        this.points.push(new Point(belowRightX, belowMidY));
                        this.points.push(new Point(belowRightX, midY));
                        this.points.push(new Point(aboveLeftX, midY));
                        this.points.push(new Point(aboveLeftX, aboveMidY));
                    }
                }
                else {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                break;
            case DrawingLinePointDirection.RIGHT:
                if (belowRightX < aboveLeftX && aboveBottomY > belowMidY) {
                    this.points.push(new Point(midX, belowMidY));
                    this.points.push(new Point(midX, aboveBottomY));
                    this.points.push(new Point(aboveRightX, aboveBottomY));
                    this.points.push(new Point(aboveRightX, aboveMidY));
                }
                else if (aboveRightX < belowLeftX && aboveMidY > belowTopY) {
                    this.points.push(new Point(belowRightX, belowMidY));
                    this.points.push(new Point(belowRightX, belowTopY));
                    this.points.push(new Point(midX, belowTopY));
                    this.points.push(new Point(midX, aboveMidY));
                }
                else {
                    this.points.push(new Point(rightX, belowMidY));
                    this.points.push(new Point(rightX, aboveMidY));
                }
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

        if (this.isCurve) {
            var points = [];
            points.push(belowNodeStartPosition.x, belowNodeStartPosition.y);
            for (var i in this.points) {
                var point = this.points[i];
                points.push(point.x, point.y);
            }
            points.push(aboveNodeStartPosition.x, aboveNodeStartPosition.y);
            drawCurve(ctx, points, 0.5);
        }
        else {
            ctx.moveTo(belowNodeStartPosition.x, belowNodeStartPosition.y);
            for (var i in this.points) {
                var point = this.points[i];
                ctx.lineTo(point.x, point.y);
            }
            ctx.lineTo(aboveNodeStartPosition.x, aboveNodeStartPosition.y);
        }


        // 화살표 그리기
        var pointLength = this.points.length;
        if (pointLength > 0) {
            var lastPointIndex;
            if (aboveNode == nodeB) {
                lastPointIndex = this.points.length - 1;
            }
            else {
                lastPointIndex = 0;
            }
            var lastPoint = this.points[lastPointIndex];
            var nodeBStartPosition = nodeB.getLineStartPosition(directionB);
            drawArrow(ctx, lastPoint.x, lastPoint.y, nodeBStartPosition.x, nodeBStartPosition.y);
        }

        ctx.stroke();
    };

    //http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas#answer-15528789
    function drawLines(ctx, pts) {
        ctx.moveTo(pts[0], pts[1]);
        for (var i = 2; i < pts.length - 1; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    }

    function getCurvePoints(pts, tension, isClosed, numOfSegments) {

        // use input value if provided, or use a default value   
        tension = (typeof tension != 'undefined') ? tension : 0.5;
        isClosed = isClosed ? isClosed : false;
        numOfSegments = numOfSegments ? numOfSegments : 16;

        var _pts = [],
            res = [], // clone array
            x, y, // our x,y coords
            t1x, t2x, t1y, t2y, // tension vectors
            c1, c2, c3, c4, // cardinal points
            st, t, i; // steps based on num. of segments

        // clone array so we don't change the original
        //
        _pts = pts.slice(0);

        // The algorithm require a previous and next point to the actual point array.
        // Check if we will draw closed or open curve.
        // If closed, copy end points to beginning and first points to end
        // If open, duplicate first points to befinning, end points to end
        if (isClosed) {
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.unshift(pts[pts.length - 1]);
            _pts.unshift(pts[pts.length - 2]);
            _pts.push(pts[0]);
            _pts.push(pts[1]);
        }
        else {
            _pts.unshift(pts[1]); //copy 1. point and insert at beginning
            _pts.unshift(pts[0]);
            _pts.push(pts[pts.length - 2]); //copy last point and append
            _pts.push(pts[pts.length - 1]);
        }

        // ok, lets start..

        // 1. loop goes through point array
        // 2. loop goes through each segment between the 2 pts + 1e point before and after
        for (var i = 2; i < (_pts.length - 4); i += 2) {
            for (var t = 0; t <= numOfSegments; t++) {

                // calc tension vectors
                t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
                t2x = (_pts[i + 4] - _pts[i]) * tension;

                t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
                t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

                // calc step
                st = t / numOfSegments;

                // calc cardinals
                c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
                c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
                c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
                c4 = Math.pow(st, 3) - Math.pow(st, 2);

                // calc x and y cords with common control vectors
                x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
                y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

                //store points in array
                res.push(x);
                res.push(y);

            }
        }

        return res;
    }

    function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

        showPoints = showPoints ? showPoints : false;

        ctx.beginPath();

        drawLines(ctx, getCurvePoints(ptsa, tension, isClosed, numOfSegments));

        if (showPoints) {
            ctx.stroke();
            ctx.beginPath();
            for (var i = 0; i < ptsa.length - 1; i += 2)
                ctx.rect(ptsa[i] - 2, ptsa[i + 1] - 2, 4, 4);
        }
    }

    //http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag#answer-6333775
    function drawArrow(context, fromx, fromy, tox, toy) {
        var headlen = 10; // length of head in pixels
        var angle = Math.atan2(toy - fromy, tox - fromx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        context.lineTo(tox, toy);
    }

}