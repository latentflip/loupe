var TextCursor = require('./text-cursor');

module.exports = function (code, insertionPoints, options) {
    var before = options.before || function () { return ''; };
    var after = options.after || function () { return ''; };
    var withWrappedCode = options.withWrappedCode || function () { return ''; };

    var cursor = new TextCursor(code);
    var output = '';

    var currentNodeContents = {
    };

    insertionPoints.forEach(function (point) {
        var wrappedCode = cursor.stepTo(point.loc);
        output += wrappedCode;

        Object.keys(currentNodeContents).forEach(function (id) {
            currentNodeContents[id] += wrappedCode;
        });

        if (point.type === 'start') {
            output += before(point.id);
            currentNodeContents[point.id] = '';
        }

        if (point.type === 'end') {
            withWrappedCode(point.id, currentNodeContents[point.id]);
            delete currentNodeContents[point.id];

            output += after(point.id);
        }
    });
    output += cursor.stepTo('end');
    return output;
};

