/*
 * A new three state rule
 */
vector = function(x, y, z){
	return {x:x, y:y, z:z};
};

add = function(oldVector, x, y, z) {
	return vector(oldVector.x + x, oldVector.y + y, oldVector.z + z);
};

addVectors = function(vector1, vector2) {
	return vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
};

get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

XOR = function(a,b) {
  return ( a || b ) && !( a && b );
};

rule2D3state = function(grid, x,y,z, frame, direction){
	// if ((frame+x+y+z) % 2 === 0)
		// return;
	if ((x + y + z & 1) != (frame & 1)) return; 								// only process if field parity is correct

	var rotatorFound = false;
	var rotatorLocation;
	var deltaFromMeToRotatorLocation;

	var possibleGuysToRotateMe = [
		vector(+1, 0, 0),
		vector(-1, 0, 0),
		vector(0, 0, +1),
		vector(0, 0, -1)
	];

	for (index in possibleGuysToRotateMe) {
		var possibleGuyToRotateMe = possibleGuysToRotateMe[index];

		if (get(grid, add(possibleGuyToRotateMe, x,y,z)) !== 0) {
			if (rotatorFound) {
				return;
			}

			rotatorLocation = add(possibleGuyToRotateMe, x,y,z);
			deltaFromMeToRotatorLocation = possibleGuyToRotateMe;
			rotatorFound = true;
		}
	}

	if (!rotatorFound) {
		return;
	}
	
	var spacesThatNeedToBeEmpty = [
		add(rotatorLocation, 2, 0, 0),
		add(rotatorLocation, -2, 0, 0),
		add(rotatorLocation, 0, 0, 2),
		add(rotatorLocation, 0, 0, -2),
		add(rotatorLocation, 1, 0, 1),
		add(rotatorLocation, -1, 0, -1),
		add(rotatorLocation, 1, 0, -1),
		add(rotatorLocation, -1, 0, 1)
	];

	for (var index in spacesThatNeedToBeEmpty) {
		var spaceThatNeedsToBeEmpty = spacesThatNeedToBeEmpty[index]
		if (get(grid, spaceThatNeedsToBeEmpty) !== 0) {
			return;
		}
	}
	
	rotatorState = get(grid, rotatorLocation);
	if (rotatorState === direction)
		return get(grid,
			add(vector(
				deltaFromMeToRotatorLocation.z,
				0,
				-deltaFromMeToRotatorLocation.x),
				rotatorLocation.x,rotatorLocation.y,rotatorLocation.z));
	if (rotatorState === -direction)
		return get(grid,
			add(vector(
				-deltaFromMeToRotatorLocation.z,
				0,
				deltaFromMeToRotatorLocation.x),
				rotatorLocation.x,rotatorLocation.y,rotatorLocation.z));
};
