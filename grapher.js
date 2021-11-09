

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
	    let color = hit ? ((ray.x * 100) & 255) ^ ((ray.y * 100) & 255) : 0;
	    imageData.data[i] = color; ++i;
	    imageData.data[i] = color; ++i;
	    imageData.data[i] = color + (hit ? 0 : 255); ++i;
	    imageData.data[i] = 255; ++i;
	}
    }
    document.getElementById("canvas").getContext("2d").putImageData(imageData, 0, 0);
    //console.timeEnd();
}

function renderInterval() {
    let h = 0;
    setInterval(function() {
	let u = new Point(Math.cos(h), Math.sin(h), 0);
	let cam = new Point(-10 * u.x, -10 * u.y, 8);
	render(cam, u);
	h += 0.01;
    }, 100);
}
renderInterval();

function testRay(x, y, z, ux, uy, uz) {
    let ray = new Point(x, y, z);
    let u = new Point(ux, uy, uz);
    return [cast_ray(ray, u), ray.x, ray.y, ray.z];
}
