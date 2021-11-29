
var sidesByteOffset = 0;
var sidesLength = 512;
var sidesBytes = 512 * 512 * 6 * 3;
var sidesData = new Uint8Array(sidesBytes);
function sidesPush(n) {
    sidesData[sidesByteOffset] = n;
    ++sidesByteOffset;
}

// cycle between 0,0,-1   0,-1,0   -1,0,0   0,0,1   0,1,0  1,0,0
// to make sure that u, v, and w are perpendicular
function nextVector(vec) {
    return new Point(vec.y, vec.z, -vec.x);
}
var dirvecs = [new Point(0,0,-1)];
for (var i = 1; i < 6; ++i)
    dirvecs[i] = nextVector(dirvecs[i - 1]);

function renderSide(cam, dir) {
    //console.time();

    // u is a unit vector in the direction of looking
    // u, v, and w are perpendicular to each other
    const u = dirvecs[dir];
    const v = nextVector(u);
    const w = nextVector(v);
    let ray = new Point(0, 0, 0);
    // loop over pixels / samples
    let i = 0;
    for (let t = -1; t < 1; t += 2/sidesLength) {
	for (let s = -1; s < 1; s += 2/sidesLength) {
	    ray.seteq(cam);
	    let tu = new Point(u.x, u.y, u.z);
	    tu.addscl(v, s);
	    tu.addscl(w, t);
	    let hit = cast_ray(ray, tu);
	    let color = ((ray.x * 256) & 255) ^ ((ray.y * 256) & 255);
	    sidesPush([ 0  , color, 0  ,   0 ][hit]);
	    sidesPush([ 0  , color, 255,   0 ][hit]);
	    sidesPush([ 255, color, 0  ,   0 ][hit]);
	}
    }
    //console.timeEnd();
}

function getColorFromSide(u) {
    var side = 3 * (u.z > 0);
    var magval = u.z;
    if (Math.abs(u.y) > Math.abs(magval)) {
	magval = u.y;
	side = 3 * (u.y > 0) + 1;
    }
    if (Math.abs(u.x) > Math.abs(magval)) {
	magval = u.x;
	side = 3 * (u.x > 0) + 2;
    }
    
    if (side % 3 == 0) { // -z
	u.x = (u.x / u.z * 256 + 256) & 511;
	u.y = (u.y / u.z * 256 + 256) & 511;
	return (u.x * 512 + u.y + 512 * 512 * side) * 3;
    } else if (side % 3 == 1) { // -y
	u.x = (u.x / u.y * 256 + 256) & 511;
	u.z = (-u.z / u.y * 256 + 256) & 511;
	return (u.z * 512 + u.x + 512 * 512 * side) * 3;
    } else { // -x
	u.y = (-u.y / u.x * 256 + 256) & 511;
	u.z = (-u.z / u.x * 256 + 256) & 511;
	return (u.y * 512 + u.z + 512 * 512 * side) * 3;
    }
}

function renderSidesToCanvas(u) {
    //console.time();

    // u is a unit vector in the direction of looking
    // v is a unit vector perpendicular to the camera direction and lies in the plane z=0
    let vd = Math.sqrt(u.x * u.x + u.y * u.y);
    let v = new Point(u.y / vd, -u.x / vd, 0);
    // w is perpendicular to u and v
    let w = new Point(u.x * u.z / vd, u.y * u.z / vd, -vd);
    let ray = new Point(0, 0, 0);
    const cw = 512;
    const ch = 512;
    let imageData = new ImageData(cw, ch);
    // loop over pixels / samples
    let i = 0;
    let sum = 0;
    for (let t = -1; t < 1; t += 2/cw) {
	for (let s = -1; s < 1; s += 2/ch) {
	    let tu = new Point(u.x, u.y, u.z);
	    tu.addscl(v, s);
	    tu.addscl(w, t);
	    let ci = getColorFromSide(tu);
	    sum += Math.floor(ci / 512 / 512 / 3);
	    imageData.data[i] = sidesData[ci]; ++i; ++ci;
	    imageData.data[i] = sidesData[ci]; ++i; ++ci;
	    imageData.data[i] = sidesData[ci]; ++i; ++ci;
	    imageData.data[i] = 255; ++i;
	}
    }
    document.getElementById("canvas").getContext("2d").putImageData(imageData, 0, 0);
    //console.log(sum / 128 / 128);
    //console.timeEnd();
}
