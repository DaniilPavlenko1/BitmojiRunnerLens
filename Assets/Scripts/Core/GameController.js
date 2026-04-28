// GameController.js

var GameState = {
    READY: 0,
    RUNNING: 1,
    GAME_OVER: 2
};

var currentState = GameState.READY;

function setState(newState) {
    currentState = newState;

    if (newState === GameState.READY) {
        print("State: READY");
    } else if (newState === GameState.RUNNING) {
        print("State: RUNNING");
    } else if (newState === GameState.GAME_OVER) {
        print("State: GAME OVER");
    }
}

script.startGame = function () {
    setState(GameState.RUNNING);
};

script.gameOver = function () {
    setState(GameState.GAME_OVER);
};

script.resetGame = function () {
    setState(GameState.READY);
};

script.getCurrentState = function () {
    return currentState;
};

script.isRunning = function () {
    return currentState === GameState.RUNNING;
};

script.createEvent("OnStartEvent").bind(function () {
    setState(GameState.READY);
});

script.createEvent("TapEvent").bind(function () {
    if (currentState === GameState.READY) {
        script.startGame();
    } else if (currentState === GameState.RUNNING) {
        script.gameOver();
    } else {
        script.resetGame();
    }
});