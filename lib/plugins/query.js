var deval = require('deval');

module.exports.prependWorkerCode = function(code) {
    return this.server + ';\n' + code;
};

module.exports.server = deval(function () {
    var $ = {
        _callbacks: {},
        register: function (emitter) {
            this.emitter = emitter;
            this.emitter.on('query:event', function (id, callbackId) {
                this._callbacks[id](callbackId);
            }.bind(this));
        },

        on: function (selector, event, cb) {
            var self = this;

            var id = 'query:' + this.nextId();
            this.emitter.send('query:addEventListener', { selector: selector, event: event, id: id });

            this._callbacks[id] = function (callbackId) {
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
});

module.exports.createClient = function (codeModel, emitter, document) {
    var listeners = [
    ];

    emitter.on('query:addEventListener', function (data) {
        codeModel.trigger('webapi:started', {
            id: data.id,
            type: 'query',
            selector: data.selector,
            event: data.event
        });
        var els = document.querySelectorAll(data.selector);

        [].forEach.call(els, function (el) {
            var cb = function () {
                var callbackId = data.id + ":" + Date.now();
                codeModel.trigger('callback:spawn', {
                    id: callbackId,
                    code: "click"
                });
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
};
