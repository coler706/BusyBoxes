/*
 * A new three state rule
 */
phyRule = {}

phyRule.STATES = 2;
phyRule.get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};
phyRule.isGood=function(grid, x,y,z){
	var nabes=0;
	for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
							if(grid.get(x+2*i,y+2*j, z+2*k)==1){
								nabes++;
								
								
							}
						}
					}
				}
			}
			
		
	return (nabes==1);
}
phyRule.isGood2=function(grid, x,y,z){
	var nabes=0;
	for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
							if(grid.get(x-1*i,y-1*j, z-1*k)==0){
								if(phyRule.isGood(grid,x-1*i,y-1*j, z-1*k)){
									nabes++;
								}
								//dirX,dirY,dirZ=x+i,y+j, z+k;
								
							
								
							}
						}
					}
				}
			
		}
		return(nabes==1);
}
phyRule.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

phyRule.rule = function(grid, x,y,z){
	//var neighbor = grid.get(x-1,y+1,z);
	var nabes = 0;
	if(grid.get(x,y,z)==1){
		for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
							if(grid.get(x-1*i,y-1*j, z-1*k)==0){
								if(phyRule.isGood(grid,x-1*i,y-1*j, z-1*k)){
									nabes++;
								}
								//dirX,dirY,dirZ=x+i,y+j, z+k;
								
							
								
							}
						}
					}
				}
			
		}
		if(nabes==1){ return 0};
	}else{
		var dirX;
		var dirY;
		var dirZ;

		
			for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1 && phyRule.isGood2(grid,x+i,y+j, z+k)){
							if(grid.get(x+2*i,y+2*j, z+2*k)==1 ){
								nabes++;
								dirX,dirY,dirZ=x+i,y+j, z+k;
								
							}
						}
					}
				}
			
		}
	if(nabes==1){ return 1};
	}	

}
