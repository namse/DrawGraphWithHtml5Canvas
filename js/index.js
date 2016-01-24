/* global Canvas */
$(document).ready(function(){
    var canvas = new Canvas($('#canvas')[0]);
    
    var myImage = $('#img')[0];

    canvas.addNode(myImage);
    
    canvas.onRender();
});