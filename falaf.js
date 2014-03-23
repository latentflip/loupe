var falafel = require('falafel');

var src = '(' + function () {
    var xs = [ 1, 2, [ 3, 4 ] ];
    var ys = [ 5, 6 ];
    console.dir([ xs, ys ]);
} + ')()';

var output = falafel(src, function (node) {
    console.log(node.type, node.source());
    if (node.type === 'ExpressionStatement') {
        node.update('console.log("pre");' + node.source() + 'console.log("post");');
    }
});
console.log(output);
