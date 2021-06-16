// initialization
var mouseX = 0, mouseY = 0;
var mouseB = 0;
var pmouseX = 0, pmouseY = 0;

var palette_colors = [
    [0, 0, 0], 
    [100, 100, 100],
    [255, 255, 255], 
    [255, 0, 0], 
    [0, 255, 0], 
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
    [100, 255, 255],
    [255, 100, 100]
];


function init() {
    makePalette();
    colorPreview();
}

function makeColor(color) {
    return "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
}

function makePalette() {
    var cvs = document.getElementById("color_palette");
    var ctx = cvs.getContext("2d");

    for (var i = 0; i < palette_colors.length; i++) {
        ctx.fillStyle = makeColor(palette_colors[i]);
        ctx.fillRect(i * 25, 0, 25, 25);
    }
}


function selectColor() {
    var cvs = document.getElementById("color_palette");
    var ctx = cvs.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    clickX = event.pageX - rect.left;
    clickY = event.pageY - rect.top;
    var imagedata = ctx.getImageData(clickX, clickY, 1, 1);
    fm.r.value = imagedata.data[0];
    fm.g.value = imagedata.data[1];
    fm.b.value = imagedata.data[2];
    colorPreview();
}
// start = [x1, y1], end = [x2, y2]
// color = [r, g, b]
function line(ctx, start, end, color, linedash=[1, 0]) {
    ctx.strokeStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    ctx.setLineDash(linedash);
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
}


// クリックした地点
var click_startX = 0, click_startY = 0;
// 離した地点
var click_endX = 0, click_endY = 0;
// ボタンを押したときのキャンバスの状態
var myImageData = undefined;

function canvasMousedown() {
    mouseB = 1
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    // ボタンを押した位置を保存
    click_startX = event.pageX - rect.left;
    click_startY = event.pageY - rect.top;
    // 画面の状態を保存
    if (fm.mode[1].checked || fm.mode[2].checked){
        myImageData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }
}


function canvasMouseup() {
    mouseB = 0;
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    var mouseupX = event.pageX - rect.left;
    var mouseupY = event.pageY - rect.top;

    if (myImageData != undefined) {
        ctx.putImageData(myImageData, 0, 0);
        myImageData = undefined;
        if (fm.mode[1].checked) {
            line(ctx, [click_startX, click_startY], [mouseupX, mouseupY], getColor());
        }
        else if (fm.mode[2].checked) {
            rect_width = mouseupX - click_startX;
            rect_height = mouseupY - click_startY;
            
            ctx.fillStyle = getColor(list=false);
            ctx.fillRect(click_startX, click_startY, rect_width, rect_height)
        }
    }
}


function mouseMove() {
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    var color = getColor();
    mouseX = event.pageX - rect.left;
    mouseY = event.pageY - rect.top;
    if (mouseB != 0) {
        if (fm.mode[0].checked) {
            // フリーハンド
            line(ctx, [pmouseX, pmouseY], [mouseX, mouseY], color);
        }
        else if (fm.mode[1].checked) {
            // 直線
            clear(ctx);
            ctx.putImageData(myImageData, 0, 0);
            line(ctx, [click_startX, click_startY], [mouseX, mouseY], getColor());
        }
        else if (fm.mode[2].checked) {
            // 矩形
            clear(ctx);
            rect_width = mouseX - click_startX;
            rect_height = mouseY - click_startY;
            ctx.putImageData(myImageData, 0, 0);
            ctx.fillStyle = getColor(list=false);
            ctx.fillRect(click_startX, click_startY, rect_width, rect_height)
        }
    }
    pmouseX = mouseX;
    pmouseY = mouseY;
}


function colorPreview() {
    var cvs = document.getElementById("color_preview");
    var ctx = cvs.getContext("2d");
    ctx.fillStyle = "rgb(" + Number(fm.r.value) + ", " + Number(fm.g.value) + ", " + Number(fm.b.value) + ")";
    ctx.fillRect(0, 0, 80, 80);
}


function getColor(list=true) {
    if (list)
        return [fm.r.value, fm.g.value, fm.b.value];
    return "rgb(" + fm.r.value + ", " + fm.g.value + ", " + fm.b.value + ")";
}


function clear(ctx) {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

function clear_screen() {
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    clear(ctx);
}
