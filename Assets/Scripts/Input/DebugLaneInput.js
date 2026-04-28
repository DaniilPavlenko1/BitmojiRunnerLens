// DebugLaneInput.js

//@input Component.ScriptComponent playerMovement

var tapCount = 0;

script.createEvent("TapEvent").bind(function () {
    if (!script.playerMovement) {
        print("DebugLaneInput: playerMovement is not assigned");
        return;
    }

    tapCount++;

    if (tapCount % 2 === 1) {
        script.playerMovement.moveRight();
    } else {
        script.playerMovement.moveLeft();
    }
});