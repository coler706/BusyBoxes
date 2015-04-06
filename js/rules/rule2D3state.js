/*
 * A new three state rule
 */

rule2D3state = {}

rule2D3state.STATES = 3;

rule2D3state.vector = function(x, y, z){
	return {x:x, y:y, z:z};
};

rule2D3state.add = function(oldVector, x, y, z) {
	return rule2D3state.vector(oldVector.x + x, oldVector.y + y, oldVector.z + z);
};

rule2D3state.get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

rule2D3state.rule = function(grid, x,y,z, frame, direction){
	// if ((frame+x+y+z) % 2 === 0)
		// return;
	if ((x + y + z & 1) != (frame & 1)) return; 								// only process if field parity is correct

	var rotatorFound = false;
	var rotatorLocation;
	var deltaFromMeToRotatorLocation;

	var possibleGuysToRotateMe = [
		rule2D3state.vector(+1, 0, 0),
		rule2D3state.vector(-1, 0, 0),
		rule2D3state.vector(0, 0, +1),
		rule2D3state.vector(0, 0, -1)
	];

	for (index in possibleGuysToRotateMe) {
		var possibleGuyToRotateMe = possibleGuysToRotateMe[index];

		if (rule2D3state.get(grid, rule2D3state.add(possibleGuyToRotateMe, x,y,z)) !== 0) {
			if (rotatorFound) {
				return;
			}

			rotatorLocation = rule2D3state.add(possibleGuyToRotateMe, x,y,z);
			deltaFromMeToRotatorLocation = possibleGuyToRotateMe;
			rotatorFound = true;
		}
	}

	if (!rotatorFound) {
		return;
	}
	
	var spacesThatNeedToBeEmpty = [
		rule2D3state.add(rotatorLocation, 2, 0, 0),
		rule2D3state.add(rotatorLocation, -2, 0, 0),
		rule2D3state.add(rotatorLocation, 0, 0, 2),
		rule2D3state.add(rotatorLocation, 0, 0, -2),
		rule2D3state.add(rotatorLocation, 1, 0, 1),
		rule2D3state.add(rotatorLocation, -1, 0, -1),
		rule2D3state.add(rotatorLocation, 1, 0, -1),
		rule2D3state.add(rotatorLocation, -1, 0, 1)
	];

	for (var index in spacesThatNeedToBeEmpty) {
		var spaceThatNeedsToBeEmpty = spacesThatNeedToBeEmpty[index]
		if (rule2D3state.get(grid, spaceThatNeedsToBeEmpty) !== 0) {
			return;
		}
	}
	
	rotatorState = rule2D3state.get(grid, rotatorLocation);
	if (rotatorState === direction)
		return rule2D3state.get(grid,
			rule2D3state.add(rule2D3state.vector(
				deltaFromMeToRotatorLocation.z,
				0,
				-deltaFromMeToRotatorLocation.x),
				rotatorLocation.x,rotatorLocation.y,rotatorLocation.z));
	if (rotatorState === -direction)
		return rule2D3state.get(grid,
			rule2D3state.add(rule2D3state.vector(
				-deltaFromMeToRotatorLocation.z,
				0,
				deltaFromMeToRotatorLocation.x),
				rotatorLocation.x,rotatorLocation.y,rotatorLocation.z));
};
