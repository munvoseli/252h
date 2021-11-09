//'use strict';

// https://gist.github.com/Starfys/aaaee80838d0e013c27d
const buffiq = new ArrayBuffer(4);
const f32fiq = new Float32Array(buffiq);
const u32fiq = new Uint32Array(buffiq);

function fiq(x) {
    f32fiq[0] = x;
    x *= 0.5;
    u32fiq[0] = (0x5f3759df - (u32fiq[0] >> 1));
    return f32fiq[0] * (1.5 - (x * f32fiq[0] * f32fiq[0]));
}

let f, f_x, f_y, dotnablaf;

function load_paraboloid() {
    f = (x, y) => ((x * x + y * y) / 2);
    f_x = (x, y) => x;
    f_y = (x, y) => y;
    dotnablaf = (x, y) => (x * x + y * y);
}

function load_saddle() {
    f = (x, y) => (x * y);
    f_x = (x, y) => y;
    f_y = (x, y) => x;
    dotnablaf = (x, y) => (x * x + y * y);
}

load_saddle();

/*// the gradient of f dot the gradient of f
function dotnablaf(x, y) {
    return (x * x + y * y);
}*/

function de_cone(x, y, z) {
    return Math.abs(z - f(x, y)) / Math.sqrt(1 + dotnablaf(x, y));
}
