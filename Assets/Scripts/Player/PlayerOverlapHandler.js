// PlayerOverlapHandler.js

//@input Physics.ColliderComponent playerCollider

//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent livesService
//@input Component.ScriptComponent scoreService
//@input Component.ScriptComponent playerJump
//@input Component.ScriptComponent runnerSpawner

//@input SceneObject playerVisual

//@input float invulnerabilityTime = 1.0

var invulnerabilityTimer = 0;

var blinkTimer = 0;
var blinkInterval = 0.12;
var blinkIntervalTimer = 0;
var blinkState = true;

function setPlayerVisible(value) {
    if (script.playerVisual) {
        script.playerVisual.enabled = value;
    }
}

function startBlink() {
    blinkTimer = script.invulnerabilityTime;
    blinkIntervalTimer = 0;
    blinkState = true;
    setPlayerVisible(true);
}

function updateTimers() {
    var dt = getDeltaTime();

    if (invulnerabilityTimer > 0) {
        invulnerabilityTimer -= dt;
        if (invulnerabilityTimer < 0) {
            invulnerabilityTimer = 0;
        }
    }

    if (blinkTimer > 0) {
        blinkTimer -= dt;
        blinkIntervalTimer -= dt;

        if (blinkIntervalTimer <= 0) {
            blinkIntervalTimer = blinkInterval;
            blinkState = !blinkState;
            setPlayerVisible(blinkState);
        }

        if (blinkTimer <= 0) {
            blinkTimer = 0;
            setPlayerVisible(true);
        }
    }
}

function findRunnerObject(sceneObject) {
    var current = sceneObject;

    while (current) {
        var scripts = current.getComponents("Component.ScriptComponent");

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].getObjectType) {
                return {
                    rootObject: current,
                    tag: scripts[i]
                };
            }
        }

        current = current.getParent();
    }

    return null;
}

function deactivateObject(sceneObject) {
    if (script.runnerSpawner && script.runnerSpawner.deactivateSceneObject) {
        script.runnerSpawner.deactivateSceneObject(sceneObject);
    } else if (sceneObject) {
        sceneObject.enabled = false;
    }
}

function handleCoin(sceneObject, tag) {
    if (tag.isHandled && tag.isHandled()) {
        return;
    }

    tag.markHandled();

    if (script.scoreService) {
        script.scoreService.addCollectibleScore();
    }

    deactivateObject(sceneObject);

    print("Coin collected by overlap");
}

function handleObstacle(sceneObject, tag) {
    if (tag.isHandled && tag.isHandled()) {
        return;
    }



    if (invulnerabilityTimer > 0) {
        return;
    }

    tag.markHandled();

    var livesLeft = script.livesService ? script.livesService.takeDamage() : 0;

    deactivateObject(sceneObject);

    if (livesLeft <= 0) {
        setPlayerVisible(true);

        if (script.gameController) {
            script.gameController.gameOver();
        }

        return;
    }

    invulnerabilityTimer = script.invulnerabilityTime;
    startBlink();

    print("Obstacle hit by overlap");
}

function onOverlapEnter(eventData) {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var otherCollider = eventData.overlap.collider;
    if (!otherCollider) {
        return;
    }

    var otherObject = otherCollider.getSceneObject();
    var runnerObject = findRunnerObject(otherObject);
    print("Overlap with: " + otherObject.name);
    if (!runnerObject) {
        print("Overlap object has no RunnerObjectTag: " + otherObject.name);
        return;
    }

    var tag = runnerObject.tag;
    var rootObject = runnerObject.rootObject;
    var type = tag.getObjectType();

    if (type === "coin") {
        handleCoin(rootObject, tag);
    } else if (type === "obstacle") {
        handleObstacle(rootObject, tag);
    }
}

script.resetCollisionState = function () {
    invulnerabilityTimer = 0;
    blinkTimer = 0;
    blinkIntervalTimer = 0;
    blinkState = true;
    setPlayerVisible(true);

    print("Overlap collision state reset");
};

script.createEvent("OnStartEvent").bind(function () {
    if (!script.playerCollider) {
        print("PlayerOverlapHandler: playerCollider is missing");
        return;
    }

    script.playerCollider.onOverlapEnter.add(onOverlapEnter);

    print("PlayerOverlapHandler initialized");
});

script.createEvent("UpdateEvent").bind(function () {
    updateTimers();
});