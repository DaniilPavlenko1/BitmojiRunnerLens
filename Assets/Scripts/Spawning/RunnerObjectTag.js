// RunnerObjectTag.js

//@input string objectType = "obstacle"

var handled = false;

script.getObjectType = function () {
    return script.objectType;
};

script.markHandled = function () {
    handled = true;
};

script.isHandled = function () {
    return handled === true;
};

script.resetObject = function () {
    handled = false;
};