var multiline = require('multiline');

exports.timeoutItem = multiline(function () {/*
    <li>
        <span role=state></span>
        <span role=id></span>
    </li>
*/});

exports.timeoutList = multiline(function () {/*
    <ul></ul>
*/});

exports.stackFrame = multiline(function () {/*
    <li>
        <span role=source></span>
    </li>
*/});

exports.stackFrameList = multiline(function () {/*
    <ul></ul>
*/});

exports.mainView = multiline(function () {/*
    <div>
        <div role=stack></div>
        <div role=code></div>
        <div role=timeouts></div>
        <div role=callbacks></div>
    </div>
*/});

exports.code = multiline(function () {/*
<div>
    <div role='editor' class='editor' contenteditable='true'>
console.log(console.log('hi' + 2));
var a = console.log('hi');
[1,2,3].map(function (a) {
    console.log(a * 2);
});
console.log(a + a + a);
var b = 2 + 2 + 2;
    </div>
</div>
*/});

exports.code = multiline(function () {/*
<div>
<div role='editor' class='editor' contenteditable='true'>
var bar = function () {
    return 5 * 10;
};

var foo = function () {
    return bar() * 2;
};

setTimeout(function () {
    console.log(foo());
}, 1000);

setTimeout(function () {
    console.log(foo());
}, 20000);
</div>
</div>
*/});
