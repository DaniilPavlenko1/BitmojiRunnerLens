//@input SceneObject gameOverScreen
//@input Component.Text finalScoreText
//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent scoreService

script.createEvent("OnStartEvent").bind(function () {
    if (script.gameOverScreen) {
        script.gameOverScreen.enabled = false;
    }
});

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController || !script.gameOverScreen) {
        return;
    }

    var isGameOver = script.gameController.isGameOver();

    if (isGameOver && script.finalScoreText && script.scoreService) {
        script.finalScoreText.text = "Final Score: " + script.scoreService.getScore();
    }
});