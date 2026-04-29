// PlayerAnimation.js

//@input Component.AnimationPlayer animationPlayer
//@input Component.ScriptComponent gameController
//@input Component.ScriptComponent playerJump
//@input Component.ScriptComponent playerMovement

//@input float sideDuration = 0.25
//@input float jumpDuration = 0.5

var currentClip = "";
var overrideTimer = 0;

function play(name) {
    if (!script.animationPlayer) {
        return;
    }

    if (currentClip === name) {
        return;
    }

    currentClip = name;

    script.animationPlayer.stopAll();
    script.animationPlayer.playClipAt(name, 0);

    print("Animation: " + name);
}

function playOverride(name, duration) {
    if (!script.animationPlayer) {
        return;
    }

    overrideTimer = duration;
    currentClip = name;

    script.animationPlayer.stopAll();
    script.animationPlayer.playClipAt(name, 0);

    print("Animation override: " + name);
}

script.createEvent("OnStartEvent").bind(function () {
    if (script.playerMovement) {
        script.playerMovement.onLaneChanged = function (direction) {
            if (!script.gameController || !script.gameController.isRunning()) {
                return;
            }

            if (direction < 0) {
                playOverride("Left", script.sideDuration);
            } else if (direction > 0) {
                playOverride("Right", script.sideDuration);
            }
        };
    }
});

script.createEvent("UpdateEvent").bind(function () {
    if (!script.gameController) {
        return;
    }

    if (overrideTimer > 0) {
        overrideTimer -= getDeltaTime();

        if (overrideTimer <= 0) {
            currentClip = "";
        }

        return;
    }

    if (script.gameController.isReady()) {
        play("Idle");
        return;
    }

    if (script.gameController.isGameOver()) {
        play("Fall");
        return;
    }

    if (script.gameController.isRunning()) {
        if (script.playerJump && script.playerJump.isJumping()) {
            playOverride("Jump", script.jumpDuration);
            return;
        }

        play("Run");
    }
});