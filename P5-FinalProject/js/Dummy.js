function Dummy(spawn, col, m) {
    this.spawnPos = spawn;
    this.color = col
    this.mass = m
    this.__allMeshes = [];
    this.physicsEnabled = false;
    this.createArm = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 0.75, 1.75, 0.75 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createLeg = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 0.75, 2, 0.75 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createHead = function() {
        return new Physijs.SphereMesh(
            new THREE.SphereGeometry( 1, 16, 16 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createTorso = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 2, 2.5, 1 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createHip = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 2, 1, 1 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.init = function(scene) {
        // Build the legs

        // Build left leg
        var leftThigh = this.createLeg();
        var leftCalf = this.createLeg();
        leftThigh.position.set(
            -leftThigh.geometry.parameters.width / 2 - 0.125,
            leftCalf.geometry.parameters.height + leftThigh.geometry.parameters.height / 2 + 0.25,
            0
        );
        leftCalf.position.set(
            -leftCalf.geometry.parameters.width / 2 - 0.125,
            leftCalf.geometry.parameters.height / 2,
            0
        );
        var leftKnee = new Physijs.HingeConstraint(
            leftThigh,
            leftCalf,
            leftThigh.position.clone().add(new THREE.Vector3(0, -leftThigh.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build right leg
        var rightThigh = this.createLeg();
        var rightCalf = this.createLeg();
        rightThigh.position.set(
            rightThigh.geometry.parameters.width / 2 + 0.125,
            rightCalf.geometry.parameters.height + rightThigh.geometry.parameters.height / 2 + 0.25,
            0
        );
        rightCalf.position.set(
            rightCalf.geometry.parameters.width / 2 + 0.125,
            rightCalf.geometry.parameters.height / 2,
            0
        );
        var rightKnee = new Physijs.HingeConstraint(
            rightThigh,
            rightCalf,
            rightThigh.position.clone().add(new THREE.Vector3(0, -rightThigh.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build hip and attach to the legs
        var hip = this.createHip();
        hip.position.set(
            0,
            leftThigh.position.y + leftThigh.geometry.parameters.height / 2 + hip.geometry.parameters.height / 2 + 0.25,
            0
        );
        
        // Build hip joints
        var leftHipJoint = new Physijs.HingeConstraint( // Left Hip Joint
            leftThigh,
            hip,
            hip.position.clone().add(new THREE.Vector3(-leftThigh.geometry.parameters.width / 2, -hip.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        var rightHipJoint = new Physijs.HingeConstraint( // right Hip Joint
            rightThigh,
            hip,
            hip.position.clone().add(new THREE.Vector3(leftThigh.geometry.parameters.width / 2, -hip.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build torso and attach to hip
        var torso = this.createTorso();
        torso.position.set(
            0,
            hip.position.y + hip.geometry.parameters.height / 2 + torso.geometry.parameters.height / 2 + 0.25,
            0
        );

        var lumbar = new Physijs.HingeConstraint( // Lower spine pivot (lumbar movement)
            hip,
            torso,
            torso.position.clone().add(new THREE.Vector3(0, -torso.geometry.parameters.height / 2, 0)), // Attach at center bottom of torso
            new THREE.Vector3(1, 1, 1)
        );

        // Build the arms and attach to torso

        // Build the left arm
        var leftUpperArm = this.createArm();
        this.leftForearm = this.createArm();
        leftUpperArm.position.set(
            torso.geometry.parameters.height / 2 + 0.25,
            torso.position.y + leftUpperArm.geometry.parameters.height / 2 - 1,
            0
        );
        this.leftForearm.position.set(
            torso.geometry.parameters.height / 2 + 0.25,
            leftUpperArm.position.y - (leftUpperArm.geometry.parameters.height / 2 + this.leftForearm.geometry.parameters.height / 2 + 0.25),
            0
        );
        var leftElbow = new Physijs.HingeConstraint(
            leftUpperArm,
            this.leftForearm,
            leftUpperArm.position.clone().add(new THREE.Vector3(0, -leftUpperArm.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build the right arm
        var rightUpperArm = this.createArm();
        var rightForearm = this.createArm();
        rightUpperArm.position.set(
            -(torso.geometry.parameters.height / 2 + 0.25),
            torso.position.y + rightUpperArm.geometry.parameters.height / 2 - 1,
            0
        );
        rightForearm.position.set(
            -(torso.geometry.parameters.height / 2 + 0.25),
            rightUpperArm.position.y - (rightUpperArm.geometry.parameters.height / 2 + rightForearm.geometry.parameters.height / 2 + 0.25),
            0
        );
        var rightElbow = new Physijs.HingeConstraint(
            rightUpperArm,
            rightForearm,
            rightUpperArm.position.clone().add(new THREE.Vector3(0, -rightUpperArm.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build shoulders (attaching to torso)
        var leftShoulder = new Physijs.HingeConstraint( // Left shoulder
            torso,
            leftUpperArm,
            leftUpperArm.position.clone().add(new THREE.Vector3(-leftUpperArm.geometry.parameters.width / 2, leftUpperArm.geometry.parameters.height / 2, 0)), // Attach at top right side of arm
            new THREE.Vector3(1, 1, 1)
        );

        var rightShoulder = new Physijs.HingeConstraint( // Right shoulder
            torso,
            rightUpperArm,
            rightUpperArm.position.clone().add(new THREE.Vector3(leftUpperArm.geometry.parameters.width / 2, rightUpperArm.geometry.parameters.height / 2, 0)), // Attach at top left side of arm
            new THREE.Vector3(1, 1, 1)
        );

        // Build the head and attach to torso
        var head = this.createHead();
        head.position.set(
            0,
            torso.position.y + torso.geometry.parameters.height / 2 + head.geometry.parameters.radius + 0.25,
            0
        );

        // Build the neck (attachment to torso)
        var neck = new Physijs.HingeConstraint(
            head,
            torso,
            head.position.clone().add(new THREE.Vector3(0, -head.geometry.parameters.radius, 0)), // Attach at center bottom of head
            new THREE.Vector3(1, 1, 1)
        );

        // Add all the meshes to __allMeshes
        this.__allMeshes.push(leftCalf);
        this.__allMeshes.push(leftThigh);
        this.__allMeshes.push(rightCalf);
        this.__allMeshes.push(rightThigh);
        this.__allMeshes.push(hip);
        this.__allMeshes.push(head);
        this.__allMeshes.push(leftUpperArm);
        this.__allMeshes.push(this.leftForearm);
        this.__allMeshes.push(rightUpperArm);
        this.__allMeshes.push(rightForearm);
        this.__allMeshes.push(torso);

        // Offset __allMeshes by spawnPos, add the movement constraints on spawn, and add them to the scene..
        this.__allMeshes.forEach((mesh) => {
            // Set mesh position
            mesh.position.add(this.spawnPos);

            // Add mesh to scene
            scene.add(mesh);

            // Set movement constraints
            mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            mesh.setAngularFactor(new THREE.Vector3(0, 0, 0));
            mesh.setLinearFactor(new THREE.Vector3(0, 0, 0));
            mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));

            // Collision listener to enable physics for the dummy again
            mesh.addEventListener('collision', () => {
                this.enableAllPhysics();
            });

            
        })
        
        // Add the constraints
        scene.addConstraint(leftKnee);
        scene.addConstraint(rightKnee);
        scene.addConstraint(leftHipJoint);
        scene.addConstraint(rightHipJoint);
        scene.addConstraint(lumbar);
        scene.addConstraint(leftElbow);
        scene.addConstraint(rightElbow);
        scene.addConstraint(leftShoulder);
        scene.addConstraint(rightShoulder);
        scene.addConstraint(neck);
    }
    this.enablePhysics = function(mesh) {
        mesh.setAngularFactor(new THREE.Vector3(1, 1, 1));
        mesh.setLinearFactor(new THREE.Vector3(1, 1, 1));
    }
    this.enableAllPhysics = function() {
        if(!this.physicsEnabled) { // If physics are not enabled, enable them
            this.physicsEnabled = true;
            this.__allMeshes.forEach((mesh) => { // Disable angular factor constriction
                this.enablePhysics(mesh);
            });
            setTimeout(() => {  // After 10s delete every object
                this.__allMeshes.forEach((mesh) => {
                    scene.remove(mesh);
                });
                this.__allMeshes == null;
                despawnDummy(this);
            }, 10000);
        }
    }
}