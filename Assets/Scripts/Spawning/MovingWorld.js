// MovingWorld.js
//@input Component.ScriptComponent difficultyService
//@input Component.ScriptComponent gameController
//@input SceneObject[] movingObjects
//@input float moveSpeed = 250.0
//@input float resetZ = -700.0
//@input float segmentLength = 600.0

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var dt = getDeltaTime();

    for (var i = 0; i < script.movingObjects.length; i++) {
        var obj = script.movingObjects[i];

        if (!obj) {
            continue;
        }

        var transform = obj.getTransform();
        var pos = transform.getLocalPosition();

        var speed = script.difficultyService ? script.difficultyService.getSpeed() : script.moveSpeed;
        pos.z += speed * dt;

        if (pos.z > script.resetZ) {
            pos.z -= script.segmentLength * script.movingObjects.length;
        }

        transform.setLocalPosition(pos);
    }
});