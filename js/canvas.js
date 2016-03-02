/* global Node */
/* global DrawingLinePointDirection */
/* global Line */
/* global Point */


function Canvas(canvasDOM) {
    this.canvasDOM = canvasDOM;
    var nodes = [];
    var lines = [];
    var CanvasState = {
        IDLE: 'IDLE',
        NODE_CLICKED: 'NODE_CLICKED',
        DRAWING_LINE_POINT_CLICKED: 'DRAWING_LINE_POINT_CLICKED',
        LINE_CLICKED: 'LINE_CLICKED',
        TITLE_CLICKED: 'TITLE_CLICKED',
        DRAG: "DRAG",
    };
    var canvasStateMachine = CanvasState.IDLE;
    var mouseX;
    var mouseY;
    var focusedNode;
    var clickedNodeDrawingLinePointDirection;
    var temporaryLine;
    var focusedLine;
    var clickedNodes = [];
    var clickedTitleLine;
    var isCtrlKeyPressed = false;
    var isRender = true;
    var isDrawGrid = false;
    var gridWidth = 30;
    var isMouseDown = false;
    var editingPointPair = -1;
    this.lastClickedNode = '123';
    var self = this;
    var clipboard = {
        nodeInfos: []
            // nodeInfo
            // {
            //     drawable
            //     x
            //     y
            //     width
            //     height
            // }
    };
    var mouseDragStartPoint;

    function onKeyDown(e) {
        // 17 == ctrl
        if (e.keyCode == 17) {
            isCtrlKeyPressed = true;
        }
        // 67 == c
        else if (e.keyCode == 67 && isCtrlKeyPressed == true) {
            copyClickedNodes();
        }
        // 88 == x
        else if (e.keyCode == 88 && isCtrlKeyPressed == true) {
            copyClickedNodes();
            removeClickedNodes();
        }
        // 86 == v
        else if (e.keyCode == 86 && isCtrlKeyPressed == true) {
            pasteClickedNodes();
        }

        if (37 <= e.keyCode && e.keyCode <= 40) { // Arrow Keys

            if (clickedNodes.length == 1 && e.shiftKey) {
                var x = clickedNodes[0].x;
                var y = clickedNodes[0].y;
                
                switch (e.keyCode) {
                case 37: // left key
                    x -= 1;
                    x = Math.floor(x / gridWidth) * gridWidth;
                    break;
                case 38: // up key
                    y -= 1;
                    y = Math.floor(y / gridWidth) * gridWidth;
                    break;
                case 39: // right key
                    x += 1;
                    x = Math.ceil(x / gridWidth) * gridWidth;
                    break;
                case 40: // down key
                    y += 1;
                    y = Math.ceil(y / gridWidth) * gridWidth;
                    break;
                }
                clickedNodes[0].x = x;
                clickedNodes[0].y = y;
            }
            else if (clickedNodes.length > 0) {
                var dx = 0;
                var dy = 0;
                switch (e.keyCode) {
                case 37: // left key
                    dx = -1;
                    break;
                case 38: // up key
                    dy = -1;
                    break;
                case 39: // right key
                    dx = 1;
                    break;
                case 40: // down key
                    dy = 1;
                    break;
                }
                
                if (e.shiftKey) {
                    dx *= gridWidth;
                    dy *= gridWidth;
                }
                
                for(var i in clickedNodes){
                    var node = clickedNodes[i];
                    node.x += dx;
                    node.y += dy;
                }
            }
        }
    }

    function onKeyUp(e) {
        // 78 == n
        if (e.keyCode == 78 && canvasStateMachine == CanvasState.LINE_CLICKED) {
            var title = prompt("input line's text", '');
            focusedLine.setTitle(title);
        }

        // 68 == d
        else if (e.keyCode == 68) {
            switch (canvasStateMachine) {
            case CanvasState.LINE_CLICKED:

                break;
            case CanvasState.NODE_CLICKED:
                break;
            default:
            }
        }

        // 17 == ctrl
        else if (e.keyCode == 17) {
            isCtrlKeyPressed = false;
        }

        // 46 == delete
        else if (e.keyCode == 46) {
            removeClickedNodes();
            if (focusedLine) {
                removeLine(focusedLine);
            }
        }

        // 71 == g
        else if (e.keyCode == 71) {
            isDrawGrid = !isDrawGrid;
        }

    }
    // register the handler 
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);

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
        nodes.unshift(node);
        return node;
    };

    this.onRender = function () {
        if (isRender) {
            var ctx = canvasDOM.getContext('2d');
            if (!!!ctx) {
                console.log("can't get context of Canvas DOM.");
            }
            else {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

                // drag rect
                if (canvasStateMachine == CanvasState.DRAG) {
                    ctx.save();
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'gray';
                    ctx.rect(mouseDragStartPoint.x, mouseDragStartPoint.y, mouseX - mouseDragStartPoint.x, mouseY - mouseDragStartPoint.y);
                    ctx.stroke();
                    ctx.fill();
                    ctx.restore();
                }

                if (isDrawGrid) {
                    drawGrid(ctx);
                }

                for (var i in lines) {
                    ctx.save();
                    var line = lines[i];
                    if (line == focusedLine) {
                        var isEditMode = true;
                        line.onRender(ctx, 'red', isEditMode);
                    }
                    else {
                        line.onRender(ctx);
                    }
                    ctx.restore();
                }
                if (temporaryLine) {
                    temporaryLine.onRender(ctx);
                }
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var node = nodes[i];
                    var isFocus = false;
                    var isClicked = false;
                    if (node == focusedNode) {
                        isFocus = true;
                    }
                    if (clickedNodes.indexOf(node) != -1) {
                        isClicked = true;
                    }
                    node.onRender(ctx, isFocus, isClicked);
                }


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


    // use self instead this
    $(canvasDOM).mousedown(function (e) {
        isMouseDown = true;
        updateMousePosition(e);
        isCtrlKeyPressed = e.ctrlKey;
        switch (canvasStateMachine) {
        case CanvasState.LINE_CLICKED:
        case CanvasState.IDLE:
            findNodeAndFocus(function (err, node) {
                if (!!!err) {
                    if (clickedNodes.indexOf(node) == -1) {
                        if (isCtrlKeyPressed == false) {
                            clickedNodes = [];
                        }
                        clickedNodes.push(node);
                        self.lastClickedNode = node;
                    }
                    clickedNodeDrawingLinePointDirection = node.isInDrawingLinePointBound(mouseX, mouseY); // false of Direction
                    console.log(clickedNodeDrawingLinePointDirection);
                    if (clickedNodeDrawingLinePointDirection) {
                        canvasStateMachine = CanvasState.DRAWING_LINE_POINT_CLICKED;
                    }
                    else {
                        canvasStateMachine = CanvasState.NODE_CLICKED;
                    }
                }
                else {
                    findLine(function (err, line) {
                        if (!!!err) {
                            focusedLine = line;
                            canvasStateMachine = CanvasState.LINE_CLICKED;
                            clickedNodes = [];
                            editingPointPair = line.findEditablePointsPair(mouseX, mouseY);
                        }
                        else {
                            findLineOfTitle(function (err, line) {
                                if (!!!err) {
                                    clickedTitleLine = line;
                                    canvasStateMachine = CanvasState.TITLE_CLICKED;
                                }
                                else {
                                    canvasStateMachine = CanvasState.DRAG;
                                    mouseDragStartPoint = new Point(mouseX, mouseY);
                                    clickedNodes = [];
                                }
                            });

                        }
                    });
                }
            });
            break;
        }
    }).mouseup(function (e) {
        isMouseDown = false;
        updateMousePosition(e);
        isCtrlKeyPressed = e.ctrlKey;

        switch (canvasStateMachine) {
        case CanvasState.NODE_CLICKED:
            canvasStateMachine = CanvasState.IDLE;
            findNodeAndFocus();
            break;
        case CanvasState.DRAWING_LINE_POINT_CLICKED:
            var end = function () {
                canvasStateMachine = CanvasState.IDLE;
                temporaryLine = null;
            };
            findNodeInBound(function (err, node) {
                if (!!err) {
                    return end();
                }
                else {
                    if (node != focusedNode) {
                        // focusedNode -> node 로 선을 그어줘야 함.
                        // 현재 마우스 포인터로 부터 node의 가장 가까운 DrawingLinePoint를 찾아야 함.
                        var direction = node.getNearestDrawingLinePointDirection(mouseX, mouseY);
                        addLine(focusedNode, clickedNodeDrawingLinePointDirection, node, direction);
                    }
                    else {
                        // 자기가 자신에게 선을 그을 수 있으려면(circular)
                        // 여기서 선을 처리하면 됨.
                    }
                    return end();
                }
            });
            break;
        case CanvasState.TITLE_CLICKED:
            canvasStateMachine = CanvasState.IDLE;
            break;
        case CanvasState.LINE_CLICKED:
            editingPointPair = -1;
            break;
        case CanvasState.DRAG:
            canvasStateMachine = CanvasState.IDLE;
            break;
        }
    }).mousemove(function (e) {
        var prevX = mouseX;
        var prevY = mouseY;

        updateMousePosition(e);
        isCtrlKeyPressed = e.ctrlKey;

        var dX = mouseX - prevX;
        var dY = mouseY - prevY;

        switch (canvasStateMachine) {
        case CanvasState.IDLE:
            findNodeAndFocus(function (err, node) {
                if (!!err || !!!node) {
                    findLine(function (err, line) {
                        if (!!!err) {
                            focusedLine = line;
                        }
                        else {
                            focusedLine = null;
                        }
                    });
                }
            });
            break;
        case CanvasState.NODE_CLICKED:
            for (var i in clickedNodes) {
                var node = clickedNodes[i];
                node.moveBy(dX, dY);
            }
            break;
        case CanvasState.DRAWING_LINE_POINT_CLICKED:

            findNodeInBound(function (err, node) {
                if (!!!err) {
                    // 현재 마우스 위에 원래 클릭한 노드 말고 다른 노드가 있는지 확인
                    if (node != focusedNode) {
                        // 현재 마우스 포인터로부터 가장 가까운 DrawingLinePoint를 찾는다.
                        var direction = node.getNearestDrawingLinePointDirection(mouseX, mouseY);

                        // 미리 선을 보여줘본다.
                        temporaryLine = new Line(focusedNode, clickedNodeDrawingLinePointDirection, node, direction);
                        // don't push temporaryLine to lines
                    }
                }
                else {
                    var toMouse = true;
                    temporaryLine = new Line(focusedNode, clickedNodeDrawingLinePointDirection, null, null, toMouse, mouseX, mouseY);
                }
            });
            break;
        case CanvasState.LINE_CLICKED:
            if (isMouseDown) {
                focusedLine.handleEditPointsPair(editingPointPair, dX, dY);
            }
            findLine(function (err, line) {
                if (!!!err) {
                    focusedLine = line;
                }
                else {
                    focusedLine = null;
                    canvasStateMachine = CanvasState.IDLE;
                }
            });
            break;
        case CanvasState.TITLE_CLICKED:
            clickedTitleLine.titlePosition.x += dX;
            clickedTitleLine.titlePosition.y += dY;
            break;
        case CanvasState.DRAG:
            findNodesOnDragArea();
            break;
        }
    }).mouseenter(function (e) {
        console.log('enter');
        updateMousePosition(e);
        isCtrlKeyPressed = e.ctrlKey;
    }).mouseleave(function (e) {
        console.log('leave');
        updateMousePosition(e);
        isCtrlKeyPressed = e.ctrlKey;
        focusUpdate();
        canvasStateMachine = CanvasState.IDLE;
        temporaryLine = undefined;
    });

    function updateMousePosition(e) {
        var canvasBoundingRect = canvasDOM.getBoundingClientRect();
        mouseX = e.pageX - canvasBoundingRect.left;
        mouseY = e.pageY - canvasBoundingRect.top;
    }

    function findNodeAndFocus(callback) { // callback(err, node)
        findNodeInBound(function (err, node) {
            if (!!!err) {
                focusUpdate(node);
                if (!!callback) {
                    callback(null, node);
                }
                return;
            }
            else {
                focusedNode = null;
                if (!!callback) {
                    callback(err);
                }
                return;
            }
        });
    }

    function findNodeInBound(callback) { // callback(err, node)
        for (var i in nodes) {
            if (nodes[i] instanceof Node) {
                var node = nodes[i];
                if (node.isInBound(mouseX, mouseY)) {
                    callback(null, node);
                    return;
                }
            }
        }
        return callback("can't find node");
    }

    function focusUpdate(node) {
        focusedNode = node;
    }

    function findLine(callback) { // callback(err, line)
        for (var i in lines) {
            if (lines[i] instanceof(Line)) {
                var line = lines[i];
                if (line.isPointOnLine(new Point(mouseX, mouseY))) {
                    callback(null, line);
                    return;
                }
            }
        }
        callback("can't find line");
        return;
    }

    function findLineOfTitle(callback) { // callback(err, line)
        for (var i in lines) {
            if (lines[i] instanceof(Line)) {
                var line = lines[i];
                if (line.isTitleClicked(new Point(mouseX, mouseY))) {
                    callback(null, line);
                    return;
                }
            }
        }
        callback("can't find line");
        return;
    }

    function addLine(nodeA, directionA, nodeB, directionB, callback) { // callback(line)
        var newLine = new Line(nodeA, directionA, nodeB, directionB);
        nodeA.addLineofDirection(newLine, directionA);
        nodeB.addLineofDirection(newLine, directionB);
        lines.push(newLine);
        console.log('add line : ' + newLine);
    }

    function removeClickedNodes() {
        for (var i in clickedNodes) {
            var clickedNode = clickedNodes[i];
            removeLineOfNode(clickedNode);
            var index = nodes.indexOf(clickedNode);
            if (index > -1) {
                nodes.splice(index, 1);
            }
        }
        self.lastClickedNode = undefined;
    }

    function removeLineOfNode(node) {
        for (var direction in DrawingLinePointDirection) {
            for (var i in node.linesOfDirection[direction]) {
                var line = node.linesOfDirection[direction][i];
                removeLine(line);
            }
        }
    }

    function removeLine(line) {
        var index = lines.indexOf(line);
        if (index > -1) {
            lines.splice(index, 1);
        }

        index = line.nodeA.linesOfDirection[line.directionA].indexOf(line);
        if (index > -1) {
            line.nodeA.linesOfDirection[line.directionA].splice(index, 1);
        }

        index = line.nodeB.linesOfDirection[line.directionB].indexOf(line);
        if (index > -1) {
            line.nodeB.linesOfDirection[line.directionB].splice(index, 1);
        }
    }

    this.stopRender = function () {
        isRender = false;
    };

    this.startRender = function () {
        isRender = true;
    };

    function drawGrid(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 1;
        for (var x = 0; x <= canvasDOM.width; x += gridWidth) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasDOM.height);
        }

        for (var y = 0; y <= canvasDOM.height; y += gridWidth) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasDOM.width, y);
        }
        ctx.stroke();
    }

    this.getLastClickedNode = function () {
        return this.lastClickedNode;
    };
    this.getNodes = function () {
        return nodes;
    };

    function copyClickedNodes() {
        clipboard.nodeInfos = [];
        // find baseX and baseY
        for (var i in clickedNodes) {
            var clickedNode = clickedNodes[i];
            clipboard.nodeInfos.push({
                drawable: clickedNode.drawable,
                x: clickedNode.x,
                y: clickedNode.y,
                width: clickedNode.width,
                height: clickedNode.height
            });
        }
        console.log(clipboard);
    }

    function pasteClickedNodes() {
        clickedNodes = [];
        var pasteGap = 20;
        for (var i in clipboard.nodeInfos) {
            var nodeInfo = clipboard.nodeInfos[i];
            var newNode = self.addNode(nodeInfo.drawable,
                nodeInfo.x + pasteGap,
                nodeInfo.y - pasteGap,
                nodeInfo.width,
                nodeInfo.height);
            clickedNodes.push(newNode);
        }
    }

    function findNodesOnDragArea() {
        clickedNodes = [];
        for (var i in nodes) {
            var node = nodes[i];
            if (mouseDragStartPoint.x <= node.x && node.x + node.width <= mouseX && mouseDragStartPoint.y <= node.y && node.y + node.height <= mouseY) {
                clickedNodes.push(node);
            }
        }
    }
}