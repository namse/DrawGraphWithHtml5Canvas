/* global Node */
function Canvas(canvasDOM){
    this.canvasDOM = canvasDOM;
    this.drawableChildren = [];
    
    this.addNode = function(image, x, y, width, height){
        if(typeof x === 'undefined') { 
            var position = this.getCurrentMousePosition();
            x = position.x;
            y = position.y;
        }
        var node = new Node(image, x, y, width, height);
        this.drawableChildren.push(node);
    };

    this.onRender = function(){
        var ctx = this.canvasDOM.getContext('2d');
        if(!!!ctx){
            console.log("can't get context of Canvas DOM.");
        } else {
            for(var i in this.drawableChildren){
                this.drawableChildren[i].onRender(ctx);
            }
        }
    };
    
    
    // return { x, y }
    this.getCurrentMousePosition = function(){
        
        // todo
        
        return {
            x: 0,
            y: 0
        };
    };
}