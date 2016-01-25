/* global Node */
function Canvas(canvasDOM) {
    canvasDOM = canvasDOM;
    this.drawableChildren = [];
    var CanvasState = {
        IDLE: 0,
        NODE_CLICKED: 1,
        DRAWING_LINE_POINT_CLICKED: 2
    };
    var canvasStateMachine = CanvasState.IDLE;
    var mouseX;
    var mouseY;
    var focusedNode;

    this.addNode = function (image, x, y, width, height) {
        if (typeof x === 'undefined') {
            var position = this.getCurrentMousePosition();
            x = position.x;
            y = position.y;
        }
        var node = new Node(image, x, y, width, height);
        this.drawableChildren.push(node);
    };

    this.onRender = function () {
        var ctx = canvasDOM.getContext('2d');
        if (!!!ctx) {
            console.log("can't get context of Canvas DOM.");
        }
        else {
            for (var i in this.drawableChildren) {
                this.drawableChildren[i].onRender(ctx);
            }
        }
    };


    // return { x, y }
    this.getCurrentMousePosition = function () {

        // todo

        return {
            x: 0,
            y: 0
        };
    };

    $(canvasDOM).mousedown(function (e) {
        updateMousePosition(e);
        if (canvasStateMachine === CanvasState.IDLE) {
            for (var i in this.drawableChildren) {
                if (this.drawableChildren[i] instanceof Node) {
                    var node = this.drawableChildren[i];
                    if (node.isInBound(mouseX, mouseY)) {
                        focusedNode.isShowDrawingLinePoint = false;
                        focusedNode = node;
                        node.isShowDrawingLinePoint = true;
                        
                        if (node.isInDrawingLinePointBound(mouseX, mouseY)) {
                            canvasStateMachine = CanvasState.DRAWING_LINE_POINT_CLICKED;
                        }
                        else {
                            canvasStateMachine.CanvasState.NODE_CLICKED;
                        }
                        break;
                    }
                }
            }
        }
    }).mouseup(function (e) {
        updateMousePosition(e);
    }).mousemove(function (e) {
        updateMousePosition(e);
    }).mouseenter(function (e) {
        updateMousePosition(e);
    });

    function updateMousePosition(e) {
        mouseX = e.pageX - canvasDOM.offsetLeft;
        mouseY = e.pageY - canvasDOM.offsetTop;
        console.log(mouseX + ' ' + mouseY);
    }
}