// ScoreService.js

//@input int scorePerCollectible = 10

var score = 0;

script.resetScore = function () {
    score = 0;
    print("Score: " + score);
};

script.addScore = function (amount) {
    score += amount;
    print("Score: " + score);
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