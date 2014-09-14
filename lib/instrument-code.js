var falafel = require('falafel');

var call = function (name) {
    return function (arg) {
        return arg[name]();
    };
};

var instruments = {
    ExpressionStatement: function (id, node, before, after) {
        node.update(node.source() + ';');
    },
    CallExpression: function (id, node, before, after) {
        var source = node.source();

        if (node.callee.source() === 'console.log') {
            source = "_console.log(" + node.loc.start.line + ", " + node.arguments.map(call('source')).join(', ') + ")";
        }

        var newString =  '(' + before(id, node) + ', ' + source + ', ' + after(id, node) +  ')\n';
        node.update(newString);
    },
    BinaryExpression: function (id, node, before, after) {
        var newString =  '(' + before(id, node) + ', ' + after(id, node) + ', ' + node.source() + ')';
        node.update(newString);
    },
    //MemberExpression: function (id, node, before, after) {
    //    var source = node.source();
    //    if (source === 'console.log') {
    //        source = '_console.log';
    //    }

    //    node.update(source);
    //}
};

var isInstrumentable = function (node) {
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

