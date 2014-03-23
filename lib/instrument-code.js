var falafel = require('falafel');

var isInstrumentable = function (node) {
    //console.log(node.type, node.source());
    return node.type === 'ExpressionStatement';
};

module.exports = function (code, options) {
    var before = options.before || function () { return ''; };
    var after = options.after || function () { return ''; };

    var insertionPoints = [];
    var id = 0;
    var instrumented = falafel(code, { loc: true, range: true }, function (node) {
        if (!isInstrumentable(node)) return;
        insertionPoints.push({
            id: id,
            type: 'start',
            loc: node.loc.start
        });
        insertionPoints.push({
            id: id,
            type: 'end',
            loc: node.loc.end
        });
        node.update(before(id, node) + ";" + node.source() + ";" + after(id, node));
        id++;
    });
    insertionPoints.sort(function (a, b) {
        if (a.loc.line === b.loc.line) return a.loc.column - b.loc.column;
        return a.loc.line - b.loc.line;

    });
    return {
        code: instrumented,
        insertionPoints: insertionPoints
    };
};

