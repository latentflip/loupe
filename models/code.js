var AmpersandState = require('ampersand-state');
var instrumentCode = require('../lib/instrument-code');
var deval = require('deval');
var wrapInsertionPoints = require('../lib/wrap-insertion-points');
var weevil = require('weevil');
var tag = require('../lib/tag');
var delayMaker = require('../lib/delay');
var debounce = require('lodash.debounce');

var $ = require('../lib/plugins/query');
var consolePlugin = require('../lib/plugins/console');

var cleanupCode = function (code) {
    return code.replace(/<br>/g, '\n');
};

module.exports = AmpersandState.extend({
    props: {
        htmlScratchpad: ['array', true],
        codeLines: ['array', true],
        worker: 'any',
        delay: ['number', true, function () {
            return parseInt(localStorage.loupeDelay, 10) || 750;
        }],
        running: ['boolean', true, false],
        simulateRenders: ['boolean', true, false]
    },
    derived: {
        rawHtmlScratchpad: {
            deps: ['htmlScratchpad'],
            fn: function () {
                return this.htmlScratchpad.join('\n');
            }
        },
        html: {
            deps: ['codeLines'],
            fn: function () {
                return this.codeLines.join('<br>');
            }
        },
        rawCode: {
            deps: ['codeLines'],
            fn: function () {
                return this.codeLines.join('\n');
            }
        },
        encodedSource: {
            deps: ['rawCode', 'rawHtmlScratchpad'],
            fn: function () {
                return encodeURIComponent(btoa(this.rawCode) + "!!!" + btoa(this.rawHtmlScratchpad));
            }
        },
        cleanCode: {
            deps: ['rawCode'],
            fn: function () {
                return this.rawCode;
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
        nodeSourceCode: {
            deps: ['instrumented'],
            fn: function () {
                return this.instrumented.nodeSourceCode;
            }
        }
    },

    initialize: function () {
        this.on('ready-to-run', function () { this.running = true; });
        this.on('resumed', function () { this.running = true; });
        this.on('paused', function () { this.running = false; });
        this.on('reset-everything', function () { this.running = false; });

        var self = this;
        var pauseAndResume = debounce(function () {
            if (self.running) {
                self.pause();
                self.resume();
            }
        }, 100);

        this.on('change:delay', pauseAndResume);
    },

    makeWorkerCode: function (fromId, appState) {
        return makeWorkerCode(this.runnableCode, {
            delay: this.delay,
            resumeFromDelayId: fromId,
            appState: appState
        });
    },

    decodeUriSource: function (encoded) {
        var parts = decodeURIComponent(encoded).split('!!!');
        try {
            this.codeLines = atob(parts[0]).split('\n');
        } catch (e) {
            this.codeLines = [];
        }
        try {
            this.htmlScratchpad = atob(parts[1]).split('\n');
        } catch (e) {
            this.htmlScratchpad = [];
        }
    },

    resetEverything: function () {
        this.trigger('reset-everything');
        this.running = false;
        if (this.worker) { this.worker.kill(); }
    },

    pause: function () {
        this.trigger('paused');
        this.pausedExecution = this.currentExecution;
        this.worker.kill();
    },

    resume: function () {
        this.trigger('resumed');
        var appState = {
            webapis: app.store.apis.getPausedState(),
            query: this.queryClient.historyLog
        };

        this.ignoreEvents = true;
        this.run(this.pausedExecution, appState);
    },

    run: function (fromId, appState) {
        appState = appState || {
            webapis: {},
            query: {}
        };

        setTimeout(function () {
            var self = this;

            if (!fromId) {
                this.resetEverything();
            }

            this.trigger('ready-to-run');
            this.worker = weevil(this.makeWorkerCode(fromId, appState));

            //TODO this shouldn't know about the scratchpad
            this.queryClient = $.createClient(this, this.worker, document.querySelector('.html-scratchpad'));
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
                    })
                    .on('delay', function (delayId) {
                        if (self.pausedExecution) {
                            if (delayId >= self.pausedExecution) {
                                self.ignoreEvents = false;
                            }
                        }
                        self.currentExecution = delayId;
                    });

        }.bind(this), 0);
    }
});

var instrumentAndWrapHTML = function (code) {
    var instrumented = instrumentCode(code, {
        before: function (id, node) {
            var source = JSON.stringify(node.source());
            return deval(function (id, type, source) {
                weevil.send('node:before', { id: $id$, type: "$type$", source: $source$ }), delay()
            }, id, node.type, source);
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

    html = html.replace(/;\n/g, ';');

    return {
        code: instrumented.code,
        html: html,
        nodeSourceCode: nodeSourceCode
    };
};

function prependCode(prepend, code) {
    return prepend + ';\n' + code;
}

var makeWorkerCode = function (code, options) {
    var delayTime = options.delay;
    var resumeFromDelayId = options.resumeFromDelayId ? options.resumeFromDelayId.toString() : "null";
    var appState = JSON.stringify(options.appState || {});

    code = $.prependWorkerCode(code);
    code = consolePlugin.prependWorkerCode(code);
    code = prependCode(deval(function (delayMaker, delayTime, resumeFromDelayId, appState) {
        var loupe = {};
        loupe.appState = $appState$;
        loupe._onDelayCallbacks = {};
        loupe.onDelay = function (id, cb) {
            this._onDelayCallbacks[id] = this._onDelayCallbacks[id] || [];
            this._onDelayCallbacks[id].push(cb);
        };
        loupe.triggerDelay = function (id) {
            var cbs = this._onDelayCallbacks[id];
            if (cbs) {
                cbs.forEach(function (cb) {
                    _setTimeout(cb, 0);
                });
            }
        };

        var _send = weevil.send;
        weevil.send = function (name) {
            if (loupe.skipDelays && name !== 'delay') { return; }
            return _send.apply(this, arguments);
        };

        var delayMaker = $delayMaker$;

        var delay = delayMaker($delayTime$, $resumeFromDelayId$);

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
                delay();

                fn.apply(fn, arguments);

                data.state = 'finished';
                data.finished = +new Date();
                weevil.send('timeout:finished', data);
                delay();
            });

            if (loupe.appState.webapis[timerId]) {
                console.log('Overriding ' + args[1] + ' to ' + loupe.appState.webapis[timerId].remainingTime);
                args[1] = loupe.appState.webapis[timerId].remainingTime;
            }

            data.id = _setTimeout.apply(self, args);
            weevil.send('timeout:created', data);
        };

    }, delayMaker.toString(), delayTime, resumeFromDelayId, appState), code);

    return code;
};
