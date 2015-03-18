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

rule3D3state = function(grid, x,y,z, frame){
	// if ((frame+x+y+z) % 2 === 0)
		// return;
	if ((x + y + z & 1) != (frame & 1)) return; 								// only process if field parity is correct

	convertToRealCoordinates = function(vectorInThePlane) {
		if (frame % 3 === 0) {
			return add(vector(vectorInThePlane.x, vectorInThePlane.y, 0), x,y,z);
		} else if (frame % 3 === 1) {
			return add(vector(0, vectorInThePlane.x, vectorInThePlane.y), x,y,z);
		} else if (frame % 3 === 2) {
			return add(vector(vectorInThePlane.y, 0, vectorInThePlane.x), x,y,z);
		} else {
			console.log("ERR: invalid frame: " + frame);
		}
	}

	getInRealCoordinates = function(vectorInThePlane) {
		return get(grid, convertToRealCoordinates(vectorInThePlane));
	}

	var rotatorFound = false;
	var rotatorLocation;
	var deltaFromMeToRotatorLocation;

	var possibleGuysToRotateMe = [
		vector(+1, 0),
		vector(-1, 0),
		vector(0, +1),
		vector(0, -1)
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
		vector(2, 0),
		vector(-2, 0),
		vector(0, 2),
		vector(0, -2),
		vector(1, 1),
		vector(-1, -1),
		vector(1, -1),
		vector(-1, 1)
	];

	for (var index in spacesThatNeedToBeEmpty) {
		var spaceThatNeedsToBeEmpty = spacesThatNeedToBeEmpty[index];

		if (getInRealCoordinates(addVectors(deltaFromMeToRotatorLocation, spaceThatNeedsToBeEmpty)) !== 0) {
			console.log(spaceThatNeedsToBeEmpty);
			console.log(convertToRealCoordinates(addVectors(possibleGuyToRotateMe, spaceThatNeedsToBeEmpty)));
			return;
		}
	}
	
	rotatorState = getInRealCoordinates(deltaFromMeToRotatorLocation); // The state of the guy who is doing the rotating here

	/* Note that the following two return statements could really be combined into one clever return statement.
	This would increase efficiency by removing the branching but it would also decrease readability */
	if (rotatorState === 1)
		return getInRealCoordinates(
			add(deltaFromMeToRotatorLocation,
			deltaFromMeToRotatorLocation.y,
			-deltaFromMeToRotatorLocation.x));
	if (rotatorState === -1)
		return getInRealCoordinates(
			add(deltaFromMeToRotatorLocation,
			-deltaFromMeToRotatorLocation.y,
			deltaFromMeToRotatorLocation.x));
};
