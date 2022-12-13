function getRandomArbitraryInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function SmokeParticle(pos) {

    this.pos = pos;

    this.init = function() {

        const offsetRad = 1;

        for(var i = 0; i < getRandomArbitraryInt(25, 50); i++) {
                
            var newVerts = new Float32Array([
                this.pos.x, this.pos.y, this.pos.z
            ]);
            var ptGeom = new THREE.BufferGeometry();
            ptGeom.setAttribute('position', new THREE.BufferAttribute(newVerts, 3));
            var ptMat = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false, color: 0x00ffff} );
            var dot = new THREE.Points( ptGeom, ptMat );

        }
        
    };

}