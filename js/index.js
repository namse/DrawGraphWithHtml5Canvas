/* global Canvas */
var canvas;
$(window).load(function () {

    // 이런식으로 초기화합니다.
    canvas = new Canvas($('#canvasModule')[0]);

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

            // 사각형 그리기
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fill();
            ctx.stroke();

            // 글씨 가운데에다가 적기
            ctx.fillStyle = "black";
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.fillText(text, width / 2, (height + fontSize) / 2, width);

            ctx.restore();
        };
    };

    var drawObject = new DrawableObject();

    // drawing function, x, y, width, height
    //canvas.addNode(drawObject.drawFunction, 50, 50, drawObject.width, drawObject.height);


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

            // 사각형 그리기
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fill();
            ctx.stroke();

            // 글씨 가운데에다가 적기
            ctx.fillStyle = "black";
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
    //canvas.addNode(drawObjectA.drawFunction, 250, 50, drawObjectA.width, drawObjectA.height);
    //canvas.addNode(drawObjectB.drawFunction, 250, 250, drawObjectB.width, drawObjectB.height);
    //canvas.addNode(drawObjectC.drawFunction, 250, 400, drawObjectC.width, drawObjectC.height);

    /// CustomizedDrawableObject 함수 자체는 중요하지 않습니다.
    /// 단지 canvas.addNode의 매개변수가 무엇인지 잘 파악해주십시오.
    /// 1. ctx를 매개변수로 받아서 그림을 그리는 함수
    /// 2~5 : x, y, width, height


    // 그리기를 시작합니다.
    var drawFrame = function () {
        canvas.onRender();
        setTimeout(drawFrame, 1);
    };
    drawFrame();
});


// 드래그에 대해서는 이런식으로 사용해보시는 것을 추천해드립니다.
var drawableObjectTable = {};

$(window).load(function () {

    // 위에 있는 항목을 재활용했습니다.
    // 당연히 재활용 할 필요 없습니다.
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

            // 사각형 그리기
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fill();
            ctx.stroke();

            // 글씨 가운데에다가 적기
            ctx.fillStyle = "black";
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.fillText(text, width / 2, (height + fontSize) / 2, width);

            ctx.restore();
        };
    };

    var drawable1 = new CustomizedDrawableObject(100, 100, 20, "A M");
    drawable1.drawFunction($('#drawable-1')[0].getContext('2d'));
    drawableObjectTable['drawable-1'] = drawable1;

    var drawable2 = new CustomizedDrawableObject(100, 100, 20, "ABB");
    drawable2.drawFunction($('#drawable-2')[0].getContext('2d'));
    drawableObjectTable['drawable-2'] = drawable2;

    var drawable3 = new CustomizedDrawableObject(100, 50, 20, "EESDD");
    drawable3.drawFunction($('#drawable-3')[0].getContext('2d'));
    drawableObjectTable['drawable-3'] = drawable3;

    var drawable4 = new CustomizedDrawableObject(100, 100, 20, "TEST");
    drawable4.drawFunction($('#drawable-4')[0].getContext('2d'));
    drawableObjectTable['drawable-4'] = drawable4;
});




function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var drawableID = ev.dataTransfer.getData("text");
    var drawableObject = drawableObjectTable[drawableID];


    var boundingClientRect = $('#canvasModule')[0].getBoundingClientRect();
    var canvasTop = boundingClientRect.top;
    var canvasLeft = boundingClientRect.left;

    var positionX = parseInt(event.clientX - canvasLeft - drawableObject.width / 2);
    var positionY = parseInt(event.clientY - canvasTop - drawableObject.height / 2);

    canvas.addNode(drawableObject.drawFunction, positionX, positionY, drawableObject.width, drawableObject.height);
}

function ondbclick() {
    console.log(canvas.getLastClickedNode());
}