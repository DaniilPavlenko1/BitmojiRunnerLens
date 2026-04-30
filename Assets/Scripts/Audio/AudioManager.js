// AudioManager.js

//@input Component.AudioComponent musicAudio
//@input Component.AudioComponent coinAudio
//@input Component.AudioComponent hitAudio
//@input Component.AudioComponent gameOverAudio
//@input Component.ScriptComponent gameController

var musicStarted = false;

script.playMusic = function () {
    if (!script.musicAudio || musicStarted) {
        return;
    }

    musicStarted = true;
    script.musicAudio.play(1);
};

script.stopMusic = function () {
    if (!script.musicAudio) {
        return;
    }

    musicStarted = false;
    script.musicAudio.stop(false);
};

script.playCoin = function () {
    if (script.coinAudio) {
        script.coinAudio.play(1);
    }
};

script.playHit = function () {
    if (script.hitAudio) {
        script.hitAudio.play(1);
    }
};

script.playGameOver = function () {
    if (script.gameOverAudio) {
        script.gameOverAudio.play(1);
    }
};

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController) {
        return;
    }

    if (script.gameController.isRunning()) {
        script.playMusic();
    } else {
        script.stopMusic();
    }
});