var wrapAddEventListener = function (options) {
    var noop = function () {};
    var onBound = options.onBound || noop;
    var onRun = options.onRun || noop;
    var onDone = options.onDone || noop;

    var bound = {};

    var _addEventListener = EventTarget.prototype.addEventListener;
    var _removeEventListener = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (event, fn, useCapture) {
        onBound.apply(onBound, arguments);

        var callback = function () {
            onRun.apply(onRun, arguments);
            fn.apply(this, arguments);
            onDone.apply(onDone, arguments);
        };
        bound[fn] = callback;
        _addEventListener.call(this, event, callback, useCapture);
    };

    EventTarget.prototype.removeEventListener = function (event, fn, useCapture) {
        _removeEventListener.call(this, event, bound[fn], useCapture);
    };
};


wrapAddEventListener({
    onBound: function () {
        console.log('Being bound', arguments);
    },
    onRun: function () {
        console.log('Being run', arguments);
    }
});


var $ = require('jquery');
var n = 0;

var b = function () {
    console.log('hi');
    n++;
    if (n === 5) {
        console.log('Unbind');
        $('div').off('click', b);
    }
};

$('div').on('click', b);
