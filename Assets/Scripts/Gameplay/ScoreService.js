// ScoreService.js

//@input int scorePerCollectible = 10

var score = 0;

script.resetScore = function () {
    score = 0;
};

script.addScore = function (amount) {
    score += amount;
};

script.addCollectibleScore = function () {
    script.addScore(script.scorePerCollectible);
};

script.getScore = function () {
    return score;
};

script.createEvent("OnStartEvent").bind(function () {
    script.resetScore();
});