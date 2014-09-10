var multiline = require('multiline');

exports.timeoutItem = multiline(function () {/*
    <li>
        <span data-hook=state></span>
        <span data-hook=id></span>
    </li>
*/});

exports.timeoutList = multiline(function () {/*
    <ul></ul>
*/});

exports.stackFrame = multiline(function () {/*
    <li>
        <span data-hook=source></span>
    </li>
*/});

exports.stackFrameList = multiline(function () {/*
    <ul></ul>
*/});

exports.mainView = multiline(function () {/*
    <div>
        <div data-hook=stack></div>
        <div data-hook=code></div>
        <div data-hook=timeouts></div>
        <div data-hook=callbacks></div>
    </div>
*/});

exports.code = multiline(function () {/*
<div>
    <div data-hook='editor' class='editor' contenteditable='true'>
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
<div data-hook='editor' class='editor' contenteditable='true'>function baz () {
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
}, 2000);

setTimeout(function () {
    foo();
}, 1000);

setTimeout(function () {
    foo();
}, 3000);
</div>
</div>
*/});
