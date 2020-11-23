var c1, c2, c3, c4;
var ctx1, ctx2, ctx3, ctx4;
var time1 = 1000, time2 = 1000, time3 = 1000, time4 = 1000;
var thickness = 30;

let start1, start2, start3, start4;
let t4 = false;
let t1cont = false, t2cont = false, t3cont = false, t4cont = false;

function drawShape(ctx, cw, ch) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ch);
    ctx.lineTo(cw, ch);
    ctx.lineTo(cw, ch - thickness);
    ctx.lineTo(thickness, ch - thickness);
    ctx.lineTo(thickness, 0);
    ctx.closePath();
    ctx.fill();
    ctx.font = thickness + "pt Arial";
    ctx.fillText("Nesimetriška", 1.1 * thickness, ch - thickness, cw - 1.1 * thickness);
}

function clear(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
}

function drawTFrame(ctx, w, h, translation, rotation, scale, t) {
    const transformMatrix = [
	// i
	(1 - t) + Math.cos(t * rotation) * scale.i * t,
	-Math.sin(t * rotation) * scale.j * t,
	// j
	Math.sin(t * rotation) * scale.i * t,
	(1 - t) + Math.cos(t * rotation) * scale.j * t,
	// origin
	t * translation.x,
	t * translation.y	
    ];
    clear(ctx, w, h);
    ctx.save();
    ctx.translate(t * translation.x, t * translation.y);
    ctx.rotate(t * rotation);
    ctx.scale((1 - t) + t * scale.i, (1 - t) + t * scale.j);
    drawShape(ctx, w, h);
    ctx.restore();
}

function drawT1Frame(timestamp) {
    if(start1 === undefined)
	start1 = timestamp;
    const elapsed = timestamp - start1;
    const t = Math.min(elapsed, time1) / time1;
    drawTFrame(ctx1, c1.width, c1.height,
	       { x: 0.5 * c1.width, y: 0 }, // translation
	       0, // rotation
	       { i: -0.5, j: 0.5 }, // scale
	       t);
    return t !== 1;
}

function drawT2Frame(timestamp) {
    if(start2 === undefined)
	start2 = timestamp;
    const elapsed = timestamp - start2;
    const t = Math.min(elapsed, time2) / time2;
    const translation = { x: c2.width, y: 0.25 * c2.height };
    const rotation = Math.PI;
    const scale = { i: 0.25, j: 0.25 };
    drawTFrame(ctx2, c2.width, c2.height,
	       translation,
	       rotation,
	       scale,
	       t);
    return t !== 1;
}

function drawT3Frame(timestamp) {
    if(start3 === undefined)
	start3 = timestamp;
    const elapsed = timestamp - start3;
    const t = Math.min(elapsed, time3) / time3;
    drawTFrame(ctx3, c3.width, c3.height,
	       { x: 0, y: 0.5 * c3.height }, // translation
	       0, // rotation
	       { i: 0.5, j: 0.5 }, // scale
	       t);
    return t !== 1;
}

function drawT4Frame(timestamp) {
    if(start4 === undefined)
	start4 = timestamp;
    const elapsed = timestamp - start4;
    const t = Math.min(elapsed, time4) / time4;
    const translation = { x: c4.width, y: c4.height };
    const rotation = 0.5 * Math.PI;
    const scale = { i: -0.5, j: 0.5 };
    drawTFrame(ctx4, c4.width, c4.height,
	       translation,
	       rotation, 
	       scale,
	       t);
    return t !== 1;
}

function step(timestamp) {
    if(start1 === undefined || t1cont)
	t1cont = drawT1Frame(timestamp);
    if(start2 === undefined || t2cont)
	t2cont = drawT2Frame(timestamp);
    if(start3 === undefined || t3cont)
	t3cont = drawT3Frame(timestamp);
    if(start4 === undefined || t4cont)
	t4cont = drawT4Frame(timestamp);

    window.requestAnimationFrame(step);
}

window.onload = () => {
    c1 = document.getElementById('c1');
    c2 = document.getElementById('c2');
    c3 = document.getElementById('c3');
    c4 = document.getElementById('c4');

    ctx1 = c1.getContext('2d');
    ctx1.fillStyle = 'blue';
    ctx2 = c2.getContext('2d');
    ctx2.fillStyle = 'magenta';
    ctx3 = c3.getContext('2d');
    ctx3.fillStyle = 'red';
    ctx4 = c4.getContext('2d');
    ctx4.fillStyle = 'green';

    // buttons
    const btn1 = document.getElementById('btn-t1');
    btn1.onclick = () => {
	start1 = undefined;
    };
    const btn2 = document.getElementById('btn-t2');
    btn2.onclick = () => {
	start2 = undefined;
    };
    const btn3 = document.getElementById('btn-t3')
    btn3.onclick = () => {
	start3 = undefined;
    };
    const btn4 = document.getElementById('btn-t4')
    btn4.onclick = () => {
	start4 = undefined;
    };

    // textboxes
    document.getElementById('txt-t1-duration').onchange = function() {
	time1 = +this.value;
	btn1.onclick();
    };
    document.getElementById('txt-t2-duration').onchange = function() {
	time2 = +this.value;
	btn2.onclick();
    };
    document.getElementById('txt-t3-duration').onchange = function() {
	time3 = +this.value;
	btn3.onclick();
    };
    document.getElementById('txt-t4-duration').onchange = function() {
	time4 = +this.value;
	btn4.onclick();
    };

    window.requestAnimationFrame(step);
}
