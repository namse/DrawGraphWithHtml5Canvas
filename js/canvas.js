/* global Node */
/* global DrawingLinePointDirection */
/* global Line */
/* global Point */
function Canvas(canvasDOM) {
    this.canvasDOM = canvasDOM;
    var nodes = [];
    var nodes = [];
    var lines = [];
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
    var temporaryLine;

    this.getCanvasStateMachine = function () {
        return canvasStateMachine;
    };
    this.getFocusedNode = function () {
        return focusedNode;
    };

    this.addNode = function (drawable, x, y, width, height) {
        if (typeof x === 'undefined') {
            var position = this.getCurrentMousePosition();
            x = position.x;
            y = position.y;
        }
        var node = new Node(drawable, x, y, width, height);
        nodes.push(node);
    };

    this.onRender = function () {
        var ctx = canvasDOM.getContext('2d');
        if (!!!ctx) {
            console.log("can't get context of Canvas DOM.");
        }
        else {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

            for (var i in lines) {
                lines[i].onRender(ctx);
            }
            if (temporaryLine) {
                temporaryLine.onRender(ctx);
            }
            for (var i in nodes) {
                nodes[i].onRender(ctx);
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
        console.log('down');
        updateMousePosition(e);
        switch (canvasStateMachine) {
        case CanvasState.IDLE:
            findNodeAndFocus().then(function (node) {
                clickedNodeDrawingLinePointDirection = node.isInDrawingLinePointBound(mouseX, mouseY); // false of Direction
                console.log(clickedNodeDrawingLinePointDirection);
                if (clickedNodeDrawingLinePointDirection) {
                    canvasStateMachine = CanvasState.DRAWING_LINE_POINT_CLICKED;
                }
                else {
                    canvasStateMachine = CanvasState.NODE_CLICKED;
                }
            });
            break;
        }
    }).mouseup(function (e) {
        console.log('up');
        updateMousePosition(e);

        switch (canvasStateMachine) {
        case CanvasState.NODE_CLICKED:
            canvasStateMachine = CanvasState.IDLE;
            findNodeAndFocus();
            break;
        case CanvasState.DRAWING_LINE_POINT_CLICKED:
            var end = function () {
                canvasStateMachine = CanvasState.IDLE;
                temporaryLine = null;
            }
            findNodeInBound().then(function (node) {
                if (node != focusedNode) {
                    // focusedNode -> node 로 선을 그어줘야 함.
                    // 현재 마우스 포인터로 부터 node의 가장 가까운 DrawingLinePoint를 찾아야 함.
                    var direction = node.getNearestDrawingLinePointDirection(mouseX, mouseY);
                    var newLine = new Line(focusedNode, clickedNodeDrawingLinePointDirection, node, direction);

                    focusedNode.addLineofDirection(newLine, clickedNodeDrawingLinePointDirection);
                    node.addLineofDirection(newLine, direction);
                    lines.push(newLine);
                    console.log(newLine);
                }
                else {
                    // 자기가 자신에게 선을 그을 수 있으려면(circular)
                    // 여기서 선을 처리하면 됨.
                }
                end();
            }).catch(function () {end()});
            break;
        }
    }).mousemove(function (e) {
        console.log('move');
        var prevX = mouseX;
        var prevY = mouseY;

        updateMousePosition(e);

        var dX = mouseX - prevX;
        var dY = mouseY - prevY;

        switch (canvasStateMachine) {
        case CanvasState.IDLE:
            findNodeAndFocus();
            break;
        case CanvasState.NODE_CLICKED:
            focusedNode.moveBy(dX, dY);
            break;
        case CanvasState.DRAWING_LINE_POINT_CLICKED:

            findNodeInBound().then(function (node) {
                // 현재 마우스 위에 원래 클릭한 노드 말고 다른 노드가 있는지 확인
                if (node != focusedNode) {
                    // 현재 마우스 포인터로부터 가장 가까운 DrawingLinePoint를 찾는다.
                    var direction = node.getNearestDrawingLinePointDirection(mouseX, mouseY);

                    // 미리 선을 보여줘본다.
                    temporaryLine = new Line(focusedNode, clickedNodeDrawingLinePointDirection, node, direction);
                    // don't push temporaryLine to lines
                }
            }).catch(function () {
                // 못찾은 경우.
                // 마우스를 목표점 삼아 선을 그린다.
            });
            break;
        }
    }).mouseenter(function (e) {
        console.log('enter');
        updateMousePosition(e);
    }).mouseleave(function (e) {
        console.log('leave');
        updateMousePosition(e);
        focusUpdate();
        canvasStateMachine = CanvasState.IDLE;
        temporaryLine = undefined;
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
            for (var i in nodes) {
                if (nodes[i] instanceof Node) {
                    var node = nodes[i];
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
        if (node) {
            node.focusOn();
        }
    }
}