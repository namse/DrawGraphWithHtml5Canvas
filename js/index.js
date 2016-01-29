/* global Canvas */
$(window).load(function () {
    var canvas = new Canvas($('#canvas')[0]);

    var myImage = $('#img')[0];
    
    canvas.addNode(myImage, 100, 100);
    canvas.addNode(myImage, 100, 200);

    var drawFrame = function() {
        canvas.onRender();
        console.log(canvas.getCanvasStateMachine());
        setTimeout(drawFrame, 1);
    };
    drawFrame();
});
