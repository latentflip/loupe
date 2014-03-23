var multiline = require('multiline');

exports.timer = multiline(function () {/*
    <li role=timer>
        <span role=state></span>
        <span role=id></span>
    </li>
*/});

exports.timerQueue = "<ul role=timers>" + exports.timer + "</ul>";
