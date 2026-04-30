// SwipeInput.js

//@input Component.ScriptComponent playerMovement
//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent playerJump

//@input float swipeThreshold = 40.0

var startPos = null;

script.createEvent("TouchStartEvent").bind(function (eventData) {
    startPos = eventData.getTouchPosition();
});

script.createEvent("TouchEndEvent").bind(function (eventData) {
    if (startPos === null) {
        return;
    }

    var endPos = eventData.getTouchPosition();

    var dx = endPos.x - startPos.x;
    var dy = endPos.y - startPos.y;

    startPos = null;

    if (!script.playerMovement) {
        print("SwipeInput: playerMovement is not assigned");
        return;
    }

    if (!script.gameController) {
        print("SwipeInput: gameController is not assigned");
        return;
    }

    if (!script.gameController.isRunning()) {
        if (script.gameController.isGameOver()) {
            return;
        }
        return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > script.swipeThreshold) {
            script.playerMovement.moveRight();
        } else if (dx < -script.swipeThreshold) {
            script.playerMovement.moveLeft();
        }
    }else {
        if (dy < -script.swipeThreshold) {

            if (script.playerJump) {
                script.playerJump.jump();
            }
    }
}
});