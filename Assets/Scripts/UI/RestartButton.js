//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent scoreService
//@input Component.ScriptComponent livesService
//@input Component.ScriptComponent playerMovement
//@input Component.ScriptComponent obstacleMover
//@input Component.ScriptComponent collectibleMover
//@input Component.ScriptComponent difficultyService
//@input Component.ScriptComponent obstacleCollision
//@input Component.ScriptComponent playerOverlapHandler
//@input Component.ScriptComponent runnerSpawner
//@input Component.InteractionComponent interaction

function restartGame() {
    if (!script.gameController || !script.gameController.isGameOver()) {
        return;
    }

    if (script.scoreService) script.scoreService.resetScore();
    if (script.livesService) script.livesService.resetLives();
    if (script.playerMovement) script.playerMovement.resetPlayer();
    if (script.difficultyService) script.difficultyService.resetDifficulty();
    if (script.playerOverlapHandler) script.playerOverlapHandler.resetCollisionState();
    if (script.runnerSpawner)script.runnerSpawner.resetSpawner();

    script.gameController.resetGame();

    print("Restart pressed");
}

script.createEvent("OnStartEvent").bind(function () {
    if (script.interaction) {
        script.interaction.onTouchEnd.add(restartGame);
    }
});