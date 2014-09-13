var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');

var Timeout = AmpersandState.extend({
    props: {
        id: ['string'],
        type: ['string', true, 'timeout'],
        timeout: ['number', true, 0],
        code: 'string',
        playState: ['string', true, 'running']
    },
    session: {
        timeoutId: 'number',
        startedAt: 'number',
        pausedAt: 'number',
        remainingTime: 'number'
    },
    derived: {
        timeoutString: {
            deps: ['timeout'],
            fn: function () {
                return this.timeout/1000 + 's';
            }
        }
    },

    pause: function () {
        this.pausedAt = Date.now();
        this.remainingTime = this.remainingTime - (this.pausedAt - this.startedAt);
        this.playState = 'paused';
        clearTimeout(this.timeoutId);
    },

    resume: function () {
        this.startedAt = Date.now();
        this.playState = 'running';

        this.timeoutId = setTimeout(function () {
            this.trigger('callback:spawn', {
                id: this.id,
                code: this.code
            });
            this.collection.remove(this);
        }.bind(this), this.remainingTime);
    },

    initialize: function () {
        this.startedAt = Date.now();
        this.remainingTime = this.timeout;

        this.timeoutId = setTimeout(function () {
            this.trigger('callback:spawn', {
                id: this.id,
                code: this.code
            });
            this.collection.remove(this);
        }.bind(this), this.remainingTime);

        this.on('remove', function () {
            clearTimeout(this.timeoutId);
        }.bind(this));
    },

    getPausedState: function () {
        return { remainingTime: this.remainingTime };
    }
});

var Query = AmpersandState.extend({
    props: {
        id: 'string',
        type: ['string', true, 'query'],
        selector: 'string',
        event: 'string'
    },
    derived: {
        code: {
            deps: ['selector', 'event'],
            fn: function () {
            return "$.on('" + this.selector + "', '" + this.event + "', ...)";
            }
        }
    },
    pause: function () {
    },
    resume: function () {
    },
    getPausedState: function () {
        return { };
    }
});

module.exports = AmpersandCollection.extend({
    model: function (props, opts) {
        if (props.type === 'timeout') {
            return new Timeout(props, opts);
        }
        if (props.type === 'query') {
            return new Query(props, opts);
        }
        throw 'Unknown prop type: ' + props.type;
    },
    pause: function () {
        this.each(function (model) { model.pause(); });
    },
    resume: function () {
        this.each(function (model) { model.resume(); });
    },
    getPausedState: function () {
        var data = {};
        this.each(function (model) {
            data[model.id] = model.getPausedState();
        });
        return data;
    }
});
