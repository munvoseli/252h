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

function cast_ray(ray, u) {
    let de;
    let i = 0;
    while (true) {
	de = de_cone(ray.x, ray.y, ray.z);
	if (de < 0.01 || i == 100 || de > 100)
	    return de < 0.01; // if hit, return true
	ray.addscl(u, de / 2);
	++i;
    }
}
