/// I like 1,3,5 so it's default
GOL3D_VALS = [1, 3, 5];

gol3DRule = {}

gol3DRule.STATES = 2;

gol3DRule.Color = 0x999991;
gol3DRule.boxSize = 0.74;

gol3DRule.rule = function(grid, x,y,z){
	//var neighbor = grid.get(x-1,y+1,z);
	var nabes = 0;

	for(var i = -1; i<= 1; i++){
		for(var j = -1; j<= 1; j++){
			for(var k = -1; k<= 1; k++){
				if((i!=0 || j!=0 || k!=0) && grid.get(x+i,y+j, z+k)){
					nabes++;
				}
			}
		}
	}
	if(nabes == 0){
		return 0;		
	}
	// console.log("NABES and xyz: ", nabes, [x,y,z]);
	if(grid.get(x,y,z)){
		if(nabes<GOL3D_VALS[0] || nabes > GOL3D_VALS[1]){
			return 0;
		}else{
			return 1;
		}
	}else{
		if(nabes === GOL3D_VALS[2]){
			return 1;
		}else{
			return 0;
		}
	}
}

/// others to try
gol3DRule235 = {}
gol3DRule235.rule = function(grid, x, y, z) {
	GOL3D_VALS[0] = 2;
	GOL3D_VALS[1] = 3;
	GOL3D_VALS[2] = 5;
	return gol3DRule.rule(grid, x, y, z);
}

gol3DRule455 = {}
gol3DRule455.rule = function(grid, x, y, z) {
	GOL3D_VALS[0] = 4;
	GOL3D_VALS[1] = 5;
	GOL3D_VALS[2] = 5;
	return gol3DRule.rule(grid, x, y, z);
}
