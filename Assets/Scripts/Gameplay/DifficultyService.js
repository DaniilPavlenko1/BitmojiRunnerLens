//@input Component.ScriptComponent gameController

//@input float startSpeed = 700.0
//@input float maxSpeed = 1300.0
//@input float acceleration = 25.0

var currentSpeed = 0;

script.resetDifficulty = function () {
    currentSpeed = script.startSpeed;
};

script.getSpeed = function () {
    return currentSpeed;
};

script.createEvent("OnStartEvent").bind(function () {
    script.resetDifficulty();
});

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameController.isRunning()) {
        return;
    }

    currentSpeed += script.acceleration * getDeltaTime();

    if (currentSpeed > script.maxSpeed) {
        currentSpeed = script.maxSpeed;
    }
});