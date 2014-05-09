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
<div role='editor' class='editor' contenteditable='true'>function baz () {
    console.log('bar');
}
function bar () {
    baz();
}
function foo () {
    bar();
}


setTimeout(function () {
    foo();
}, 1);

setTimeout(function () {
    foo();
}, 2);

setTimeout(function () {
    foo();
}, 3);
</div>
</div>
*/});
