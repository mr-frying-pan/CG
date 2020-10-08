/**
   Transformacijų matricos:

   (cw – canvas plotis; ch – canvas aukštis)

   Viršutinis kairys kvadratas:
   -0.5  0    0.5*cw
   0     0.5  0
   0     0    1

   Viršutinis dešinys kvadratas:
   -0.25  0      cw
   0      -0.25  0.25*ch
   0      0      1

   Apatinis kairys kvadratas:
   0.5  0    0
   0    0.5  0.5*ch
   0    0    1

   Apatinis dešinys kvadratas:
   0     -0.5  cw
   -0.5  0     ch
   0     0     1
*/

var canvas, ctx;

var depth = 6;
var thickness = 100;

function drawActual(color = 'black') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineWidth = thickness;
    ctx.stroke();
}

function drawDeep(depth, color) {
    if(depth == 0) {
	drawActual(color);
	return;
    }

    // bottom left
    ctx.save();
    // translate(0, 0.5 * canvas.height);
    // scale(0.5, 0.5);
    ctx.transform(0.5, 0, 0, 0.5, 0, 0.5 * canvas.height);
    drawDeep(depth - 1, color || 'red');
    ctx.restore();

    // bottom right
    ctx.save();
    // translate(canvas.width, canvas.height);
    // rotate(0.5 * Math.PI);
    // scale(-0.5, 0.5);
    ctx.transform(0, -0.5, -0.5, 0, canvas.width, canvas.height);
    drawDeep(depth - 1, color || 'green');
    ctx.restore();

    //top left
    ctx.save();
    // translate(0.5 * canvas.width, 0);
    // scale(-0.5, 0.5);
    ctx.transform(-0.5, 0, 0, 0.5, 0.5 * canvas.width, 0);
    drawDeep(depth - 1, color || 'blue');
    ctx.restore();

    // top right
    ctx.save();
    // translate(canvas.width, 0.25 * canvas.height);
    // rotate(Math.PI);
    // scale(0.25, 0.25);
    ctx.transform(-0.25, 0, 0, -0.25, canvas.width, 0.25 * canvas.height);
    drawDeep(depth - 1, color || 'magenta');
    ctx.restore();
}

function changeCanvasSize(value) {
    canvas.width = canvas.height = value;
    document.getElementById('canvasSizeValue').textContent = value;
}

function changeDepth(value) {
    depth = value;
    document.getElementById('depthValue').textContent = value;
}

function changeThickness(value) {
    thickness = value;
    document.getElementById('thicknessValue').textContent = value;
}

function resetImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDeep(depth);
}

window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    const canvasSizeSlider = document.getElementById('canvasSize');
    canvasSizeSlider.oninput = function() {
	changeCanvasSize(this.value);
	resetImage();
    };
    canvas.width = canvas.height = canvasSizeSlider.value;

    const depthSlider = document.getElementById('depthSlider');
    depthSlider.onchange = function() {
	changeDepth(this.value);
	resetImage();
    };
    depth = depthSlider.value;

    const thicknessSlider = document.getElementById('thicknessSlider');
    thicknessSlider.oninput = function() {
	changeThickness(this.value);
	resetImage();
    };

    const resetBtn = document.getElementById('btn-reset');
    resetBtn.onclick = function() {
	console.log('reset');
	changeCanvasSize(canvasSizeSlider.value = 500);
	changeDepth(depthSlider.value = 6);
	changeThickness(thicknessSlider.value = 100);
	resetImage();
    };

    thickness = thicknessSlider.value;
    resetImage();
}
