/* global Canvas */
$(window).load(function () {
    var canvas = new Canvas($('#canvas')[0]);

    // 이미지는 이런 식으로 추가 가능합니다.
    // var myImage = $('#img')[0];
    // canvas.addNode(myImage, 100, 100);
    // canvas.addNode(myImage, 100, 200);


    // 아래는 Canvas(직접 그리는 방법)를 넣는 경우입니다.
    // 예시
    var DrawableObject = function () {
        var width = this.width = 120;
        var height = this.height = 50;
        var fontSize = 20;
        var font = fontSize + 'px Arial';
        var text = 'ABC Module';

        // 꼭 ctx를 입력받도록 해주세요.
        this.drawFunction = function (ctx) {
            ctx.save();

            // (x, y)를 (0, 0)기준으로 만들어주세요.

            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";

            // 사각형 그리기
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.lineTo(0, 0);
            ctx.stroke();

            // 글씨 가운데에다가 적기
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.fillText(text, width / 2, (height + fontSize) / 2, width);

            ctx.restore();
        };
    };

    var drawObject = new DrawableObject();

    // drawing function, x, y, width, height
    canvas.addNode(drawObject.drawFunction, 50, 50, drawObject.width, drawObject.height);
    
    
    /// 이런식으로 함수를 만들어 사용하실 수 있습니다.
    var CustomizedDrawableObject = function (width, height, fontSize, text) {
        this.width = width;
        this.height = height;
        var font = fontSize + 'px Arial';

        // 꼭 ctx를 입력받도록 해주세요.
        this.drawFunction = function (ctx) {
            ctx.save();

            // (x, y)를 (0, 0)기준으로 만들어주세요.

            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";

            // 사각형 그리기
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.lineTo(0, 0);
            ctx.stroke();

            // 글씨 가운데에다가 적기
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.fillText(text, width / 2, (height + fontSize) / 2, width);

            ctx.restore();
        };
    };
    
    var drawObjectA = new CustomizedDrawableObject(30, 100, 10, 'A');
    var drawObjectB = new CustomizedDrawableObject(200, 100, 20, 'MODULE BB');
    var drawObjectC = new CustomizedDrawableObject(40, 20, 5, 'CCC');

    // drawing function, x, y, width, height
    canvas.addNode(drawObjectA.drawFunction, 250, 50, drawObjectA.width, drawObjectA.height);
    canvas.addNode(drawObjectB.drawFunction, 250, 250, drawObjectB.width, drawObjectB.height);
    canvas.addNode(drawObjectC.drawFunction, 250, 400, drawObjectC.width, drawObjectC.height);
    
    /// CustomizedDrawableObject 함수 자체는 중요하지 않습니다.
    /// 단지 canvas.addNode의 매개변수가 무엇인지 잘 파악해주십시오.
    /// 1. ctx를 매개변수로 받아서 그림을 그리는 함수
    /// 2~5 : x, y, width, height

    var drawFrame = function () {
        canvas.onRender();
        console.log(canvas.getCanvasStateMachine());
        setTimeout(drawFrame, 1);
    };
    drawFrame();
});
