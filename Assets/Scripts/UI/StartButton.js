//@input Component.ScriptComponent gameController
//@input SceneObject startScreen

function startGame() {
    if (!script.gameController || !script.gameController.isReady()) {
        return;
    }

    if (!script.startScreen || !script.startScreen.enabled) {
        return;
    }

    script.gameController.startGame();
}

script.createEvent("OnStartEvent").bind(function () {
    if (script.startScreen) {
        script.startScreen.enabled = true;
    }
});

script.createEvent("TouchEndEvent").bind(function () {
    startGame();
});