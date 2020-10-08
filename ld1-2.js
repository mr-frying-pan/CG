var c1, c2, c3, c4;
var ctx1, ctx2, ctx3, ctx4;
var time1 = 1000, time2 = 1000, time3 = 1000, time4 = 1000;
var thickness = 10;

let start1, start2, start3, start4;
let t4 = false;
let t1cont = false, t2cont = false, t3cont = false, t4cont = false;

function drawShape(ctx, cw, ch) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ch);
    ctx.lineTo(cw, ch);
    ctx.lineWidth = thickness;
    ctx.stroke();
}

function clear(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
}

function drawTFrame(ctx, w, h, e1, e2, o, t) {
    const transformMatrix = [
	// i
	(1 - t) * 1 + t * e1[0], (1 - t) * 0 + t * e1[1],
	// j
	(1 - t) * 0 + t * e2[0], (1 - t) * 1 + t * e2[1],
	// origin
	(1 - t) * 0 + t * o[0],
	(1 - t) * 0 + t * o[1]	
    ];
    clear(ctx, w, h);
    ctx.save();
    ctx.transform(...transformMatrix);
    drawShape(ctx, w, h);
    ctx.restore();
}

function drawT1Frame(timestamp) {
    if(start1 === undefined)
	start1 = timestamp;
    const elapsed = timestamp - start1;
    const t = Math.min(elapsed, time1) / time1;
    /**
       -0.5  0    0.5*cw
       0     0.5  0
       0     0    1
     */
    drawTFrame(ctx1, c1.width, c1.height,
	       [-0.5, 0], [0, 0.5], [0.5 * c1.width, 0],
	       t);
    return t !== 1;
}

function drawT2Frame(timestamp) {
    if(start2 === undefined)
	start2 = timestamp;
    const elapsed = timestamp - start2;
    const t = Math.min(elapsed, time2) / time2;
    /**
       -0.25  0      cw
       0      -0.25  0.25*ch
       0      0      1
    */
    drawTFrame(ctx2, c2.width, c2.height,
	       [-0.25, 0], [0, -0.25], [c2.width, 0.25 * c2.height],
	       t);
    return t !== 1;
}

function drawT3Frame(timestamp) {
    if(start3 === undefined)
	start3 = timestamp;
    const elapsed = timestamp - start3;
    const t = Math.min(elapsed, time3) / time3;
    /**
       0.5  0    0
       0    0.5  0.5*ch
       0    0    1
    */
    drawTFrame(ctx3, c3.width, c3.height,
	       [0.5, 0], [0, 0.5], [0, 0.5 * c3.height],
	       t);
    return t !== 1;
}

function drawT4Frame(timestamp) {
    if(start4 === undefined)
	start4 = timestamp;
    const elapsed = timestamp - start4;
    const t = Math.min(elapsed, time4) / time4;
    /**
       0     -0.5  cw
       -0.5  0     ch
       0     0     1
    */
    drawTFrame(ctx4, c4.width, c4.height,
	       [0, -0.5], [-0.5, 0], [c4.width, c4.height],
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
    ctx1.strokeStyle = 'blue';
    ctx2 = c2.getContext('2d');
    ctx2.strokeStyle = 'magenta';
    ctx3 = c3.getContext('2d');
    ctx3.strokeStyle = 'red';
    ctx4 = c4.getContext('2d');
    ctx4.strokeStyle = 'green';

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
