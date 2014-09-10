var $ = window.$ = require('jquery');
var _ = require('underscore');
var TextCursor = require('./text-cursor');
var tag = require('./tag');
var hyperglue = require('hyperglue');

var templates = require('./templates');

var deval = require('deval');
var weevil = require('weevil');

var delay = require('./delay');
var instrumentCode = require('./instrument-code');
var wrapInsertionPoints = require('./wrap-insertion-points');

var updateTimerQueue = function (timers) {
    var timerSelectors = timers.map(function (timer) {
        return {
            '[data-hook=state]' : timer.state,
            '[data-hook=id]' : timer.id
        };
    });
    console.log(timerSelectors);
    var html = hyperglue(templates.timerQueue, {
        '[data-hook=timer]' : timerSelectors
    });

    $('[data-hook=timer-queue]').html(html);
};


var currentWeevilWorker;
var tokenizeHTML = function (content) {
    if (currentWeevilWorker) currentWeevilWorker.kill();
    var code = content.replace(/<br>/g, '\n');

    var instrumented = instrumentCode(code, {
        before: function (id, node) {
            return deval(function (id) {
                weevil.send('node:before', { id: $id$ });
                delay();
            }, id);
        },
        after: function (id, node) {
            return deval(function (id) {
                weevil.send('node:after', { id: $id$ });
                delay();
            }, id);
        }
    });

    var html = wrapInsertionPoints(code, instrumented.insertionPoints, {
        before: function (id) {
            return tag.o('span', {
                id: 'node-' + id,
                class: 'code-node',
                //style: "background: rgba(0,0,0,0.2);"
            });
        },
        after: function (id) {
            return tag.c('span');
        }
    });


    var workerCode = deval(function (delayMaker, instrumented) {
        var delayMaker = $delayMaker$;

        var delay = delayMaker(500);

        //Override setTimeout
        var _setTimeout = self.setTimeout;
        self.setTimeout = function (fn, delay/*, args...*/) {
            var args = Array.prototype.slice.call(arguments);
            var fn = args.shift();
            var timerId;

            var queued = +new Date();
            var data = { id: timerId, delay: delay, queued: +new Date(), state: 'queued' };
            args.unshift(function () {
                data.state = 'started';
                data.started = +new Date();
                data.error = (data.started - data.queued) - delay;
                weevil.send('timeout:started', data);

                fn.apply(fn, arguments);

                data.state = 'finished';
                data.finished = +new Date();
                weevil.send('timeout:finished', data);
            });

            data.id = _setTimeout.apply(self, args);
            weevil.send('timeout:queued', data);
        };

        $instrumented$;
    }, delay.toString(), instrumented.code);

    var queue = [];
    var worker = weevil(workerCode);
    worker
        .on('node:before', function (node) {
            $('#node-' + node.id).addClass('running');
        })
        .on('node:after', function (node) {
            $('#node-' + node.id).removeClass('running');
        })
        .on('timeout:queued', function (timer) {
            queue.push(timer);
            updateTimerQueue(queue);
        })
        .on('timeout:started', function (timer) {
            queue = _.map(queue, function (t) {
                if (t.id === timer.id) {
                    return timer;
                } else {
                    return t;
                }
            });
            updateTimerQueue(queue);
        })
        .on('timeout:finished', function (timer) {
            queue = _.reject(queue, function (t) {
                return t.id === timer.id;
            });
            updateTimerQueue(queue);
        });
    currentWeevilWorker = worker;
    return html;
};



var rawText;
$('#javascript-editor').on('blur', function () {
    rawText = $(this).text().trim();
    $(this).html(tokenizeHTML(rawText));
});


$('#javascript-editor').on('focus', function () {
    if (rawText) {
        $(this).html(rawText);
    }
});

$('#javascript-editor').trigger('blur');
