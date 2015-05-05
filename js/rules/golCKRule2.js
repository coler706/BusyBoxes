/*
 * A new three state rule
 */
golCKRule2 = {}

golCKRule2.STATES = 7;
golCKRule2.get = function(grid, getLocation) {
    return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

golCKRule2.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i][0] === obj[0] && list[i][1] === obj[1] && list[i][2] === obj[2]) {
            return true;
        }
    }

    return false;
}
golCKRule2.rule = function(grid, x, y, z) {
    //var neighbor = grid.get(x-1,y+1,z);
    var nabes = 0;
    if (grid.get(x, y, z) == 1) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                for (var k = -1; k <= 1; k++) {
                    if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === -1) {
                        var voxel = new THREE.Mesh(cubette, new THREE.MeshColorFillMaterial(0xf5f5f5));
                        setObjPosition(voxel, [x + i / 2, y + j / 2, z + k / 2]);
                        voxel.overdraw = true;
                        if(CELL_TRAIL){
	                        if (containsObject([x + i / 2, y + j / 2, z + k / 2], trailPos) != true) {
	                            scene.addObject(voxel);
	                            cell_trail_a.push(voxel);
	                            trailPos.push([x + i / 2, y + j / 2, z + k / 2]);
	                            console.log(trailPos.length + "");
	                            if (cell_trail_a.length > CELL_TRAIL) {
	                                scene.removeObject(cell_trail_a[0]);
	                                cell_trail_a = cell_trail_a.splice(1);
	                                trailPos = trailPos.splice(1);
	                            }
	                        }
                        }
                    }
                }
            }
        }
        var voxel = new THREE.Mesh(cubette, new THREE.MeshColorFillMaterial(0xf5f5f5));
        setObjPosition(voxel, [x, y, z]);
        voxel.overdraw = true;
        if(CELL_TRAIL){
	        if (containsObject([x, y, z], trailPos) != true) {
	            scene.addObject(voxel);
	            cell_trail_a.push(voxel);
	            trailPos.push([x, y, z]);
	            console.log(trailPos.length + "");
	            if (cell_trail_a.length > CELL_TRAIL) {
	                scene.removeObject(cell_trail_a[0]);
	                cell_trail_a = cell_trail_a.splice(1);
	                trailPos = trailPos.splice(1);
	            }
	        }
        }
        return -1;
    } else if (grid.get(x, y, z) === -1) {
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                for (var k = -1; k <= 1; k++) {
                    if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === 1) {
                        if (grid.get(x + 2 * i, y + 2 * j, z + 2 * k) === -4) {
                            return 1;
                        }
                    }
                }
            }
        }
        /*
		for(var i = -1; i<= 1; i++){
			for(var j = -1; j<= 1; j++){
				for(var k = -1; k<= 1; k++){
					if((i!=0 || j!=0 || k!=0)&((Math.abs(i)+Math.abs(j)+Math.abs(k))==1) && grid.get(x+i,y+j, z+k)===1){
						if((grid.get(x+i*2,y+j*2, z+k*2)===-1||grid.get(x+i*2,y+j*2, z+k*2)===-2)&&(grid.get(x-i,y-j, z-k)===1||grid.get(x-i,y-j, z-k)===-2||grid.get(x-i,y-j, z-k)===-4)){
							return 1;
						}
					}
				}
			}
		}*/
        return 0;
    } else if (grid.get(x, y, z) === -2) {
        var retu = -2;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                for (var k = -1; k <= 1; k++) {
                    if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === -5) {
                        if (grid.get(x + 2 * i, y + 2 * j, z + 2 * k) == 1) {
                            retu = 0;
                        }
                    }
                }
            }
        }
        return retu;
    } else if (grid.get(x, y, z) === -3) {
        changeCell([x, y, z], 0x551A8B, -3);
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                for (var k = -1; k <= 1; k++) {
                    if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === 1) {
                        playclip();
                        changeCell([x, y, z], 0xFF00FF, -3);
                        return -3;
                    }
                    if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === -1) {
                        changeCell([x, y, z], 0xFF00FF, -3);
                    }
                }
            }
        }
        return -3;
    } else if (grid.get(x, y, z) === -4) {
        return -4;
    } else if (grid.get(x, y, z) === -5) {
        return -5;
    } else {
        if (grid.get(x, y, z) > -2) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    for (var k = -1; k <= 1; k++) {
                        if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === 1) {
                            if ((grid.get(x + 2 * i, y + 2 * j, z + 2 * k) < 0) && grid.get(x + 2 * i, y + 2 * j, z + 2 * k) > -3) {
                                return 1;
                            }
                        }
                    }
                }
            }
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    for (var k = -1; k <= 1; k++) {
                        if ((i != 0 || j != 0 || k != 0) & ((Math.abs(i) + Math.abs(j) + Math.abs(k)) == 1) && grid.get(x + i, y + j, z + k) === -5) {
                            if (grid.get(x + 2 * i, y + 2 * j, z + 2 * k) == 1) {
                                return -2;
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
