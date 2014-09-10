var test = require('tape');
var serializeCode = require('../serialize-code');

test('it serializes multiline code', function (t) {
    var serialized = serializeCode(function () {
        console.log('hi');
        console.log('there');
    });

    var expected = [
        "console.log('hi');",
        "console.log('there');"
    ].join('\n');

    t.equal(serialized, expected);
    t.end();
});

test('it serializes inline code', function (t) {
    var serialized = serializeCode(function () { console.log('hi'); console.log('there'); });

    var expected = [
        "console.log('hi'); console.log('there');"
    ].join('\n');

    t.equal(serialized, expected);
    t.end();
});
