//@input Component.ScriptComponent gameController
//@input Component.InteractionComponent interaction
//@input SceneObject startScreen

function startGame() {
    if (!script.gameController || script.gameController.isRunning()) {
        return;
    }

    script.gameController.startGame();

    print("Start pressed");
}

script.createEvent("OnStartEvent").bind(function () {
    if (script.startScreen) {
        script.startScreen.enabled = true;
    }

    if (script.interaction) {
        script.interaction.onTouchEnd.add(startGame);
    }
});