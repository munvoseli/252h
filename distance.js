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

load_paraboloid();
//load_saddle();

/*// the gradient of f dot the gradient of f
function dotnablaf(x, y) {
    return (x * x + y * y);
}*/

function de_cone(x, y, z) {
    const val = Math.abs(z - f(x, y)) / Math.sqrt(1 + dotnablaf(x, y));
    return isNaN(val) ? -1 : val;
}





function funcstrToJs(str) {
    var terms = str.split(" ");
    var stack = [];
    for (var term of terms) {
	if (term == "x" || term == "y" || !isNaN(term))
	    stack.push(term);
	else if ("+-/*".indexOf(term) != -1) {
	    var b = stack.pop();
	    var a = stack.pop();
	    var ex = "(" + a + term + b + ")";
	    stack.push(ex);
	} else if (term == "^") {
	    var b = stack.pop();
	    var a = stack.pop();
	    stack.push(`Math.pow(${a},${b})`);
	} else if (term == "sin" || term == "cos" || term == "tan" ||
		   term == "asin" || term == "acos" || term == "atan" ||
		   term == "sinh" || term == "cosh" || term == "tanh" ||
		   term == "sqrt" || term == "cbrt" || term == "abs" ||
		   term == "exp")
	    stack.push(`Math.${term}(${stack.pop()})`);
	else if (term == "sec")
	    stack.push(`(1/Math.cos(${stack.pop()}))`);
	else if (term == "csc")
	    stack.push(`(1/Math.sin(${stack.pop()}))`);
	else if (term == "cot")
	    stack.push(`(1/Math.tan(${stack.pop()}))`);
	else if (term == "ln")
	    stack.push(`Math.log(${stack.pop()})`);
	else if (term == "e")
	    stack.push(`Math.E`);
	else if (term == "pi")
	    stack.push(`Math.PI`);
	else if (term == "2pi")
	    stack.push(`(2 * Math.PI)`);
    }
    //return stack[0];
    return new Function('x','y',"return " + stack[0]);
}
