//@input Component.ScriptComponent gameController

//@input SceneObject startScreen
//@input SceneObject gameplayHUD
//@input SceneObject gameOverScreen

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController) return;

    var isReady = script.gameController.isReady();
    var isRunning = script.gameController.isRunning();
    var isGameOver = script.gameController.isGameOver();

    if (script.startScreen) script.startScreen.enabled = isReady;
    if (script.gameplayHUD) script.gameplayHUD.enabled = isRunning;
    if (script.gameOverScreen) script.gameOverScreen.enabled = isGameOver;
});