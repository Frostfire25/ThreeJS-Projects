function getRandomArbitraryInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function Smoke(pos, min, max) {
    this.pos = pos;
    this.particles = [];
    this.min = min;
    this.max = max;
    this.init = function(scene) {
        for(var i = 0; i < getRandomArbitraryInt(this.min, this.max); i++) { // Generate b/w 25 - 50 particles
                
            var newVerts = new Float32Array([
                this.pos.x, this.pos.y + 0.08, this.pos.z
            ]);
            var ptGeom = new THREE.BufferGeometry();
            ptGeom.setAttribute('position', new THREE.BufferAttribute(newVerts, 3));
            var col = Math.random() * 0.25;
            var ptMat = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false, color: new THREE.Color(col, col, col)} );
            var dot = new THREE.Points( ptGeom, ptMat );

            // Particle mechanics
            var particle = new SmokeParticle(dot, this);
            const maxVel = 0.002;
            particle.v = new THREE.Vector3(getRandomArbitrary(-maxVel, maxVel), getRandomArbitrary(-maxVel, maxVel), getRandomArbitrary(-maxVel, maxVel));
            scene.add(particle.mesh);

            this.particles.push(particle);
            
        }
    }
    this.__removeParticle = function(particle) {
        for(var i = 0; i < this.particles.length; i++)
            if(this.particles[i] === particle)
                this.particles.splice(i, 1);
    }
    this.update = function() {
        if(this.particles.length > 0)
            this.particles.forEach((particle) => {
                particle.update();
            });
        else
            despawnSmoke(this);
    }
}

function SmokeParticle(mesh, smoke) {

    this.mesh = mesh;
    this.v = 0;

    this.update = function() {
        this.mesh.position.add(this.v);
        this.v.multiplyScalar(0.9925);  
    };

    setTimeout(() => {
        scene.remove(this.mesh);
        smoke.__removeParticle(this)
    }, getRandomArbitrary(100, 250)); // B/w .2-1s

}