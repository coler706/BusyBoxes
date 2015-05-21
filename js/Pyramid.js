/**
 * @author mr.doob / http://mrdoob.com/
 */

var Pyramid = function (width, height, depth) {

	THREE.Geometry.call(this);

	var scope = this,
	width_half = width / 2,
	height_half = height / 2,
	depth_half = depth / 2;

	v(  0, height_half*Math.sin(60 * Math.PI / 180), -depth_half+depth_half*Math.cos(60 * Math.PI / 180) );
	v( width_half, -height_half,  -depth_half );
    v( -width_half, -height_half, -depth_half );
	v( 0,  -height_half, -depth_half+depth_half*Math.sin(60 * Math.PI / 180)*2 );

	f3( 0, 1, 2);
	f3( 0, 2, 3);
	f3( 0, 3, 1);
	f3( 2, 1, 3);

	function v(x, y, z) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
	}

	function f3(a, b, c) {

		scope.faces.push( new THREE.Face3( a, b, c) );
	}

	this.computeCentroids();
	this.computeNormals();

}

Pyramid.prototype = new THREE.Geometry();
Pyramid.prototype.constructor = Pyramid;

var Triangle = function (width, height, depth) {

    THREE.Geometry.call(this);

    var scope = this,
    width_half = width / 2,
    height_half = height / 2,
    depth_half = depth / 2;

    v(  width_half, -height_half, -depth_half );
    v( -width_half, -height_half, -depth_half );
    v( -width_half, -height_half,  depth_half );

    f3( 0, 1, 2 );

    function v(x, y, z) {

        scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
    }

    function f3(a, b, c) {

        scope.faces.push( new THREE.Face3( a, b, c ) );
    }

    this.computeCentroids();
    this.computeNormals();

}

Triangle.prototype = new THREE.Geometry();
Triangle.prototype.constructor = Triangle;
