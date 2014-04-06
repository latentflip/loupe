var falafel = require('falafel');

var instruments = {
    //ExpressionStatement: function (id, node, before, after) {
    //    var newString = '(' + before(id, node) + ");" + node.source() + ";(" + after(id, node) + ');';
    //    console.log('EE', newString);
    //    node.update(newString);

    //},
    CallExpression: function (id, node, before, after) {
        var newString =  '(' + before(id, node) + ', ' + node.source() + ', ' + after(id, node) +  ')\n';
        node.update(newString);
    },
    BinaryExpression: function (id, node, before, after) {
        var newString =  '(' + before(id, node) + ', ' + after(id, node) + ', ' + node.source() + ')';
        node.update(newString);
    }
};

var isInstrumentable = function (node) {
    //console.log(node.type, node.source());
    return !!instruments[node.type];
};

var instrumentNode = function (id, node, before, after) {
    instruments[node.type](id, node, before, after);
};


module.exports = function (code, options) {
    var before = options.before || function () { return ''; };
    var after = options.after || function () { return ''; };

    var insertionPoints = [];
    var id = 1;
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
        instrumentNode(id, node, before, after);
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

