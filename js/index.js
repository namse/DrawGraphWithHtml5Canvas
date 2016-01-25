/* global Canvas */
$(window).load(function () {
    var canvas = new Canvas($('#canvas')[0]);

    var myImage = $('#img')[0];

    canvas.addNode(myImage);
    canvas.addNode(myImage);

    var drawFrame = function() {
        canvas.onRender();
        console.log(canvas.getCanvasStateMachine());
        setTimeout(drawFrame, 1);
    };
    drawFrame();
});
