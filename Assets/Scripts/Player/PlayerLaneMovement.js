// PlayerLaneMovement.js

//@input SceneObject playerRoot
//@input float laneDistance = 150.0
//@input float moveSpeed = 8.0

var currentLane = 1; // 0 = left, 1 = center, 2 = right
var targetX = 0;

function getLaneX(laneIndex) {
    return (laneIndex - 1) * script.laneDistance;
}

function moveToLane(laneIndex) {
    if (laneIndex < 0 || laneIndex > 2) {
        return;
    }

    currentLane = laneIndex;
    targetX = getLaneX(currentLane);

    print("Move to lane: " + currentLane);
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

    var transform = script.playerRoot.getTransform();
    var position = transform.getLocalPosition();
    position.x = 0;
    transform.setLocalPosition(position);
};

script.createEvent("UpdateEvent").bind(function () {
    if (!script.playerRoot) {
        return;
    }

    var transform = script.playerRoot.getTransform();
    var position = transform.getLocalPosition();

    position.x = position.x + (targetX - position.x) * getDeltaTime() * script.moveSpeed;

    transform.setLocalPosition(position);
});