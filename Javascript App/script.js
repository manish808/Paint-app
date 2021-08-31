var canvas = document.getElementById("front");
var canvas1 = document.getElementById("back");
var ctx = canvas.getContext("2d");
var ctx1 = canvas1.getContext("2d");

// Variables

var ctrlDown = false;
var drawInterval = null;
var color = "black";
var drawType = "Pencil";
var relativeX = null;
var relativeY = null;
var x_prev = null;
var y_prev = null;
var leftMouseClick = false;
var x = null, y = null, x1 = null, y1 = null;
var eraserSide = 10;
var lines = 0;

// Event listeners

document.addEventListener("mousemove", mouseMoveHandler);
document.addEventListener("mousedown", mouseDownHandler);
document.addEventListener("mouseup", mouseUpHandler);

// Functions

function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines = 0;
}

function mouseDownHandler(e) {
    if(e.button === 0) {
        leftMouseClick = true;
    }
}

function mouseUpHandler(e) {
    if(e.button === 0) {
        leftMouseClick = false;
    }
}

function mouseMoveHandler(e) {
    relativeX = e.clientX - canvas.offsetLeft;
    relativeY = e.clientY - canvas.offsetTop;
    if(relativeX >= 0 && relativeY >= 0) {
        if(x_prev > 0 && y_prev > 0) {
            draw();
        }
    }
}

function drawPencil() {
    if(leftMouseClick && x_prev != null) {
        ctx.beginPath();
        ctx.moveTo(x_prev, y_prev);
        ctx.lineTo(relativeX, relativeY);
        ctx.stroke();
    }
}

function drawSquare() {
    if(leftMouseClick) {
        if(x === null) {
            x = relativeX;
            y = relativeY;
        } else {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx1.beginPath();
            ctx1.strokeStyle = color;
            ctx1.rect(x, y, x_prev-x, y_prev-y);
            ctx1.stroke();
        }
    } else {
        if(x != null) {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.rect(x, y, x_prev-x, y_prev-y);
            ctx.stroke();
            x = null;
        }
    }
}

function drawLine() {
    if(leftMouseClick) {
        if(x === null) {
            x = relativeX;
            y = relativeY;
        } else {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx1.beginPath();
            ctx1.moveTo(x, y);
            ctx1.lineTo(relativeX, relativeY);
            ctx1.stroke();
        }
    } else {
        if(x != null) {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(relativeX, relativeY);
            ctx.stroke();
            x = null;
        }
    }
}

function drawEraser() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.beginPath();
    ctx1.strokeStyle = color;
    ctx1.rect(relativeX-eraserSide/2, relativeY-eraserSide/2, eraserSide, eraserSide);
    ctx1.stroke();
    if(leftMouseClick) {
        ctx.clearRect(relativeX-eraserSide/2, relativeY-eraserSide/2, eraserSide, eraserSide);
    }
}

function drawEllipse() {
    var radiusX;
    var radiusY;
    if(leftMouseClick) {
        if(x === null) {
            x = relativeX;
            y = relativeY;
        } else {
            if(x > relativeX) {
                radiusX = (x - relativeX)/2;
            } else {
                radiusX = (relativeX - x)/2;
            }
            if(y > relativeY) {
                radiusY = (y - relativeY)/2;
            } else {
                radiusY = (relativeY - y)/2;
            }
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx1.beginPath();
            ctx1.ellipse((x+relativeX)/2, (y+relativeY)/2, radiusX, radiusY, 0, 0, 2*Math.PI);
            ctx1.stroke();
        }
    } else {
        if(x != null) {
            if(x > relativeX) {
                radiusX = (x - relativeX)/2;
            } else {
                radiusX = (relativeX - x)/2;
            }
            if(y > relativeY) {
                radiusY = (y - relativeY)/2;
            } else {
                radiusY = (relativeY - y)/2;
            }
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx.beginPath();
            ctx.ellipse((x+relativeX)/2, (y+relativeY)/2, radiusX, radiusY, 0, 0, 2*Math.PI);
            ctx.stroke();
            x = null;
        }
    }
}

function drawPolygon() {
    if(leftMouseClick) {
        if(x === null) {
            x = relativeX;
            y = relativeY;
        } else {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx1.beginPath();
            if(lines === 0) ctx1.moveTo(x, y);
            else ctx1.moveTo(x1, y1);
            ctx1.lineTo(relativeX, relativeY);
            ctx1.stroke();
        }
    } else {
        if(x != null) {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            ctx.beginPath();
            if(lines === 0) ctx.moveTo(x, y);
            else ctx.moveTo(x1, y1);
            ctx.lineTo(relativeX, relativeY);
            ctx.stroke();
            lines++;
            x1 = relativeX;
            y1 = relativeY;
            x = null;
        }
    }
}

function draw() {
    if(drawType === "Eraser") {
        canvas.style.cursor = 'none';
    } else {
        canvas.style.cursor = '';
    }

    if(relativeY > 0 && relativeY < canvas.height && relativeX > 0 && relativeX < canvas.width) {
        if(drawType === "Pencil") {
            drawPencil();
        } else if(drawType === "Square") {
            canvas.style.cursor = 'crosshair';
            drawSquare();
        } else if(drawType === "Line") {
            drawLine();
        } else if(drawType === "Eraser") {
            drawEraser();
        } else if(drawType === "Ellipse") {
            canvas.style.cursor = 'crosshair';
            drawEllipse();
        } else if(drawType === "Polygon") {
            drawPolygon();
        }
    } else if(drawType === "Eraser") {
        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    }
    x_prev = relativeX;
    y_prev = relativeY;

    requestAnimationFrame(draw);
}

drawInterval = requestAnimationFrame(draw);