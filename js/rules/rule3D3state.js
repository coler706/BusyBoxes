/*
 * A new three state rule
 */
rule3D3state = {}

rule3D3state.STATES = 3;

rule3D3state.vector = function(x, y, z){
	return {x:x, y:y, z:z};
};

rule3D3state.add = function(oldVector, x, y, z) {
	return rule3D3state.vector(oldVector.x + x, oldVector.y + y, oldVector.z + z);
};

rule3D3state.addVectors = function(vector1, vector2) {
	return rule3D3state.vector(vector1.x + vector2.x, vector1.y + vector2.y, vector1.z + vector2.z);
};

rule3D3state.get = function(grid, getLocation) {
	return grid.get(getLocation.x, getLocation.y, getLocation.z);
};

rule3D3state.trueMod = function(v, base) {
    if (v < 0) {
        return ((v % base) + base) % base;
    }
    return v % base;
}

rule3D3state.rule = function(grid, x,y,z, frame, direction){
	// if ((frame+x+y+z) % 2 === 0)
		// return;
	if ((x + y + z & 1) != (frame & 1)) return; 								// only process if field parity is correct

	convertToRealCoordinates = function(vectorInThePlane) {
		var phase3 = rule3D3state.trueMod(frame, 3);
		if (phase3 === 0) {
			return rule3D3state.add(rule3D3state.vector(vectorInThePlane.x, vectorInThePlane.y, 0), x,y,z);
		} else if (phase3 === 1) {
			return rule3D3state.add(rule3D3state.vector(0, vectorInThePlane.x, vectorInThePlane.y), x,y,z);
		} else if (phase3 === 2) {
			return rule3D3state.add(rule3D3state.vector(vectorInThePlane.y, 0, vectorInThePlane.x), x,y,z);
		} else {
			console.log("ERR: invalid frame: " + frame);
		}
	}

	getInRealCoordinates = function(vectorInThePlane) {
		return rule3D3state.get(grid, convertToRealCoordinates(vectorInThePlane));
	}

	var rotatorFound = false;
	var rotatorLocation;
	var deltaFromMeToRotatorLocation;

	var possibleGuysToRotateMe = [
		rule3D3state.vector(+1, 0),
		rule3D3state.vector(-1, 0),
		rule3D3state.vector(0, +1),
		rule3D3state.vector(0, -1)
	];

	for (index in possibleGuysToRotateMe) {
		var possibleGuyToRotateMe = possibleGuysToRotateMe[index];

		if (getInRealCoordinates(possibleGuyToRotateMe) !== 0) {
			if (rotatorFound) {
				return;
			}

			deltaFromMeToRotatorLocation = possibleGuyToRotateMe;
			rotatorFound = true;
		}
	}

	if (!rotatorFound) {
		return;
	}
	
	var spacesThatNeedToBeEmpty = [
		rule3D3state.vector(2, 0),
		rule3D3state.vector(-2, 0),
		rule3D3state.vector(0, 2),
		rule3D3state.vector(0, -2),
		rule3D3state.vector(1, 1),
		rule3D3state.vector(-1, -1),
		rule3D3state.vector(1, -1),
		rule3D3state.vector(-1, 1)
	];

	for (var index in spacesThatNeedToBeEmpty) {
		var spaceThatNeedsToBeEmpty = spacesThatNeedToBeEmpty[index];

		if (getInRealCoordinates(rule3D3state.addVectors(deltaFromMeToRotatorLocation, spaceThatNeedsToBeEmpty)) !== 0) {
			console.log(spaceThatNeedsToBeEmpty);
			console.log(convertToRealCoordinates(rule3D3state.addVectors(possibleGuyToRotateMe, spaceThatNeedsToBeEmpty)));
			return;
		}
	}
	
	rotatorState = getInRealCoordinates(deltaFromMeToRotatorLocation); // The state of the guy who is doing the rotating here

	/* Note that the following two return statements could really be combined into one clever return statement.
	This would increase efficiency by removing the branching but it would also decrease readability */
	if (rotatorState === direction)
		return getInRealCoordinates(
			rule3D3state.add(deltaFromMeToRotatorLocation,
			deltaFromMeToRotatorLocation.y,
			-deltaFromMeToRotatorLocation.x));
	if (rotatorState === -direction)
		return getInRealCoordinates(
			rule3D3state.add(deltaFromMeToRotatorLocation,
			-deltaFromMeToRotatorLocation.y,
			deltaFromMeToRotatorLocation.x));
};
