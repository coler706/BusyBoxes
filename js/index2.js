
            //<![CDATA[
            var DEBUG = false;
            var CELL_TRAIL = false;
            var AVG_TRAIL = false;
            var trail = [];
            var trails = [];
            var offs1 = [+2, +1, -1, -2, +2, +1, -1, -2];
            var offs2 = [+1, +2, +2, +1, -1, -2, -2, -1];
            var move1 = [+1, -1, +1, -1, +1, -1, +1, -1];
            var move2 = [-1, +1, +1, -1, +1, -1, -1, +1];
            var cursor = [0, 0, 0];
            var gLastCursor = cursor;
            var grid = {};
            var isRunning = false;
            var direction = "forward";
            var lasthash = "";
            var gUpdateHash = "";
            var gInitialHash = "";
            var gInitialFrame;
            var encodeString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";
            var frame = 0;
            var cellCount = 0;
            var mode = "mirror";
            var axisMin = -12;
            var axisMax = 11;
            var processSpeed = "fast";
            var lastSelectedEl;
            var gLastRefreshedUrl;
            var scrollBarX = false;
            var moveFifo = [];
            for (var i=0; i<60; i++) moveFifo.push(0);
            var qargs = {};
            var container, interval,
            camera, scene, renderer,
            projector, plane, cube, linesMaterial,
            color = 0,colors = [ 0xDF1F1F, 0xDFAF1F, 0x80DF1F, 0x1FDF50, 0x1FDFDF, 0x1F4FDF, 0x7F1FDF, 0xDF1FAF, 0xEFEFEF, 0x303030 ],
            ray, brush, objectHovered,
            isMouseDown = false, onMouseDownPosition,
            radious = 2000, theta = 0, onMouseDownTheta = 45, phi = 60, onMouseDownPhi = 60;
            randWidth = 4, randCount = 12, randRatio = 0.5;

            init();
            render();

            function parseQueryArgs() {
                var queryArgs = {};
                var searchString = document.URL;
                var i = searchString.indexOf("?");
                if (i < 0) return queryArgs;
                searchString = searchString.substr(i + 1);
                i = searchString.indexOf("/");
                if (i < 0) {
                    i = searchString.indexOf("#");
                }
                if (i < 0) {
                    i = searchString.length;
                }
                searchString = searchString.substr(0, i);
                var queryArgList = searchString.split("&");
                for (var i = 0; i < queryArgList.length; i++) {
                    var query = queryArgList[i];
                    var keyval = query.split("=");
                    var key = keyval[0];
                    if (keyval.length <= 1) keyval.push(true);
                    queryArgs[key] = keyval[1];
                }
                return queryArgs;
            }

            function init() {
                if (DEBUG) console.log("init start")
                qargs = parseQueryArgs();
                if (qargs.dir) {
                    direction = qargs.dir;
                }
                if (qargs.size) {
                    var size = parseInt(qargs.size);
                    axisMax = parseInt(size / 2) - 1;
                    axisMin = axisMax - (size - 1);
                    radious *= size/24.0;
                }
                if (qargs.trail) {
                    AVG_TRAIL = parseInt(qargs.trail);
                }
                if (qargs.trails) {
                    CELL_TRAIL = parseInt(qargs.trails);
                }
                if (qargs.mode) {
                    mode = qargs.mode;
                }
                if (DEBUG) console.log("DEBUG query args:", qargs, "axisMax:", axisMax, "axisMin:", axisMin)
                container = document.createElement( 'div' );
                document.body.appendChild( container );

                var info = document.createElement( 'div' );
                info.style.position = 'absolute';
                info.style.top = '5px';
                info.style.width = '100%';
                info.style.textAlign = 'center';
                info.innerHTML = document.getElementById("banner").innerHTML;
                container.appendChild( info );
 
                camera = new THREE.Camera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
                if(DEBUG) console.log("camera:", camera);
                camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
                camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
                camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
//                camera.position.y = 200;

                scene = new THREE.Scene();

                // Grid

                var geometry = new THREE.Geometry();
                geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( axisMin * 50, 0, 0 ) ) );
                geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( (axisMax+1) * 50, 0, 0 ) ) );

                linesMaterial = new THREE.LineColorMaterial( 0x000000, 0.2 );

                if (!qargs.nogrid) {
                    for (var i = 0; i <= axisMax - axisMin + 1; i++) {
                    
                        var line = new THREE.Line(geometry, linesMaterial);
                        line.position.z = (i * 50) + axisMin * 50;
                        scene.addObject(line);
                        
                        var line = new THREE.Line(geometry, linesMaterial);
                        line.position.x = (i * 50) + axisMin * 50;
                        line.rotation.y = 90 * Math.PI / 180;
                        scene.addObject(line);
                        
                    }
                }

                projector = new THREE.Projector();

                plane = new THREE.Mesh( new Plane( 1000, 1000 ) );
                plane.rotation.x = - 90 * Math.PI / 180;
                scene.addObject( plane );
                
                if (qargs.dim == 2) {
                    cube = new Square( 50, 50, 50 );
                    phi = 180;
                    adjustCamera();
                }
                else {
                    cube = new Cube( 50, 50, 50 );
                }
                cubette = new Cube(10, 10, 10);

                ray = new THREE.Ray( camera.position, null );

                brush = new THREE.Mesh( cube, new THREE.MeshColorFillMaterial( colors[ color ], 0.4 ) );
                //brush.position.y = brushY;
                setObjPosition(brush, cursor);
                brush.overdraw = true;
                scene.addObject( brush );

                onMouseDownPosition = new THREE.Vector2();

                // Lights

                var ambientLight = new THREE.AmbientLight( 0x404040 );
                scene.addLight( ambientLight );

                var directionalLight = new THREE.DirectionalLight( 0xffffff );
                directionalLight.position.x = 1;
                directionalLight.position.y = 1;
                directionalLight.position.z = 0.75;
                directionalLight.position.normalize();
                scene.addLight( directionalLight );

                var directionalLight = new THREE.DirectionalLight( 0x808080 );
                directionalLight.position.x = - 1;
                directionalLight.position.y = 1;
                directionalLight.position.z = - 0.75;
                directionalLight.position.normalize();
                scene.addLight( directionalLight );

                renderer = new THREE.CanvasRenderer();
                if (renderer.invalid) {
                    //alert ("CANVAS element not supported")
                    document.location = "nocanvas.html"; 
                }
                renderer.setSize( window.innerWidth, window.innerHeight );

                container.appendChild(renderer.domElement);

                document.addEventListener( 'keydown', onDocumentKeyDown, false );

                document.addEventListener( 'mousemove', onDocumentMouseMove, false );
                document.addEventListener( 'mousedown', onDocumentMouseDown, false );
                document.addEventListener( 'mouseup', onDocumentMouseUp, false );

                document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
                document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false );

                if (window.location.hash) {
                    buildFromHash();
                }
                else {
                    if (qargs.hash) {
                        buildFromHash(qargs.hash);
                        if (qargs.sel) {
                            lastSelectedEl = document.getElementById(qargs.sel);
                            lastSelectedEl.style.backgroundColor = "cyan";
                            if (history.replaceState) {
                                var url = "" + window.location;
                                var i = url.indexOf('&sel=');
                                if (i > -1) {
                                    var j = i + 1 + url.substr(i+1).indexOf('&');
                                    url = url.substr(0, i) + url.substr(j);
                                    history.replaceState(url, url, url);
                                }
                            }
                        }
                    }
                    else {
                        if (qargs.coords) {
                            var coords = [];
                            var s = qargs.coords.split(",(");
                            for (var i=0; i<s.length; i++) {
                                var coord = s[i].replace("(", "")
                                coord = coord.split(",");
                                for (var j=0; j<3; j++) {
                                    coord[j] = parseInt(coord[j]);
                                }
                                coords.push(coord);
                     …