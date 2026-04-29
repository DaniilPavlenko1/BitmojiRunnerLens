// ObstacleMover.js

//@input Component.ScriptComponent difficultyService
//@input Component.ScriptComponent gameController
//@input SceneObject[] obstacles
//@input float moveSpeed = 700.0
//@input float despawnZ = 1200.0
//@input float respawnZ = -4800.0
//@input float laneDistance = 150.0

function getRandomLaneX() {
    var lane = Math.floor(Math.random() * 3); // 0, 1, 2
    return (lane - 1) * script.laneDistance;
}

function respawnObstacle(obstacle) {
    var transform = obstacle.getTransform();
    var pos = transform.getLocalPosition();

    pos.x = getRandomLaneX();
    pos.z = script.respawnZ - Math.random() * 1200;

    transform.setLocalPosition(pos);
}

script.resetObstacles = function () {
    for (var i = 0; i < script.obstacles.length; i++) {
        var obstacle = script.obstacles[i];
        if (!obstacle) continue;

        var transform = obstacle.getTransform();
        var pos = transform.getLocalPosition();

        pos.x = getRandomLaneX();
        pos.z = script.respawnZ - i * 1200 - Math.random() * 400;

        transform.setLocalPosition(pos);
    }

    print("Obstacles reset");
};

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var dt = getDeltaTime();

    for (var i = 0; i < script.obstacles.length; i++) {
        var obstacle = script.obstacles[i];

        if (!obstacle) {
            continue;
        }

        var transform = obstacle.getTransform();
        var pos = transform.getLocalPosition();

        var speed = script.difficultyService ? script.difficultyService.getSpeed() : script.moveSpeed;
        pos.z += speed * dt;

        if (pos.z > script.despawnZ) {
            pos.x = getRandomLaneX();
            pos.z = script.respawnZ - Math.random() * 1200;
        }

        transform.setLocalPosition(pos);
    }
});