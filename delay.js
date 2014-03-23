module.exports = function (delay) {
    return function () {
        var start = new Date().getTime();
        var target = start + delay;

        while (new Date().getTime() < target) {
            Math.pow(2, 20);
        }
    };
};

