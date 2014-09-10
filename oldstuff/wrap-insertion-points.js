var TextCursor = require('./text-cursor');

module.exports = function (code, insertionPoints, options) {
    var before = options.before || function () { return ''; };
    var after = options.after || function () { return ''; };

    var cursor = new TextCursor(code);
    var output = '';

    insertionPoints.forEach(function (point) {
        output += cursor.stepTo(point.loc);
        if (point.type === 'start') {
            output += before(point.id);
        }
        if (point.type === 'end') {
            output += cursor.stepTo(point.loc);
            output += after(point.id);
        }
    });
    return output;
};

