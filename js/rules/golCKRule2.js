/*
 * A new three state rule
 */
golCKRule2 = {}

golCKRule2.STATES = 6;
golCKRule2.get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

golCKRule2.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

golCKRule2.rule = function(grid, x,y,z){
	//var neighbor = grid.get(x-1,y+1,z);
	var nabes = 0;
	if(grid.get(x,y,z)==1){
		/*for(var i = -1; i<= 1; i++){
			for(var j = -1; j<= 1; j++){
				for(var k = -1; k<= 1; k++){
					if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===-1){
						if(grid.get(x-i,y-j, z-k)===-4){
							return -1;
						}
					}
				}
			}
		}*/
		var voxel = new THREE.Mesh(cubette, new THREE.MeshColorFillMaterial(0xf5f5f5));
                            setObjPosition(voxel, [x,y,z]);
                            voxel.overdraw = true;
                            scene.addObject(voxel);
                            trail.push(voxel);
                            if (trail.length > 100) {
                                scene.removeObject(trail[0]);
                                trail = trail.splice(1);
                            }
		return -1;
	}
	else if(grid.get(x,y,z)===-1){
		for(var i = -1; i<= 1; i++){
			for(var j = -1; j<= 1; j++){
				for(var k = -1; k<= 1; k++){
					if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
						if(grid.get(x+2*i,y+2*j, z+2*k)===-4){
							return 1;
						}
					}
				}
			}
		}
		return 0;
	}
	else if(grid.get(x,y,z)===-2){
		return -2;
	}else if(grid.get(x,y,z)===-3){
		for(var i = -1; i<= 1; i++){
			for(var j = -1; j<= 1; j++){
				for(var k = -1; k<= 1; k++){
					if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
						playclip();
						return -3;
					}
				}
			}
		}
		return -3;
	}else if(grid.get(x,y,z)===-4){
		return -4;
	}else{
		if(grid.get(x,y,z)>-2){
			for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
							if((grid.get(x+2*i,y+2*j, z+2*k)<0)&& grid.get(x+2*i,y+2*j, z+2*k)>-3){
								return 1;
							}
						}
					}
				}
			}
		}
		/*if(grid.get(x,y,z)>-2){
			for(var i = -1; i<= 1; i++){
				for(var j = -1; j<= 1; j++){
					for(var k = -1; k<= 1; k++){
						if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===-2){
							console.log(grid.get(x+2*i,y+2*j, z+2*k));
							if(grid.get(x+2*i,y+2*j, z+2*k)===-3){
								return 1;
							}
						}
					}
				}
			}
		}*/
	}	
}
