class Point {
    constructor(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
    }
    addscl(p2, scl) {
	this.x += p2.x * scl;
	this.y += p2.y * scl;
	this.z += p2.z * scl;
    }
    seteq(p2) {
	this.x = p2.x;
	this.y = p2.y;
	this.z = p2.z;
    }
    distqto(p2) {
	return (this.x - p2.x) ** 2 + (this.y - p2.y) ** 2 + (this.z - p2.z) ** 2;
    }
}


// @return
// 0: miss by too many iterations
// 1: hit
// 2: miss by function undefined
// 3: miss by too far away
function cast_ray(ray, u) {
    let de;
    let i = 0;
    while (true) {
	de = de_cone(ray.x, ray.y, ray.z);
	if (isNaN(de)) return 2;
	// use combination of regular distance estimator and very bad estimator
	// to determine hit
	if (de < 0.01) return 1; // hit
	if (de > 300) return 3;
	if (i == 300) return 0;
	ray.addscl(u, de / 4);
	++i;
    }
}
