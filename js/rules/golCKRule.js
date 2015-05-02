/*
 * A new three state rule
 */
golCKRule = {}

golCKRule.STATES = 4;
golCKRule.get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

golCKRule.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

golCKRule.rule = function(grid, x,y,z){
	//var neighbor = grid.get(x-1,y+1,z);
	var nabes = 0;
	if(grid.get(x,y,z)==1){
		return -1;
	}
	else if(grid.get(x,y,z)===-1){
		return 0;		
	}
	else if(grid.get(x,y,z)===-2){
		return -2;
	}else{
	if(grid.get(x,y,z)!=-2){
		for(var i = -1; i<= 1; i++){
			for(var j = -1; j<= 1; j++){
				for(var k = -1; k<= 1; k++){
					if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
						if(grid.get(x+2*i,y+2*j, z+2*k)<0){
							return 1;
						}
					}
				}
			}
		}
	}
	}	
}
