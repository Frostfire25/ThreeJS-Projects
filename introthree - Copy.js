// Create the object to represent a triangle
function Triangle (a, aCol, b, bCol, c, cCol) {
    this.v1 = new THREE.Vector3(a[0], a[1], a[2]);
    this.v2 = new THREE.Vector3(b[0], b[1], b[2]);
    this.v3 = new THREE.Vector3(c[0], c[1], c[2]);
    this.v1Col = new THREE.Color(aCol[0], aCol[1], aCol[2]);
    this.v2Col = new THREE.Color(bCol[0], bCol[1], bCol[2]);
    this.v3Col = new THREE.Color(cCol[0], cCol[1], cCol[2]);
  
    // The function that actually adds the triangle geometry to the scene
    this.render = function() {
      var geom = new THREE.Geometry();  
      // Add the three vertices to the geometry
      geom.vertices.push(this.v1, this.v2, this.v3);
  
      // Create the triangle by tying the three faces together in a 'face'
      var face = new THREE.Face3( 0, 1, 2 );
      // Also, we need the colors here
      face.vertexColors.push(this.v1Col, this.v2Col, this.v3Col);
      geom.faces.push( face );
      geom.computeFaceNormals();
  
      // Add the color information by creating a 'material'
      var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
      var mesh= new THREE.Mesh( geom, material );
      scene.add(mesh);
    }	
  }


function Square(a, b, c, d) {
    this.v1 = new THREE.Vector3(a[0], a[1], a[2]);
    this.v2 = new THREE.Vector3(b[0], b[1], b[2]);
    this.v3 = new THREE.Vector3(c[0], c[1], c[2]);
    this.v4 = new THREE.Vector3(d[0], d[1], d[2]);


    this.render = function() {
        var geom = new THREE.Geometry();
        geom.vertices.push(this.v1, this.v2, this.v3);
        geom.vertices.push(this.v4);

        var tri1 = new THREE.Face3(0,1,2);
        var tri2 = new THREE.Face3(1,2,3)

        geom.faces.push(tri1);
        geom.faces.push(tri2);

        geom.computeFaceNormals();

        // Add the color information by creating a 'material'
        var material = new THREE.MeshBasicMaterial();
        var mesh = new THREE.Mesh( geom, material );
        scene.add(mesh);
    }
    
}

  
  var scene = new THREE.Scene();
  
  var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, .1, 3000 );
  camera.position.z = 100;  // Try moving this around!
  camera.lookAt( new THREE.Vector3(0.0,0.0,0.0));
  scene.add( camera );
  
  var renderer = new THREE.WebGLRenderer({canvas: myCanvas, antialias: true});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  var tri = new Triangle([0, 0, 0], [1,0,0], [30, 0, 0], [0,1,0], [30, 30, 0], [0,0,1] );
  //tri.render();
  
  var square = new Square([0,0,0], [50,0,0], [0,50,0] [50,50,0]);
  square.render();

  renderer.render( scene, camera );

