var TextCursor = require('./text-cursor');

module.exports = function (code, insertionPoints, options) {
    var before = options.before || function () { return ''; };
    var after = options.after || function () { return ''; };
    var withWrappedCode = options.withWrappedCode || function () { return ''; };

    var cursor = new TextCursor(code);
    var output = '';

    insertionPoints.forEach(function (point) {
        var wrappedCode = cursor.stepTo(point.loc);
        output += wrappedCode;
        if (point.type === 'start') {
            output += before(point.id);
        }
        if (point.type === 'end') {
            withWrappedCode(point.id, wrappedCode);

            output += after(point.id);
        }
    });
    output += cursor.stepTo('end');
    return output;
};

