var test = require('tape');

var TextCursor = require('../text-cursor');

var code = [
"a123456789",
"b123456",
"",
"c12345"
].join("\n");


test('within line: one at a time', function (t) {
    var cursor = new TextCursor(code);
    t.equal(cursor.stepTo(1,1), 'a');
    t.equal(cursor.stepTo(1,2), '1');
    t.equal(cursor.stepTo(1,3), '2');
    t.end();
});

test('within line: many at a time', function (t) {
    var cursor = new TextCursor(code);
    t.equal(cursor.stepTo(1,4), 'a123');
    t.equal(cursor.stepTo(1,5), '4');
    t.equal(cursor.stepTo(1,8), '567');
    t.end();
});


test('within line: to the end of the line', function (t) {
    var cursor = new TextCursor(code);
    t.equal(cursor.stepTo(1,10), 'a123456789\n');
    t.end();
});

test('within line: going beyond end of line', function (t) {
    var cursor = new TextCursor(code);
    t.equal(cursor.stepTo(1,50), 'a123456789\n');
    t.end();
});

test('across lines: to start of next line', function (t) {
    var cursor = new TextCursor(code);
    t.equal(cursor.stepTo(2,0), 'a123456789\n');
    t.end();
});
