// CollectibleMover.js

//@input Component.ScriptComponent difficultyService
//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent scoreService
//@input SceneObject playerRoot
//@input SceneObject[] collectibles

//@input float moveSpeed = 700.0
//@input float despawnZ = 1200.0
//@input float respawnZ = -4800.0
//@input float laneDistance = 150.0
//@input float collectDistanceZ = 120.0
//@input float collectDistanceX = 70.0

function getRandomLaneX() {
    var lane = Math.floor(Math.random() * 3);
    return (lane - 1) * script.laneDistance;
}

function respawnCollectible(collectible) {
    var transform = collectible.getTransform();
    var pos = transform.getLocalPosition();

    pos.x = getRandomLaneX();
    pos.z = script.respawnZ - Math.random() * 1500;

    transform.setLocalPosition(pos);
}

script.resetCollectibles = function () {
    for (var i = 0; i < script.collectibles.length; i++) {
        var collectible = script.collectibles[i];
        if (!collectible) continue;

        var transform = collectible.getTransform();
        var pos = transform.getLocalPosition();

        pos.x = getRandomLaneX();
        pos.z = script.respawnZ - 600 - i * 900 - Math.random() * 300;

        transform.setLocalPosition(pos);
    }

    print("Collectibles reset");
};

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var playerPos = script.playerRoot.getTransform().getLocalPosition();
    var dt = getDeltaTime();

    for (var i = 0; i < script.collectibles.length; i++) {
        var collectible = script.collectibles[i];
        if (!collectible) continue;

        var transform = collectible.getTransform();
        var pos = transform.getLocalPosition();

        var speed = script.difficultyService ? script.difficultyService.getSpeed() : script.moveSpeed;
        pos.z += speed * dt;

        var dz = Math.abs(pos.z - playerPos.z);
        var dx = Math.abs(pos.x - playerPos.x);

        if (dz < script.collectDistanceZ && dx < script.collectDistanceX) {
            print("Collectible collected!");
            script.scoreService.addCollectibleScore();
            respawnCollectible(collectible);
            continue;
        }

        if (pos.z > script.despawnZ) {
            respawnCollectible(collectible);
            continue;
        }

        transform.setLocalPosition(pos);
    }
});