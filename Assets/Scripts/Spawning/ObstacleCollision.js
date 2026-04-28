// ObstacleCollision.js

//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent livesService
//@input SceneObject playerRoot
//@input SceneObject[] obstacles

//@input float playerZ = -300
//@input float hitDistanceZ = 120
//@input float hitDistanceX = 120
//@input float invulnerabilityTime = 1.0

var invulnerabilityTimer = 0;

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    if (invulnerabilityTimer > 0) {
        invulnerabilityTimer -= getDeltaTime();
        return;
    }

    if (!script.playerRoot) {
        return;
    }

    var playerPos = script.playerRoot.getTransform().getLocalPosition();

    for (var i = 0; i < script.obstacles.length; i++) {
        var obstacle = script.obstacles[i];

        if (!obstacle) {
            continue;
        }

        var obstaclePos = obstacle.getTransform().getLocalPosition();

        var dz = Math.abs(obstaclePos.z - script.playerZ);
        var dx = Math.abs(obstaclePos.x - playerPos.x);

        if (dz < script.hitDistanceZ && dx < script.hitDistanceX) {
            print("Hit obstacle!");

            invulnerabilityTimer = script.invulnerabilityTime;

            var livesLeft = script.livesService.takeDamage();

            // move obstacle away so it cannot hit again immediately
            obstaclePos.z -= 4000;
            obstacle.getTransform().setLocalPosition(obstaclePos);

            if (livesLeft <= 0) {
                script.gameController.gameOver();
            }

            return;
        }
    }
});