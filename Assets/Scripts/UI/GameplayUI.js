//@input Component.Text scoreText
//@input Component.Text livesText
//@input Component.ScriptComponent scoreService
//@input Component.ScriptComponent livesService

script.createEvent("UpdateEvent").bind(function () {
    if (script.scoreText && script.scoreService) {
        script.scoreText.text = "Score: " + script.scoreService.getScore();
    }

    if (script.livesText && script.livesService) {
        script.livesText.text = "Lives: " + script.livesService.getLives();
    }
});