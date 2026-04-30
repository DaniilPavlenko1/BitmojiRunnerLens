// PlayerJump.js

//@input SceneObject playerRoot
//@input float jumpHeight = 80
//@input float jumpDuration = 0.5

var isJumping = false;
var startY = 0;
var time = 0;

script.jump = function () {
    if (isJumping) {
        return;
    }

    isJumping = true;
    time = 0;

    var pos = script.playerRoot.getTransform().getLocalPosition();
    startY = pos.y;
};

script.isJumping = function () {
    return isJumping;
};

script.resetJump = function () {
    isJumping = false;
    time = 0;

    var transform = script.playerRoot.getTransform();
    var pos = transform.getLocalPosition();
    pos.y = startY;
    transform.setLocalPosition(pos);
};

script.createEvent("UpdateEvent").bind(function () {
    if (!isJumping) return;

    time += getDeltaTime();

    var t = time / script.jumpDuration;

    if (t >= 1) {
        isJumping = false;

        var transform = script.playerRoot.getTransform();
        var pos = transform.getLocalPosition();
        pos.y = startY;
        transform.setLocalPosition(pos);

        return;
    }

    var height = script.jumpHeight * 4 * t * (1 - t);

    var transform = script.playerRoot.getTransform();
    var pos = transform.getLocalPosition();
    pos.y = startY + height;
    transform.setLocalPosition(pos);
});