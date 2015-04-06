/*
 * implements the BusyBoxes reversible CA as outlined here:
 * http://arxiv.org/abs/1206.2060
 */

bbRule = {}

bbRule.STATES=2;

bbRule.rule = function(grid, x, y, z, frm) {
	var offx, offy, offz, swpx, swpy, swpz;
	var coi = grid.get(x, y, z);
	if ((x + y + z & 1) != (frm & 1)) return coi; 								// only process if field parity is correct

	function getSwap(x, y, z) {													// return valid swap offset or null if there is contention
		var swapx = null, swapy = null;
		for (var i=0; i<8; i++) {
			var xx = x+offx[i];
			var yy = y+offy[i];
			var zz = z+offz[i];
			if (grid.get(xx, yy, zz)) {
				if ((swapx != null) && (swapx != swpx[i] || swapy != swpy[i] || swapz != swpz[i]) ) { // swap confict, forgeddaboudit
					return null;
				}
				swapx = swpx[i];
				swapy = swpy[i];
				swapz = swpz[i];
			}
		}
		if (swapx == null) return null;
		return [swapx, swapy, swapz];
	}

	function onePlane() {														// process one of 3 planes dep on phase
		var swap = getSwap(x, y, z);											// proposed swap cell as delta from xyz
		if (swap != null) {														// if valid (no immediate conflicts)
			var swapper = grid.get(x+swap[0], y+swap[1], z+swap[2]);   			// get state at swap cell
			if (swapper != coi) {												// if state is different from ours, we might swap
				var revswap = getSwap(x+swap[0], y+swap[1], z+swap[2]);			// proposed swap for swap cell
				if (revswap != null) {
					if ( (swap[0] + revswap[0] == 0) && 
						 (swap[1] + revswap[1] == 0) &&							// if it matches (mutual proposed swaps), do this thing
						 (swap[2] + revswap[2] == 0)) {							// we return his state; he will return ours.
						return swapper;											// That's what we call a swap, Scooby Doo
					}
				}
			}
		}
		return coi;
	}
	
	var m = bbRule.trueMod(frame, 3);													// set up offsets & swap coords dep on phase
	if (m==0) {
		offx = bbRule.offsetx;
		offy = bbRule.offsety;
		offz = bbRule.offsetz;
		swpx = bbRule.swapx;
		swpy = bbRule.swapy;
		swpz = bbRule.swapz;
	}
	if (m==1) {
		offx = bbRule.offsetz;
		offy = bbRule.offsetx;
		offz = bbRule.offsety;
		swpx = bbRule.swapz;
		swpy = bbRule.swapx;
		swpz = bbRule.swapy;
	}
	if (m==2) {
		offx = bbRule.offsety;
		offy = bbRule.offsetz;
		offz = bbRule.offsetx;
		swpx = bbRule.swapy;
		swpy = bbRule.swapz;
		swpz = bbRule.swapx;
	}
	return onePlane();
}

// Knight's move offsets
bbRule.offsetx = [+2, +1, -1, -2, +2, +1, -1, -2];
bbRule.offsety = [+1, +2, +2, +1, -1, -2, -2, -1];
bbRule.offsetz = [0, 0, 0, 0, 0, 0, 0, 0];

// corresponding swap offsets
bbRule.swapx = [+1, -1, +1, -1, +1, -1, +1, -1];
bbRule.swapy = [-1, +1, +1, -1, +1, -1, -1, +1];
bbRule.swapz = [0, 0, 0, 0, 0, 0, 0, 0];

// Javascript ftw
bbRule.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

// and TDD also ftw
bbRule.TEST=0;
if(bbRule.TEST) {
	var grid = new Grid(10, 10, 10);
	grid.put(0, 0, 0, 1);
	grid.put(1, 2, 0, 1);
	// grid.put(-1, 2, 0, 1);
	console.log("bbRule returns:", bbRule(grid, 0, 0, 0));
	console.log("bbRule returns:", bbRule(grid, -1, 1, 0));
}

