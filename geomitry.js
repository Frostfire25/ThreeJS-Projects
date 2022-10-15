/**
 * Cube:
 * 
 * In a cube there are 6 faces.
 * Each face must have a minimum of 2 triangles, where the hypotenuse is a diaganol line from edge to edge of the face
 * 
 * Coords:
 * origin: 0,0,0
 * 0,1,0
 * 1,0,1
 * 0,1,1
 * 1,0,1
 * 1,1,0
 * 0,1,0
 * edge: 1,1,1
 * 
 * Tetrahedron:
 * 
 * A tetrahedron has 4 faces of triangles.
 * Coords:
 * vertex: 1,1,1
 * 0,0,0
 * 0,0,1
 * 1,0,0
 * 1,0,1
 */

/**
 * Cubes
 */

function point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

function cube(size, origin_point, edge_point) {
    this.size = size;
    this.origin_point = origin_point;
    this.edge_point = edge_point;
}


function getPointsOfACube(cube) {

    var points = new Array(8);
    o = cube.origin_point;
    points[0] = new point(o.x, o.y, o.z);
    points[1] = new point(o.x, cube.size + o.y, o.z);
    points[2] = new point(o.x + cube.size, o.y, o.z + cube.size);
    points[3] = new point(o.x, o.y + cube.size, o.z + cube.size);
    points[4] = new point(o.x + cube.size, o.y, o.z + cube.size);
    points[5] = new point(o.x + cube.size, o.y + cube.size, o.z);
    points[6] = new point(o.x, o.y + cube.size, o.z);
    points[7] = new point(o.x + cube.size, o.y + cube.size, o.z + cube.size);

    return points;
}


function areaOfCube(cube) {
    return cube.size ** 3;
}

/**
 * Tetrahedron 
 */

function tetrahedron(vertex_point) {
    this.vertex_point = vertex_point;
}



