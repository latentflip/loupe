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
    setTimeout(function () {
      console.log('Queued function run');
    }, 10000);

    setTimeout(function () {
      console.log('Queued function run');
    }, 1001);

    setTimeout(function () {
      console.log('Queued function run');
    }, 1000);

    function onEach (el) {
      console.log(el);
    }

    function a (array) {
      array.forEach(onEach);
    }

    a([1,2,3]);
    console.log('2');
    console.log('3');
    </div>
</div>
*/});
