var AmpersandState = require('ampersand-state');
var instrumentCode = require('../lib/instrument-code');
var deval = require('deval');
var wrapInsertionPoints = require('../lib/wrap-insertion-points');
var weevil = require('weevil');
var tag = require('../lib/tag');
var delay = require('../lib/delay');

var cleanupCode = function (code) {
    return code.replace(/<br>/g, '\n');
};

module.exports = AmpersandState.extend({
    props: {
        html: 'string',
        worker: 'any'
    },
    derived: {
        cleanCode: {
            deps: ['html'],
            fn: function () {
                return cleanupCode(this.html.trim());
            }
        },
        instrumented: {
            deps: ['html'],
            fn: function () {
                return instrumentAndWrapHTML(this.cleanCode);
            }
        },
        wrappedHtml: {
            deps: ['instrumented'],
            fn: function () {
                return this.instrumented.html;
            }
        },
        runnableCode: {
            deps: ['instrumented'],
            fn: function () {
                return this.instrumented.code;
            }
        },
        workerCode: {
            deps: ['runnableCode'],
            fn: function () {
                return makeWorkerCode(this.runnableCode);
            }
        },
        nodeSourceCode: {
            deps: ['instrumented'],
            fn: function () {
                return this.instrumented.nodeSourceCode;
            }
        }
    },

    run: function () {
        var self = this;

        if (this.worker) { this.worker.kill(); }

        this.worker = weevil(this.workerCode);

        this.worker
                .on('node:before', function (node) {
                    self.trigger('node:will-run', node.id, self.nodeSourceCode[node.id]);
                    //$('#node-' + node.id).addClass('running');
                })
                .on('node:after', function (node) {
                    self.trigger('node:did-run', node.id);
                    //$('#node-' + node.id).removeClass('running');
                })
                .on('timeout:created', function (timer) {
                    console.log(timer);

                    console.log('Timeout created', timer.id);
                    self.trigger('webapi:started', {
                        id: 'timer:' + timer.id,
                        type: 'timeout',
                        timeout: timer.delay,
                        code: timer.code.split('\n').join(' ')
                    });
                })
                .on('timeout:started', function (timer) {
                    console.log('Timeout started', timer.id);
                    self.trigger('callback:shifted', 'timer:' + timer.id);
                })
                .on('timeout:finished', function (timer) {
                    console.log('Timeout finished', timer.id);
                    self.trigger('callback:completed', 'timer:' + timer.id);
                });
    }
});

var instrumentAndWrapHTML = function (code) {
    var instrumented = instrumentCode(code, {
        before: function (id, node) {
            return deval(function (id, type, source) {
                weevil.send('node:before', { id: $id$, type: "$type$", source: $source$ }), delay()
            }, id, node.type, JSON.stringify(node.source()));
        },
        after: function (id, node) {
            return deval(function (id) {
                weevil.send('node:after', { id: $id$ }), delay()
            }, id);
        }
    });

    var nodeSourceCode = {};
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
        },
        withWrappedCode: function (id, code) {
            nodeSourceCode[id] = code;
        }
    });

    return {
        code: instrumented.code,
        html: html,
        nodeSourceCode: nodeSourceCode
    };
};

var makeWorkerCode = function (code) {
    return deval(function (delayMaker, code) {
        var delayMaker = $delayMaker$;

        var delay = delayMaker(750);

        //Override setTimeout
        var _setTimeout = self.setTimeout;
        self.setTimeout = function (fn, delay/*, args...*/) {
            var args = Array.prototype.slice.call(arguments);
            fn = args.shift();
            var timerId;

            var queued = +new Date();
            var data = { id: timerId, delay: delay, created: +new Date(), state: 'timing', code: (fn.name || "anonymous") + "()"  };
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
            weevil.send('timeout:created', data);
        };

        $code$;

    }, delay.toString(), code);
};
