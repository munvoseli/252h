// why are these lucas 2**n ?

function getnum(n) {
  var c = 0;
  for (var m = 0; m < 1<<n; ++m) {
    var s = !( (m & 1) | (m>>(n-1)) );
    for (var i = 0; i < n - 1; ++i) {
      s += !(m & (3 << i));
    }
    c += 1<<s;
  }
  return c;
}

for (var n = 0; n < 7; ++n)
  console.log(n, getnum(n));


// also the amount of spokes is equal to the amount of discs
// i have proved it
