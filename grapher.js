const pccam = {
    pos: new Point(0,0,1),
    th: 0,
    ph: 0
};

function render(cam, u) {
    //console.time();

    // u is a unit vector in the direction of looking
    // v is a unit vector perpendicular to the camera direction and lies in the plane z=0
    let vd = Math.sqrt(u.x * u.x + u.y * u.y);
    let v = new Point(u.y / vd, -u.x / vd, 0);
    // w is perpendicular to u and v
    let w = new Point(u.x * u.z / vd, u.y * u.z / vd, -vd);

    //console.log(u, v, w);
    
    let ray = new Point(0, 0, 0);
    let imageData = new ImageData(256, 256);
    // loop over pixels / samples
    let i = 0;
    for (let t = -1; t < 1; t += 1/128) {
	for (let s = -1; s < 1; s += 1/128) {
	    ray.seteq(cam);
	    let tu = new Point(u.x, u.y, u.z);
	    tu.addscl(v, s);
	    tu.addscl(w, t);
	    let hit = cast_ray(ray, tu) * 255;
	    let color = hit ? ((ray.x * 256) & 255) ^ ((ray.y * 256) & 255) : 0;
	    imageData.data[i] = color; ++i;
	    imageData.data[i] = color; ++i;
	    imageData.data[i] = color + (hit ? 0 : 255); ++i;
	    imageData.data[i] = 255; ++i;
	}
    }
    document.getElementById("canvas").getContext("2d").putImageData(imageData, 0, 0);
    //console.timeEnd();
}



function testRender(h, p, sides) {
    let u = new Point(Math.cos(h) * Math.cos(p), Math.sin(h) * Math.cos(p), Math.sin(p));
    //let cam = new Point(-10 * u.x, -10 * u.y, 4);
    let cam = new Point(0, 0, 1);
    if (sides) {
	for (var i = 0; i < 6; ++i)
	    renderSide(pccam.pos, i);
	renderSidesToCanvas(u);
    } else {
	render(cam, u);
    }
}

function testRay(x, y, z, ux, uy, uz) {
    let ray = new Point(x, y, z);
    let u = new Point(ux, uy, uz);
    return [cast_ray(ray, u), ray.x, ray.y, ray.z];
}

function sidesDemo() {
    let cam = new Point(-2, 2, 1);
    for (var i = 0; i < 6; ++i)
	renderSide(cam, i);
    let h = 0;
    let j = 0;
    let p = 0;
    let q = 0;
    setInterval(function() {
	let u = new Point(Math.cos(h) * Math.cos(p), Math.sin(h) * Math.cos(p), Math.sin(p));
	renderSidesToCanvas(u);
	j += 0.01;
	h = Math.sin(j);
	q += 0.006;
	p = Math.sin(q);
    }, 1000/60);
}
//sidesDemo();

function displaySide(side) {
    side *= 512 * 512 * 3;
    var imageData = new ImageData(512, 512);
    for (var i = 0; i < 512 * 512; ++i) {
	imageData.data[4 * i] = sidesData[side + 3 * i];
	imageData.data[4 * i + 1] = sidesData[side + 3 * i + 1];
	imageData.data[4 * i + 2] = sidesData[side + 3 * i + 2];
	imageData.data[4 * i + 3] = 255;
    }
    var cn = document.createElement("canvas");
    cn.width = 512;
    cn.height = 512;
    cn.getContext("2d").putImageData(imageData, 0, 0);
    document.body.appendChild(cn);
}










document.getElementById("go-button").addEventListener("click", function() {
    var strfunc =  document.getElementById("f-input").value;
    var strfuncx = document.getElementById("fx-input").value;
    var strfuncy = document.getElementById("fy-input").value;
    f = funcstrToJs(strfunc);
    f_x = funcstrToJs(strfuncx);
    f_y = funcstrToJs(strfuncy);
    dotnablaf = (x, y) => (f_x(x,y)**2+f_y(x,y)**2);
    let cam = new Point(-2, 2, 1);
    sidesByteOffset = 0;
    for (var i = 0; i < 6; ++i)
	renderSide(cam, i);
}, false);












function bakeFromPlayer() {
    sidesByteOffset = 0;
    for (var i = 0; i < 6; ++i)
	renderSide(pccam.pos, i);
}

function renderFromPlayer() {
    let u = new Point(Math.cos(pccam.th) * Math.cos(pccam.ph),
		      Math.sin(pccam.th) * Math.cos(pccam.ph),
		      Math.sin(pccam.ph));
    renderSidesToCanvas(u);
}

var keys = {up: 0, down: 0, left: 0, right: 0, tele: 0};

function playerLoop() {
    var changed = keys.up | keys.down | keys.left | keys.right | keys.tele;
    if (keys.tele) {
	keys.tele = 0;
	var ray = new Point(0,0,0);
	ray.seteq(pccam.pos);
	const u = new Point(Math.cos(pccam.th) * Math.cos(pccam.ph),
			  Math.sin(pccam.th) * Math.cos(pccam.ph),
			  Math.sin(pccam.ph));
	const status = cast_ray(ray, u);
	if (status == 1) {
	    pccam.pos.seteq(ray);
	    // here, should offset smarter
	    pccam.pos.z += 1;
	    bakeFromPlayer();
	} else {
	    console.log(status, ray);
	}
	document.getElementById("pccam-status").innerHTML =
	    `${pccam.pos.x.toFixed(2)}, ${pccam.pos.y.toFixed(2)}, ${pccam.pos.z.toFixed(2)}`;
    }
    pccam.ph += (keys.up - keys.down) * 0.05;
    pccam.th += (keys.left - keys.right) * 0.05;
    if (changed)
	renderFromPlayer();
}

bakeFromPlayer();
renderFromPlayer();
setInterval(playerLoop, 1000/16);

function handleKey(key, b) {
    if (document.activeElement.tagName == "INPUT")
	return;
         if (key == "w") keys.up    = b;
    else if (key == "a") keys.left  = b;
    else if (key == "s") keys.down  = b;
    else if (key == "d") keys.right = b;
    else if (key == "f") keys.tele  = b;
    
}

addEventListener("keydown", function(e) {handleKey(e.key, 1)}, false);
addEventListener(  "keyup", function(e) {handleKey(e.key, 0)}, false);
