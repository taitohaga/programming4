// マウスの座標
var mouseX = 0, mouseY = 0;
// マウスのクリックの有無
var mouseB = 0;
// 直前のマウスの座標
var pmouseX = 0, pmouseY = 0;

var palette_colors = [
    [0, 0, 0], 
    [255, 0, 0], 
    [0, 255, 0], 
    [0, 0, 255],
    [255, 255, 0],
    [255, 0, 255],
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
        ctx.fillRect(i % 3 * 60, Math.floor(i / 3) * 40, 60, 40);
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
    ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    const penWidth = getSize();

    dx = end[0] - start[0];
    dy = end[1] - start[1];
    abs = Math.sqrt(dx * dx + dy * dy);
    unitX = dx / abs * 1;
    unitY = dy / abs * 1;
    for (var i = 0; i < abs; i = i + 1) {
        pointX = start[0] + unitX * i;
        pointY = start[1] + unitY * i;
        ctx.fillRect(pointX - penWidth / 2, pointY - penWidth / 2, penWidth, penWidth);
    }
}

function eraser(ctx, start, end, color=[0, 0, 0, 0], linedash=[1, 0]) {
    var eraserSize = getSize();
    // ctx.fillStyle = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + color[3] + ")";
    const penWidth = getSize();

    dx = end[0] - start[0];
    dy = end[1] - start[1];
    abs = Math.sqrt(dx * dx + dy * dy);
    unitX = dx / abs * 1;
    unitY = dy / abs * 1;
    for (var i = 0; i < abs; i = i + 1) {
        pointX = start[0] + unitX * i;
        pointY = start[1] + unitY * i;
        ctx.clearRect(pointX - eraserSize / 2, pointY - eraserSize / 2, eraserSize, eraserSize);
    }
}

function marker(ctx, start, end, color, linedash=[1, 0]) {
    for (var i = 0; i < color.length; i++) {
        if (color[i] < 100) {
            color[i] = 100;
        }
    }
    ctx.fillStyle = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
    const markerWidth = getSize();
    const markerHeight = getSize() * 4;
    
    dx = end[0] - start[0];
    dy = end[1] - start[1];
    abs = Math.sqrt(dx * dx + dy * dy);
    unitX = dx / abs * 1;
    unitY = dy / abs * 1;
    for (var i = 0; i < abs; i = i + 1) {
        pointX = start[0] + unitX * i;
        pointY = start[1] + unitY * i;
        ctx.fillRect(pointX - markerWidth / 2, pointY - markerHeight / 2, markerWidth, markerHeight);
    }
}
// クリックした地点
var click_startX = 0, click_startY = 0;
// 離した地点
var click_endX = 0, click_endY = 0;
// ボタンを押したときのキャンバスの状態
var temporalBuffer = undefined;

function canvasMousedown() {
    mouseB = 1
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    // ボタンを押した位置を保存
    click_startX = event.pageX - rect.left;
    click_startY = event.pageY - rect.top;
    // 画面の状態を保存
    if (fm.mode[2].checked || fm.mode[3].checked){
        temporalBuffer = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }
}


function canvasMouseup() {
    mouseB = 0;
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");
    var rect = cvs.getBoundingClientRect();
    var mouseupX = event.pageX - rect.left;
    var mouseupY = event.pageY - rect.top;

    if (temporalBuffer != undefined) {
        ctx.putImageData(temporalBuffer, 0, 0);
        temporalBuffer = undefined;
        if (fm.mode[2].checked) {
            line(ctx, [click_startX, click_startY], [mouseupX, mouseupY], getColor());
        }
        else if (fm.mode[3].checked) {
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
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");
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
            marker(ctx_m, [pmouseX, pmouseY], [mouseX, mouseY], color);

        }
        else if (fm.mode[2].checked) {
            // 直線
            clear(ctx);
            ctx.putImageData(temporalBuffer, 0, 0);
            line(ctx, [click_startX, click_startY], [mouseX, mouseY], getColor());
        }
        else if (fm.mode[3].checked) {
            // 矩形
            clear(ctx);
            rect_width = mouseX - click_startX;
            rect_height = mouseY - click_startY;
            ctx.putImageData(temporalBuffer, 0, 0);
            ctx.fillStyle = getColor(list=false);
            ctx.fillRect(click_startX, click_startY, rect_width, rect_height)
        }
        else if (fm.mode[4].checked) {
            // 消しゴム
            eraser(ctx, [pmouseX, pmouseY], [mouseX, mouseY]);
            eraser(ctx_m, [pmouseX, pmouseY], [mouseX, mouseY]);
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


// フォームのパレットから色を読み取る。
// list: trueのとき、RGB値をリストで取得する。
function getColor(list=true) {
    if (list)
        return [fm.r.value, fm.g.value, fm.b.value];
    return "rgb(" + fm.r.value + ", " + fm.g.value + ", " + fm.b.value + ")";
}

function getSize() {
    for (var i = 0; i < fm.size.length; i++) {
        if (fm.size[i].checked) {
            return (i + 2) * i + 2;
        }
    }
}


function clear(ctx) {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
}

function clear_screen() {
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");
    clear(ctx);
    clear(ctx_m);
}


var pagesPen = [];
var pagesMarker = [];

var currentPage = 0;

function switchPages(direction) {
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");

    var previousPage = currentPage;
    currentPage += direction;
    if (currentPage < 0) {
        currentPage = 0;
    }

    pagesPen[previousPage] = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    pagesMarker[previousPage] = ctx_m.getImageData(0, 0, ctx_m.canvas.clientWidth, ctx_m.canvas.clientHeight);

    clear(ctx);
    clear(ctx_m);

    if (currentPage >= pagesPen.length) {
        // 新規ページ
        pagesPen.push(ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight));
        pagesMarker.push(ctx.getImageData(0, 0, ctx_m.canvas.clientWidth, ctx_m.canvas.clientHeight));
        console.log("新規ページ", pagesPen.length);
    }
    else {
        ctx.putImageData(pagesPen[currentPage], 0, 0);
        ctx_m.putImageData(pagesMarker[currentPage], 0, 0);
    }
    var pagelabel = document.getElementById("currentpage");
    pagelabel.innerHTML = currentPage + 1;
    var totallabel = document.getElementById("totalpage");
    totallabel.innerHTML = pagesPen.length;
}


function deletePage() {
    if (pagesPen.length < 2) {
        return;
    }

    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");

    pagesPen.splice(currentPage, 1);
    pagesMarker.splice(currentPage, 1);

    clear(ctx);
    clear(ctx_m);

    if (currentPage == pagesPen.length) {
        currentPage -= 1;
    }
    ctx.putImageData(pagesPen[currentPage], 0, 0);
    ctx_m.putImageData(pagesMarker[currentPage], 0, 0);

    var pagelabel = document.getElementById("currentpage");
    pagelabel.innerHTML = currentPage + 1;
    var totallabel = document.getElementById("totalpage");
    totallabel.innerHTML = pagesPen.length;
}


var cvsBuf = document.createElement("canvas");
cvsBuf.width = 1400;
cvsBuf.height = 620;
var ctxBuf = cvsBuf.getContext("2d");


function getImagefromCanvas(data) {
    return new Promise((resolve, reject) => {
        ctxBuf.putImageData(data, 0, 0);
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = ctxBuf.canvas.toDataURL();
    });
}


async function saveImages() {
    var cvs = document.getElementById("hcnv");
    var ctx = cvs.getContext("2d");
    var cvs_m = document.getElementById("hcnv_m");
    var ctx_m = cvs_m.getContext("2d");

    if (pagesPen.length == 0) {
        pagesPen.push(ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight));
        pagesMarker.push(ctx.getImageData(0, 0, ctx_m.canvas.clientWidth, ctx_m.canvas.clientHeight));
    }
    else {
        pagesPen[currentPage] = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        pagesMarker[currentPage] = ctx_m.getImageData(0, 0, ctx_m.canvas.clientWidth, ctx_m.canvas.clientHeight);
    }


    var cvsSum = document.createElement("canvas");
    cvsSum.width = 1400;
    cvsSum.height = 620 * pagesPen.length;
    var ctxSum = cvsSum.getContext("2d");

    for (var i = 0; i < pagesPen.length; i++) {
        const imageMarker = await getImagefromCanvas(pagesMarker[i]);
        const imagePen = await getImagefromCanvas(pagesPen[i]);
        ctxBuf.drawImage(imageMarker, 0, 0, 1400, 620);
        ctxBuf.drawImage(imagePen, 0, 0, 1400, 620);
        ctxSum.putImageData(ctxBuf.getImageData(0, 0, 1400, 620), 0, i * 620);
        clear(ctxBuf);
    }

    ctx.putImageData(pagesPen[currentPage], 0, 0);
    ctx_m.putImageData(pagesMarker[currentPage], 0, 0);

    var a = document.createElement("a");
    a.href = cvsSum.toDataURL();
    a.click();
}
