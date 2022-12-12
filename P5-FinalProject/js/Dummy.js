function Dummy(spawn, col, m) {
    this.spawnPos = spawn;
    this.color = col
    this.mass = m
    this.createArm = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 3, 7, 3 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createLeg = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 3, 8, 3 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createHead = function() {
        return new Physijs.SphereMesh(
            new THREE.SphereGeometry( 4, 16, 16 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createTorso = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 8, 10, 4 ),
            new THREE.MeshPhongMaterial({ color: this.color }),
            this.mass
        );
    }
    this.createHip = function() {
        return new Physijs.BoxMesh(
            new THREE.CubeGeometry( 8, 4, 4 ),
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
            -2,
            leftCalf.geometry.parameters.height + leftThigh.geometry.parameters.height / 2 + 1,
            0
        );
        leftCalf.position.set(
            -2,
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
            2,
            rightCalf.geometry.parameters.height + rightThigh.geometry.parameters.height / 2 + 1,
            0
        );
        rightCalf.position.set(
            2,
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
            leftThigh.position.y + leftThigh.geometry.parameters.height / 2 + hip.geometry.parameters.height / 2 + 1,
            0
        );
        
        // Build hip joints
        var leftHipJoint = new Physijs.HingeConstraint( // Left Hip Joint
            leftThigh,
            hip,
            hip.position.clone().add(new THREE.Vector3(-2, -hip.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        var rightHipJoint = new Physijs.HingeConstraint( // right Hip Joint
            rightThigh,
            hip,
            hip.position.clone().add(new THREE.Vector3(2, -hip.geometry.parameters.height / 2, 0)),
            new THREE.Vector3(1, 1, 1)
        );

        // Build torso and attach to hip
        var torso = this.createTorso();
        torso.position.set(
            0,
            hip.position.y + hip.geometry.parameters.height / 2 + torso.geometry.parameters.height / 2 + 1,
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
            6,
            torso.position.y + leftUpperArm.geometry.parameters.height / 2 - 4,
            0
        );
        this.leftForearm.position.set(
            6,
            leftUpperArm.position.y - (leftUpperArm.geometry.parameters.height / 2 + this.leftForearm.geometry.parameters.height / 2 + 1),
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
            -6,
            torso.position.y + rightUpperArm.geometry.parameters.height / 2 - 4,
            0
        );
        rightForearm.position.set(
            -6,
            rightUpperArm.position.y - (rightUpperArm.geometry.parameters.height / 2 + rightForearm.geometry.parameters.height / 2 + 1),
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
            leftUpperArm.position.clone().add(new THREE.Vector3(-2, leftUpperArm.geometry.parameters.height / 2, 0)), // Attach at top right side of arm
            new THREE.Vector3(1, 1, 1)
        );

        var rightShoulder = new Physijs.HingeConstraint( // Right shoulder
            torso,
            rightUpperArm,
            rightUpperArm.position.clone().add(new THREE.Vector3(2, rightUpperArm.geometry.parameters.height / 2, 0)), // Attach at top left side of arm
            new THREE.Vector3(1, 1, 1)
        );

        // Build the head and attach to torso
        var head = this.createHead();
        head.position.set(
            0,
            torso.position.y + torso.geometry.parameters.height / 2 + head.geometry.parameters.radius + 1,
            0
        );

        // Build the neck (attachment to torso)
        var neck = new Physijs.HingeConstraint(
            head,
            torso,
            head.position.clone().add(new THREE.Vector3(0, -head.geometry.parameters.radius, 0)), // Attach at center bottom of head
            new THREE.Vector3(1, 1, 1)
        );


        console.log(this.spawnPos);
        // Offset by the spawning position
        leftCalf.position.add(this.spawnPos);
        leftThigh.position.add(this.spawnPos);
        rightCalf.position.add(this.spawnPos);
        rightThigh.position.add(this.spawnPos);
        hip.position.add(this.spawnPos);
        head.position.add(this.spawnPos);
        leftUpperArm.position.add(this.spawnPos);
        this.leftForearm.position.add(this.spawnPos);
        rightUpperArm.position.add(this.spawnPos);
        rightForearm.position.add(this.spawnPos);
        torso.position.add(this.spawnPos);

        // Add all to the scene
        scene.add(leftThigh);
        scene.add(leftCalf);
        scene.addConstraint(leftKnee);
        scene.add(rightThigh);
        scene.add(rightCalf);
        scene.addConstraint(rightKnee);
        scene.add(hip);
        scene.addConstraint(leftHipJoint);
        scene.addConstraint(rightHipJoint);
        scene.add(torso);
        scene.addConstraint(lumbar);
        scene.add(leftUpperArm);
        scene.add(this.leftForearm);
        scene.addConstraint(leftElbow);
        scene.add(rightUpperArm);
        scene.add(rightForearm);
        scene.addConstraint(rightElbow);
        scene.addConstraint(leftShoulder);
        scene.addConstraint(rightShoulder);
        scene.add(head);
        scene.addConstraint(neck);
    }
}