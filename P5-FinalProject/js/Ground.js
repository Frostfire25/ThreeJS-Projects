function Ground(groundMat) {
    this.mesh;
    this.terrain = [];
    this.terrainSize = 512;
    this.mat = groundMat;//Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xffff00, side: THREE.DoubleSide}), 1, 1);
    this.__doFractile = function(ter, tl, tr, bl, br) {

        // Base case
        if(tl[0] + 1 == tr[0] || tl[0] + 1 == bl[0])
           return;
    
        var center = [(tl[0] + tr[0]) / 2, (tl[1] + bl[1]) / 2];
            
        if(ter[center[0]][center[1]] == -1) { // If no center value is present, compute center
            ter[center[0]][center[1]] = ( // Smooth the center
                ter[tl[0]][tl[1]] +
                ter[tr[0]][tr[1]] +
                ter[bl[0]][bl[1]] +
                ter[br[0]][br[1]]
                ) / 4;
            }
            // Compute sides
            // Left
            var left = [tl[0], center[1]];
            if(ter[left[0]][left[1]] == -1) {
                ter[left[0]][left[1]] = (ter[tl[0]][tl[1]] + ter[bl[0]][bl[1]]) / 2; // Avg of tl and bl
            }
            // Right
            var right = [tr[0], center[1]];
            if(ter[right[0]][right[1]] == -1) {
                ter[right[0]][right[1]] = (ter[tr[0]][tr[1]] + ter[br[0]][br[1]]) / 2; // Avg of tr and br
            }
            // Top
            var top = [center[0], tl[1]];
            if(ter[top[0]][top[1]] == -1) {
                ter[top[0]][top[1]] = (ter[tl[0]][tl[1]] + ter[tr[0]][tr[1]]) / 2; // Avg of tl and tr
            }
            // Bottom
            var bottom = [center[0], bl[1]];
            if(ter[bottom[0]][bottom[1]] == -1) {
                ter[bottom[0]][bottom[1]] = (ter[bl[0]][bl[1]] + ter[br[0]][br[1]]) / 2; // Avg of bl and br
            }
    
            // Call for four quadrants
            this.__doFractile(ter, tl, top, left, center);       // Top left quadrant
            this.__doFractile(ter, top, tr, center, right);      // Top right quadrant
            this.__doFractile(ter, left, center, bl, bottom);    // Bottom left quadrant
            this.__doFractile(ter, center, right, bottom, br);   // Bottom right quadrant
            
    }
    
    this.__smoothTerrain = function(ter, numTimes) {
        for(var t = 0; t < numTimes; t++) { // Do it this many times
            // Do the corners
            // 1: Top left
            ter[0][0] = (
                ter[0][1] +
                ter[1][1] +
                ter[1][0]
            ) / 3;
            // 2: Top right
            ter[this.terrainSize][0] = (
                ter[this.terrainSize - 1][0] +
                ter[this.terrainSize - 1][1] +
                ter[this.terrainSize][1]
            ) / 3;
            // 3: Bottom left
            ter[0][this.terrainSize] = (
                ter[0][this.terrainSize-1] +
                ter[1][this.terrainSize-1] +
                ter[1][this.terrainSize]
            ) / 3;
            // 4: Bottom right
            ter[this.terrainSize][this.terrainSize] = (
                ter[this.terrainSize][this.terrainSize-1] +
                ter[this.terrainSize-1][this.terrainSize-1] +
                ter[this.terrainSize-1][this.terrainSize]
            ) / 3;

            // Do the other points
            for(var i = 0; i < this.terrainSize; i++) {
                for(var j = 0; j < this.terrainSize; j++) { // Average the heights of all the surrounding vertices
                    // Case 0: Skip if it is a corner
                    if((i==0&&j==0) || (i==0&&j==this.terrainSize) || (i==this.terrainSize&&j==0) || (i==this.terrainSize&&j==this.terrainSize))
                        continue;
                    // Case 1: On left side (i = 0)
                    if(i == 0) {
                        ter[i][j] = (
                            ter[i][j-1] +       // Top mid
                            ter[i+1][j-1] +     // Top right
                            ter[i+1][j] +       // Mid right
                            ter[i][j+1] +       // Bot mid
                            ter[i+1][j+1]       // Bot right
                        ) / 5;
                    }
                    // Case 2: On right side (i = this.terrainSize)
                    else if(i == this.terrainSize) {
                        ter[i][j] = (
                            ter[i-1][j-1] +     // Top left
                            ter[i][j-1] +       // Top mid
                            ter[i-1][j] +       // Mid left
                            ter[i-1][j+1] +     // Bot left
                            ter[i][j+1]         // Bot mid
                        ) / 5;
                    }
                    // Case 3: On top side (j = 0)
                    else if(j == 0) {
                        ter[i][j] = (
                            ter[i-1][j] +       // Mid left
                            ter[i+1][j] +       // Mid right
                            ter[i-1][j+1] +     // Bot left
                            ter[i][j+1] +       // Bot mid
                            ter[i+1][j+1]       // Bot right
                        ) / 5;
                    }
                    // Case 4: On bottom side (j = this.terrainSize)
                    else if(j == this.terrainSize) {
                        ter[i][j] = (
                            ter[i-1][j-1] +     // Top left
                            ter[i][j-1] +       // Top mid
                            ter[i+1][j-1] +     // Top right
                            ter[i-1][j] +       // Mid left
                            ter[i+1][j]        // Mid right
                        ) / 5;
                    }
                    else { // Otherwise
                        ter[i][j] = (
                            ter[i-1][j-1] +     // Top left
                            ter[i][j-1] +       // Top mid
                            ter[i+1][j-1] +     // Top right
                            ter[i-1][j] +       // Mid left
                            ter[i+1][j] +       // Mid right
                            ter[i-1][j+1] +     // Bot left
                            ter[i][j+1] +       // Bot mid
                            ter[i+1][j+1]       // Bot right
                        ) / 8;
                    }
                }
            }
        }
    }
    this.init = function(scene) {

        // Functions
        // Gets a random number
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        // Gets a random integer
        // https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
        function getRandomArbitraryInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var geom = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize, this.terrainSize, this.terrainSize);
        /**
         *  Prepare height map (this.terrain)
         */
        // Initialize array
        for(var i = 0; i < this.terrainSize + 1; i++) {
            this.terrain[i] = new Array(this.terrainSize + 1);
            for(var j = 0; j < this.terrainSize + 1; j++) {
                this.terrain[i][j] = -1;
           }
        }
        
        // Define 4 corners
        this.terrain[0][0] = 100; // TL
        this.terrain[this.terrainSize][0] = 130; // TR
        this.terrain[0][this.terrainSize] = 200; // BL
        this.terrain[this.terrainSize][this.terrainSize] = 160; // BR
        
        // Mountian in the middle
        var lowRange = 0;
        var highRange = 3000;
        
        // Define center
        // Mountian in the middle
        const height = getRandomArbitraryInt(highRange/2, highRange);
        this.terrain[this.terrainSize/2][this.terrainSize/2] = height;
        
        // Small mountian's
        const heightSmallMountian = getRandomArbitraryInt(highRange/4, highRange/2);
        const heightSmallMountian2 = getRandomArbitraryInt(highRange/4, highRange/2);
        const heightSmallMountian3 = getRandomArbitraryInt(highRange/4, highRange/2);
        const heightSmallMountian4 = getRandomArbitraryInt(highRange/4, highRange/2);
        
        this.terrain[this.terrainSize/4][this.terrainSize/4] = heightSmallMountian;
        this.terrain[this.terrainSize/4][this.terrainSize] = heightSmallMountian2;
        this.terrain[this.terrainSize][this.terrainSize/4] = heightSmallMountian3;
        this.terrain[this.terrainSize][this.terrainSize] = heightSmallMountian4;
        
        // Smaller mountians
        // Small mountian's
        const heightMediumMountian = getRandomArbitraryInt(highRange/3, highRange/2);
        const heightMediumMountian2 = getRandomArbitraryInt(highRange/3, highRange/2);
        const heightMediumMountian3 = getRandomArbitraryInt(highRange/3, highRange/2);
        const heightMediumMountian4 = getRandomArbitraryInt(highRange/3, highRange/2);
        
        this.terrain[this.terrainSize/8][this.terrainSize/8] = heightMediumMountian;
        this.terrain[this.terrainSize/8][this.terrainSize] = heightMediumMountian2;
        this.terrain[this.terrainSize][this.terrainSize/8] = heightMediumMountian3;
        this.terrain[this.terrainSize][this.terrainSize] = heightMediumMountian4;
        /**
         * Interpolate + Smooth height map (this.terrain)
         */
        this.__doFractile(this.terrain, [0,0], [this.terrainSize,0], [0,this.terrainSize], [this.terrainSize,this.terrainSize]);
        this.__smoothTerrain(this.terrain, 1);

        // Convert into mesh
        var verts = [];
        for(var i = 0; i < (this.terrainSize+1)**2; i++)
            verts[i] = this.terrain[i % (this.terrainSize+1)][Math.floor(i / (this.terrainSize+1))];
        for ( var i = 0; i < geom.vertices.length; i++ )
            geom.vertices[i].z = verts[i] * 0.02;

        geom.verticesNeedUpdate = true;
        geom.computeFaceNormals();
        geom.computeVertexNormals();

        this.mesh = new Physijs.HeightfieldMesh(geom, this.mat, 100000);

        this.mesh.rotation.x -= Math.PI / 2;

        this.mesh.castShadow = false;
        this.mesh.receiveShadow = true;

        this.mesh.position.set(0, 0, 0);

        // Adding the terrain mapped to plane
        scene.add( this.mesh );

        // Freeze the terrain in the scene
        this.mesh.setLinearFactor(new THREE.Vector3(0, 0, 0));
        this.mesh.setAngularFactor(new THREE.Vector3(0, 0, 0));
    }
}