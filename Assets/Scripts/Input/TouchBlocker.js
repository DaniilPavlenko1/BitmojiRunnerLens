// TouchBlocker.js

script.createEvent("OnStartEvent").bind(function () {
    global.touchSystem.touchBlocking = true;
    print("Touch blocking enabled for game lens");
});