/*
 * implements the BusyBoxes reversible CA as outlined here:
 * http://arxiv.org/abs/1206.2060
 */

rule2D3state2 = {}

rule2D3state2.STATES=3;

rule2D3state2.rule = function(grid, x, y, z, frm) {
	var offx, offy, offz, swpx, swpy, swpz;
	var coi = grid.get(x, y, z);
	if ((x + y + z & 1) != (frm & 1)) return coi; 								// only process if field parity is correct

	function getSwap(x, y, z) {													// return valid swap offset or null if there is contention
		var swapx = null, swapy = null;
		for (var i=0; i<8; i++) {
			var xx = x+offx[i];
			var yy = y;
			var zz = z+offz[i];
			if (grid.get(xx, yy, zz)) {
				if ((swapx != null) && (swapx != swpx[i] || swapz != swpz[i]) ) { // swap confict, forgeddaboudit
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
			var swapper = grid.get(x+swap[0], y, z+swap[2]);   			// get state at swap cell
			if (swapper != coi) {												// if state is different from ours, we might swap
				var revswap = getSwap(x+swap[0], y, z+swap[2]);			// proposed swap for swap cell
				if (revswap != null) {
					if ( (swap[0] + revswap[0] == 0) &&							// if it matches (mutual proposed swaps), do this thing
						 (swap[2] + revswap[2] == 0)) {							// we return his state; he will return ours.
						return swapper;											// That's what we call a swap, Scooby Doo
					}
				}
			}
		}
		return coi;
	}
	
	var m = rule2D3state2.trueMod(frame, 3);													// set up offsets & swap coords dep on phase
	if (m==0) {
		offx = rule2D3state2.offsetx;
		offy = rule2D3state2.offsety;
		offz = rule2D3state2.offsetz;
		swpx = rule2D3state2.swapx;
		swpy = rule2D3state2.swapy;
		swpz = rule2D3state2.swapz;
	}
	if (m==1) {
		offx = rule2D3state2.offsetz;
		offy = rule2D3state2.offsetx;
		offz = rule2D3state2.offsety;
		swpx = rule2D3state2.swapz;
		swpy = rule2D3state2.swapx;
		swpz = rule2D3state2.swapy;
	}
	if (m==2) {
		offx = rule2D3state2.offsety;
		offy = rule2D3state2.offsetz;
		offz = rule2D3state2.offsetx;
		swpx = rule2D3state2.swapy;
		swpy = rule2D3state2.swapz;
		swpz = rule2D3state2.swapx;
	}
	return onePlane();
}

// Knight's move offsets
rule2D3state2.offsetx = [+2, +1, -1, -2, +2, +1, -1, -2];
rule2D3state2.offsety = [+1, +2, +2, +1, -1, -2, -2, -1];
rule2D3state2.offsetz = [0, 0, 0, 0, 0, 0, 0, 0];

// corresponding swap offsets
rule2D3state2.swapx = [+1, -1, +1, -1, +1, -1, +1, -1];
rule2D3state2.swapy = [-1, +1, +1, -1, +1, -1, -1, +1];
rule2D3state2.swapz = [0, 0, 0, 0, 0, 0, 0, 0];

// Javascript ftw
rule2D3state2.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

// and TDD also ftw
rule2D3state2.TEST=0;
if(rule2D3state2.TEST) {
	var grid = new Grid(10, 10, 10);
	grid.put(0, 0, 0, 1);
	grid.put(1, 2, 0, 1);
	// grid.put(-1, 2, 0, 1);
	console.log("rule2D3state2 returns:", rule2D3state2(grid, 0, 0, 0));
	console.log("rule2D3state2 returns:", rule2D3state2(grid, -1, 1, 0));
}

