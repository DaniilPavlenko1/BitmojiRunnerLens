// PlayerLaneMovement.js

//@input SceneObject playerRoot
//@input float laneDistance = 150.0
//@input float moveSpeed = 8.0

var currentLane = 1; // 0 = left, 1 = center, 2 = right
var targetX = 0;

// callback for animation
script.onLaneChanged = null;

function getLaneX(laneIndex) {
    return (laneIndex - 1) * script.laneDistance;
}

function moveToLane(laneIndex) {
    if (laneIndex < 0 || laneIndex > 2) {
        return;
    }

    var previousLane = currentLane;

    currentLane = laneIndex;
    targetX = getLaneX(currentLane);

    var direction = currentLane - previousLane;

    if (script.onLaneChanged && direction !== 0) {
        script.onLaneChanged(direction);
    }
}

script.moveLeft = function () {
    moveToLane(currentLane - 1);
};

script.moveRight = function () {
    moveToLane(currentLane + 1);
};

script.resetPlayer = function () {
    currentLane = 1;
    targetX = 0;

    if (!script.playerRoot) {
        return;
    }

    var transform = script.playerRoot.getTransform();
    var position = transform.getLocalPosition();

    position.x = 0;

    transform.setLocalPosition(position);
};

script.getCurrentLane = function () {
    return currentLane;
};

script.createEvent("OnStartEvent").bind(function () {
    script.resetPlayer();
});

script.createEvent("UpdateEvent").bind(function () {
    if (!script.playerRoot) {
        return;
    }

    var transform = script.playerRoot.getTransform();
    var position = transform.getLocalPosition();

    position.x = position.x + (targetX - position.x) * getDeltaTime() * script.moveSpeed;

    transform.setLocalPosition(position);
});