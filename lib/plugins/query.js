var deval = require('deval');

module.exports.prependWorkerCode = function(code) {
    return this.server + ';\n' + code;
};

module.exports.server = deval(function () {
    var $ = {
        _callbacks: {},
        replayCallbacks: function (cbs) {
            var self = this;

            Object.keys(cbs).forEach(function (delayId) {
                var args = cbs[delayId];
                loupe.onDelay(delayId, function () {
                    self._callbacks[args[0]](args[1]);
                });
            });
        },
        register: function (emitter) {
            this.emitter = emitter;
            this.emitter.on('query:event', function (id, callbackId) {
                this._callbacks[id](callbackId);
            }.bind(this));
        },

        on: function (selector, event, cb) {
            var self = this;

            var id = 'query:' + this.nextId();
            var callbackName = (cb.name || "anonymous") + "()";
            this.emitter.send('query:addEventListener', { selector: selector, event: event, id: id, source: callbackName });

            this._callbacks[id] = function (callbackId) {
                delay();
                self.emitter.send('callback:shifted', callbackId);
                delay();
                cb();
                self.emitter.send('callback:completed', callbackId);
            };
        },

        nextId: function () {
            if (!this._id) this._id = 0;
            this._id++;
            return this._id;
        }
    };
    $.register(weevil);
    $.replayCallbacks(loupe.appState.query);
});

module.exports.createClient = function (codeModel, emitter, document) {
    var listeners = [
    ];

    var historyLog = {
    };

    window.historyLog = historyLog;

    codeModel.on('ready-to-run', function () {
        //historyLog = {};
    });

    emitter.on('query:addEventListener', function (data) {
        var els;

        codeModel.trigger('webapi:started', {
            id: data.id,
            type: 'query',
            selector: data.selector,
            event: data.event
        });

        //var els = document.querySelectorAll(data.selector);
        if (data.selector === 'document') {
            els = [document];
        } else {
            els = document.querySelectorAll(data.selector);
        }

        [].forEach.call(els, function (el) {
            var cb = function () {

                var callbackId = data.id + ":" + Date.now();
                codeModel.trigger('callback:spawn', {
                    id: callbackId,
                    apiId: data.id,
                    code: "[" + data.event + "] " + data.source
                });

                historyLog[codeModel.currentExecution] = [data.id, callbackId];

                emitter.send('query:event', data.id, callbackId);
            };

            listeners.push([el, data.event, cb, false]);
            el.addEventListener(data.event, cb, false);
        });
    });

    codeModel.on('reset-everything', function () {
        listeners.forEach(function (listener) {
            var el = listener.shift();
            el.removeEventListener.apply(el, listener);
        });
        listeners = [];
    });

    return {
        historyLog: historyLog
    };
};
