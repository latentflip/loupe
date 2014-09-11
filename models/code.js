var AmpersandState = require('ampersand-state');
var instrumentCode = require('../lib/instrument-code');
var deval = require('deval');
var wrapInsertionPoints = require('../lib/wrap-insertion-points');
var weevil = require('weevil');
var tag = require('../lib/tag');
var delay = require('../lib/delay');

var $ = require('../lib/plugins/query');
var consolePlugin = require('../lib/plugins/console');

var cleanupCode = function (code) {
    return code.replace(/<br>/g, '\n');
};

module.exports = AmpersandState.extend({
    props: {
        html: 'string',
        worker: 'any'
    },
    derived: {
        encodedSource: {
            deps: ['html'],
            fn: function () {
                return encodeURIComponent(btoa(this.html));
            }
        },
        cleanCode: {
            deps: ['html'],
            fn: function () {
                return cleanupCode(this.html.trim());
            }
        },
        instrumented: {
            deps: ['cleanCode'],
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

    decodeUriSource: function (encoded) {
        this.html = atob(decodeURIComponent(encoded));
    },

    resetEverything: function () {
        this.trigger('reset-everything');
        if (this.worker) { this.worker.kill(); }
    },

    run: function () {
        var self = this;

        this.resetEverything();

        this.worker = weevil(this.workerCode);

        //TODO this shouldn't know about the scratchpad
        $.createClient(this, this.worker, document.querySelector('.html-scratchpad'));
        consolePlugin.createClient(this, this.worker);

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

                    self.trigger('webapi:started', {
                        id: 'timer:' + timer.id,
                        type: 'timeout',
                        timeout: timer.delay,
                        code: timer.code.split('\n').join(' ')
                    });
                })
                .on('timeout:started', function (timer) {
                    self.trigger('callback:shifted', 'timer:' + timer.id);
                })
                .on('timeout:finished', function (timer) {
                    self.trigger('callback:completed', 'timer:' + timer.id);
                })
                .on('callback:shifted', function (callbackId) {
                    self.trigger('callback:shifted', callbackId);
                })
                .on('callback:completed', function (callbackId) {
                    self.trigger('callback:completed', callbackId);
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

function prependCode(prepend, code) {
    return prepend + ';\n' + code;
}

var makeWorkerCode = function (code) {
    code = prependCode(deval(function (delayMaker) {
        var delayMaker = $delayMaker$;

        var delay = delayMaker(750);

        //Override setTimeout
        var _setTimeout = self.setTimeout;
        self.setTimeout = function (fn, timeout/*, args...*/) {
            var args = Array.prototype.slice.call(arguments);
            fn = args.shift();
            var timerId;

            var queued = +new Date();
            var data = { id: timerId, delay: timeout, created: +new Date(), state: 'timing', code: (fn.name || "anonymous") + "()"  };
            args.unshift(function () {
                data.state = 'started';
                data.started = +new Date();
                data.error = (data.started - data.queued) - timeout;
                delay();
                weevil.send('timeout:started', data);

                fn.apply(fn, arguments);

                data.state = 'finished';
                data.finished = +new Date();
                weevil.send('timeout:finished', data);
                delay();
            });

            data.id = _setTimeout.apply(self, args);
            weevil.send('timeout:created', data);
        };

    }, delay.toString()), code);

    code = $.prependWorkerCode(code);
    code = consolePlugin.prependWorkerCode(code);
    return code;
};
