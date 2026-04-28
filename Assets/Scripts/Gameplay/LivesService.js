// LivesService.js

//@input int maxLives = 3

var currentLives = script.maxLives;

script.resetLives = function () {
    currentLives = script.maxLives;
    print("Lives: " + currentLives);
};

script.takeDamage = function () {
    currentLives--;

    if (currentLives < 0) {
        currentLives = 0;
    }

    print("Lives: " + currentLives);

    return currentLives;
};

script.getLives = function () {
    return currentLives;
};

script.createEvent("OnStartEvent").bind(function () {
    script.resetLives();
});