// RunnerSpawner.js

//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent difficultyService

//@input Asset.ObjectPrefab obstaclePrefab
//@input Asset.ObjectPrefab coinPrefab
//@input SceneObject runtimeRoot

//@input int obstaclePoolSize = 12
//@input int coinPoolSize = 30

//@input float laneDistance = 150.0
//@input float spawnStartZ = -3500.0
//@input float rowSpacing = 650.0
//@input float despawnZ = 1200.0

//@input float obstacleY = -40.0
//@input float coinY = -15.0
//@input float runtimeSpawnZ = -8000.0

var obstacles = [];
var coins = [];

var activeObjects = [];
var nextSpawnZ = 0;
var spawnTimer = 0;

var ROW_EMPTY = 0;
var ROW_SINGLE_OBSTACLE = 1;
var ROW_DOUBLE_OBSTACLE = 2;
var ROW_COIN_LINE = 3;
var ROW_OBSTACLE_WITH_COINS = 4;

function laneToX(lane) {
    return (lane - 1) * script.laneDistance;
}

function randomLane() {
    return Math.floor(Math.random() * 3);
}

function getInactive(pool) {
    for (var i = 0; i < pool.length; i++) {
        if (!pool[i].enabled) {
            return pool[i];
        }
    }

    return null;
}

function setObjectPosition(obj, lane, y, z) {
    var tr = obj.getTransform();
    var pos = tr.getLocalPosition();

    pos.x = laneToX(lane);
    pos.y = y;
    pos.z = z;

    tr.setLocalPosition(pos);
}

function createPool(prefab, count, poolName) {
    var result = [];

    for (var i = 0; i < count; i++) {
        var obj = prefab.instantiate(script.runtimeRoot);
        obj.name = poolName + "_" + i;
        obj.enabled = false;
        result.push(obj);
    }

    return result;
}

function spawnObstacle(lane, z) {
    var obj = getInactive(obstacles);

    if (!obj) {
        return;
    }

    setObjectPosition(obj, lane, script.obstacleY, z);
    resetRunnerTag(obj);
    obj.enabled = true;

    activeObjects.push({
        sceneObject: obj,
        type: "obstacle",
        lane: lane,
        collected: false,
        hit: false
    });
}

function spawnCoin(lane, z) {
    var obj = getInactive(coins);

    if (!obj) {
        return;
    }

    setObjectPosition(obj, lane, script.coinY, z);
    obj.enabled = true;
    resetRunnerTag(obj);


    activeObjects.push({
        sceneObject: obj,
        type: "coin",
        lane: lane,
        collected: false,
        hit: false
    });
}

function spawnRow(z) {
    var pattern = 1 + Math.floor(Math.random() * 4);

    if (pattern === ROW_EMPTY) {
        return;
    }

    if (pattern === ROW_SINGLE_OBSTACLE) {
        spawnObstacle(randomLane(), z);
        return;
    }

    if (pattern === ROW_DOUBLE_OBSTACLE) {
        var safeLane = randomLane();

        for (var lane = 0; lane < 3; lane++) {
            if (lane !== safeLane) {
                spawnObstacle(lane, z);
            }
        }

        return;
    }

    if (pattern === ROW_COIN_LINE) {
        var coinLane = randomLane();

        spawnCoin(coinLane, z);
        spawnCoin(coinLane, z - 180);
        spawnCoin(coinLane, z - 360);

        return;
    }

    if (pattern === ROW_OBSTACLE_WITH_COINS) {
        var obstacleLane = randomLane();
        var rewardLane = randomLane();

        while (rewardLane === obstacleLane) {
            rewardLane = randomLane();
        }

        spawnObstacle(obstacleLane, z);
        spawnCoin(rewardLane, z - 150);
        spawnCoin(rewardLane, z - 330);
    }
}

function deactivateRuntimeObject(index) {
    var data = activeObjects[index];

    if (data && data.sceneObject) {
        resetRunnerTag(data.sceneObject);
        data.sceneObject.enabled = false;
    }

    activeObjects.splice(index, 1);
}

function moveActiveObjects() {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var speed = script.difficultyService ? script.difficultyService.getSpeed() : 700.0;
    var dz = speed * getDeltaTime();

    for (var i = activeObjects.length - 1; i >= 0; i--) {
        var data = activeObjects[i];
        var obj = data.sceneObject;

        if (!obj || !obj.enabled) {
            activeObjects.splice(i, 1);
            continue;
        }

        var tr = obj.getTransform();
        var pos = tr.getLocalPosition();

        pos.z += dz;
        tr.setLocalPosition(pos);

        if (pos.z > script.despawnZ) {
            deactivateRuntimeObject(i);
        }
    }
}

function fillInitialRows() {
    nextSpawnZ = script.spawnStartZ;

    for (var i = 0; i < 8; i++) {
        spawnRow(nextSpawnZ);
        nextSpawnZ -= script.rowSpacing;
    }
}

function spawnWhileNeeded() {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    var speed = script.difficultyService ? script.difficultyService.getSpeed() : 700.0;

    spawnTimer += speed * getDeltaTime();

    if (spawnTimer >= script.rowSpacing) {
        spawnTimer = 0;

        spawnRow(script.runtimeSpawnZ);
    }
}

script.resetSpawner = function () {
    for (var i = activeObjects.length - 1; i >= 0; i--) {
        deactivateRuntimeObject(i);
    }

    for (var o = 0; o < obstacles.length; o++) {
        obstacles[o].enabled = false;
    }

    for (var c = 0; c < coins.length; c++) {
        coins[c].enabled = false;
    }

    activeObjects = [];
    spawnTimer = 0;
    fillInitialRows();

    print("RunnerSpawner reset");
};

script.getActiveObjects = function () {
    return activeObjects;
};

script.createEvent("OnStartEvent").bind(function () {
    if (!script.obstaclePrefab || !script.coinPrefab || !script.runtimeRoot) {
        print("RunnerSpawner: missing prefab or runtime root");
        return;
    }

    obstacles = createPool(script.obstaclePrefab, script.obstaclePoolSize, "Obstacle");
    coins = createPool(script.coinPrefab, script.coinPoolSize, "Coin");

    script.resetSpawner();
});

script.createEvent("UpdateEvent").bind(function () {
    moveActiveObjects();
    spawnWhileNeeded();
});

script.deactivateObject = function (data) {
    if (!data) {
        return;
    }

    if (data.sceneObject) {
        data.sceneObject.enabled = false;
    }
    resetRunnerTag(data);

    for (var i = activeObjects.length - 1; i >= 0; i--) {
        if (activeObjects[i] === data || activeObjects[i].sceneObject === data.sceneObject) {
            activeObjects.splice(i, 1);
        }
    }
};

script.deactivateSceneObject = function (sceneObject) {
    if (!sceneObject) {
        return;
    }

    resetRunnerTag(sceneObject);

    sceneObject.enabled = false;

    for (var i = activeObjects.length - 1; i >= 0; i--) {
        if (activeObjects[i].sceneObject === sceneObject) {
            activeObjects.splice(i, 1);
        }
    }
};

function resetRunnerTag(obj) {
    if (!obj) return;

    var scripts = obj.getComponents("Component.ScriptComponent");

    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].resetObject) {
            scripts[i].resetObject();
            return;
        }
    }
}