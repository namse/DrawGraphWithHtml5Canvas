/* global Node */
function Canvas(canvasDOM) {
    canvasDOM = canvasDOM;
    var drawableChildren = [];
    var CanvasState = {
        IDLE: 0,
        NODE_CLICKED: 1,
        DRAWING_LINE_POINT_CLICKED: 2
    };
    var canvasStateMachine = CanvasState.IDLE;
    var mouseX;
    var mouseY;
    var focusedNode;
    var clickedNodeDrawingLinePointDirection;

    this.getCanvasStateMachine = function () {
        return canvasStateMachine;
    }

    this.addNode = function (image, x, y, width, height) {
        if (typeof x === 'undefined') {
            var position = this.getCurrentMousePosition();
            x = position.x;
            y = position.y;
        }
        var node = new Node(image, x, y, width, height);
        drawableChildren.push(node);
    };

    this.onRender = function () {
        var ctx = canvasDOM.getContext('2d');
        if (!!!ctx) {
            console.log("can't get context of Canvas DOM.");
        }
        else {
            ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

            for (var i in drawableChildren) {
                drawableChildren[i].onRender(ctx);
            }
        }
    };


    // return { x, y }
    this.getCurrentMousePosition = function () {
        return {
            x: mouseX || 0,
            y: mouseY || 0
        };
    };

    $(canvasDOM).mousedown(function (e) {
        updateMousePosition(e);
        if (canvasStateMachine === CanvasState.IDLE) {
            findNodeAndFocus().then(function (node) {
                clickedNodeDrawingLinePointDirection = node.isInDrawingLinePointBound(mouseX, mouseY); // false of Direction
                if (clickedNodeDrawingLinePointDirection) {
                    canvasStateMachine = CanvasState.DRAWING_LINE_POINT_CLICKED;
                }
                else {
                    canvasStateMachine = CanvasState.NODE_CLICKED;
                }
            });
        }
    }).mouseup(function (e) {
        updateMousePosition(e);
        if (canvasStateMachine === CanvasState.NODE_CLICKED) {
            canvasStateMachine = CanvasState.IDLE;
            findNodeAndFocus();
        }
        else if (canvasStateMachine === CanvasState.DRAWING_LINE_POINT_CLICKED) {
            findNodeInBound().then(function (node) {
                
            }).catch(function () {
                canvasStateMachine = CanvasState.IDLE;
                focusUpdate();
            })
        }
    }).mousemove(function (e) {
        var prevX = mouseX;
        var prevY = mouseY;
        updateMousePosition(e);
        var dX = mouseX - prevX;
        var dY = mouseY - prevY;
        if (canvasStateMachine === CanvasState.IDLE) {
            findNodeAndFocus();
        }
        else if (canvasStateMachine === CanvasState.NODE_CLICKED) {
            focusedNode.moveBy(dX, dY);
        }
    }).mouseenter(function (e) {
        updateMousePosition(e);
    }).mouseleave(function (e) {
        updateMousePosition(e);
        focusUpdate();
        canvasStateMachine = CanvasState.IDLE;
    });

    function updateMousePosition(e) {
        mouseX = e.pageX - canvasDOM.offsetLeft;
        mouseY = e.pageY - canvasDOM.offsetTop;
    }

    function findNodeAndFocus() {
        return new Promise(function (resolve, reject) { // resolve (node)
            findNodeInBound().then(function (node) {
                focusUpdate(node);
                return resolve(node);
            }).catch(function () {
                if (focusedNode) {
                    focusedNode.focusOff();
                }
                focusedNode = null;
                return;
            });
        });
    }

    function findNodeInBound() {
        return new Promise(function (resolve, reject) { // resolve (node)
            for (var i in drawableChildren) {
                if (drawableChildren[i] instanceof Node) {
                    var node = drawableChildren[i];
                    if (node.isInBound(mouseX, mouseY)) {
                        return resolve(node);
                    }
                }
            }
            return reject("can't find node");
        });
    }

    function focusUpdate(node) {
        if (focusedNode) {
            focusedNode.focusOff();
        }
        focusedNode = node;
        if(node){
            node.focusOn();
        }
    }
}