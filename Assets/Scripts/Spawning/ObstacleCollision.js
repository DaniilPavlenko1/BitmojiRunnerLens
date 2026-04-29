// ObstacleCollision.js

//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent livesService
//@input Component.ScriptComponent playerJump
//@input SceneObject playerRoot
//@input SceneObject playerVisual
//@input SceneObject[] obstacles

//@input float playerZ = -300
//@input float hitDistanceZ = 120
//@input float hitDistanceX = 120
//@input float invulnerabilityTime = 1.0

var invulnerabilityTimer = 0;
var blinkTimer = 0;
var blinkInterval = 0.12;
var blinkIntervalTimer = 0;
var blinkState = true;

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    // blinking logic MUST be before invulnerability return
    if (blinkTimer > 0 && script.playerVisual) {
        blinkTimer -= getDeltaTime();
        blinkIntervalTimer -= getDeltaTime();

        if (blinkIntervalTimer <= 0) {
            blinkIntervalTimer = blinkInterval;
            blinkState = !blinkState;
            script.playerVisual.enabled = blinkState;
        }

        if (blinkTimer <= 0) {
            script.playerVisual.enabled = true;
        }
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
            if (script.playerJump && script.playerJump.isJumping()) {
                print("Jumped over obstacle!");
                return;
            }
            print("Hit obstacle!");

            invulnerabilityTimer = script.invulnerabilityTime;
            blinkTimer = script.invulnerabilityTime;
            blinkIntervalTimer = 0;
            blinkState = true;

            if (script.playerVisual) {
                script.playerVisual.enabled = true;
            }

            var livesLeft = script.livesService.takeDamage();

            // move obstacle away so it cannot hit again immediately
            obstaclePos.z = -4800;
            obstacle.getTransform().setLocalPosition(obstaclePos);

            if (livesLeft <= 0) {
                script.gameController.gameOver();
            }

            return;
        }
    }
});

function setVisible(obj, visible) {
    if (!obj) return;

    var meshes = obj.getComponents("Component.RenderMeshVisual");
    for (var i = 0; i < meshes.length; i++) {
        meshes[i].enabled = visible;
    }
}