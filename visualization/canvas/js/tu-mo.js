/*
* 所谓canvas涂抹，就是重新写一个 clearRect()上去
* 手指坐标所在地是一个小圆圈，也就是要不断的画小圆圈
* 非也，其实就是画线，粗线，两头圆，拐弯，重合部分透明
    ctx.lineWidth = 40 ; // 设置线条宽度
    ctx.lineCap = "round";　　//设置线条两端为圆弧
        ctx.lineJoin = "round";　　//设置线条转折为圆弧
*/

function tuMo(arg) {
    var canvas = document.getElementById('canvas');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var ctx = canvas.getContext('2d');

    var img = new Image();
    img.src = arg.src;
    var cha = (canvas.height - canvas.width * 16 / 9) / 2;
    img.addEventListener('load', function() {
        ctx.drawImage(img, 0, cha, canvas.width, canvas.width * 16 / 9);
        ctx.globalCompositeOperation = "destination-out"; // 先画上一张图之后，再设定对重合部分的处理
    });

    var hastouch = !!navigator.userAgent.toLowerCase().match(/phone|pad|pod|android/g)
        tapstart = hastouch ? "touchstart" : "mousedown",
        tapmove = hastouch ? "touchmove" : "mousemove",
        tapend = hastouch ? "touchend" : "mouseup";

    canvas.addEventListener(tapstart, function(event) {
        touchstart(event)
    });
    canvas.addEventListener(tapmove, function(event) {
        touchmove(event)
    });
    canvas.addEventListener(tapend, function(event) {
        testData();
    });

    var xx, yy, XX, YY, touching;
    var canvasTop, canvasLeft;
    canvasTop = canvas.getBoundingClientRect().top;
    canvasLeft = canvas.getBoundingClientRect().left;

    function touchstart(event) {
        touching = true;
        event.preventDefault();
        xx = hastouch ? event.targetTouches[0].clientX : event.clientX - canvasLeft;
        yy = hastouch ? event.targetTouches[0].clientY : event.clientY - canvasTop;

        ctx.lineWidth = 40;
        ctx.lineCap = "round";　　 //设置线条两端为圆弧
        ctx.lineJoin = "round";　　 //设置线条转折为圆弧
        ctx.save();

        ctx.restore();
    }

    function touchmove(event) {
        event.preventDefault();
        if (!touching) return
        XX = hastouch ? event.targetTouches[0].clientX : event.clientX - canvasLeft;
        YY = hastouch ? event.targetTouches[0].clientY : event.clientY - canvasTop;

        ctx.save();
        ctx.moveTo(xx, yy);
        ctx.lineTo(XX, YY);
        ctx.stroke();
        ctx.restore();

        xx = XX, yy = YY;
    }

    function testData() {
        if (!touching) return
        else touching = false
        /*遍历canvas的getImageData，判断*/
        var whiteZone = 0;
        dataList = ctx.getImageData(0, 0, canvas.height, canvas.width);
        var len = dataList.data.length;
        for (var i = 0; i < len; i++) {
            if ((i+1)%4===0 && dataList.data[i]*10 === 0) {
                whiteZone++;
            }
        }

        if (whiteZone >= len/4*arg.area) {
            canvas.style.display = "none";
        }
    }

}
