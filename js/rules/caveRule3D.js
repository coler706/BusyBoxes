/*
 * the classic. 3 neighbors births a cell; 2 or 3 neighbors to survive
 */
caveRule3D = {
	rule : function(grid, x, y, z) {
		var nabes = 0;
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				for (var k = -1; k <= 1; k++) {
						if ( grid.get(x + i, y+k, z + j)) {
							nabes++;
						}
					}
			}
		}
		if(grid.get(i, y, z)){
				if (nabes >10){
					return 1;
				}else{
					return 0
				}
		}else{
			if (nabes >9){
				return 1;
			}else{
				return 0
			}
		}
		
	},
	Color: 0x565655,
	boxSize: 0.74
}
