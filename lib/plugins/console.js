var deval = require('deval');

module.exports.prependWorkerCode = function (code) {
    return this.server + ';\n' + code;
};

module.exports.server = deval(function () {
    var _console = {};

    _console.log = function () {
        if (loupe.paused) return;

        weevil.send('console:log', [].slice.call(arguments));
    };
});

module.exports.createClient = function (codeModel, emitter) {
    emitter.on('console:log', function (args) {
        args.unshift('color: coral; font-weight: bold;');
        args.unshift('%c Loupe @ %d >');
        console.log.apply(console, args);
    });
};
