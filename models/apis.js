var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');

var Timeout = AmpersandState.extend({
    props: {
        id: ['string'],
        type: ['string', true, 'timeout'],
        timeout: ['number', true, 0],
        code: 'string'
    },
    session: {
        timeoutId: 'number'
    },
    derived: {
        timeoutString: {
            deps: ['timeout'],
            fn: function () {
                return this.timeout/1000 + 's';
            }
        }
    },
    initialize: function () {
        this.timeoutId = setTimeout(function () {
            this.trigger('callback:spawn', {
                id: this.id,
                code: this.code
            });
            this.collection.remove(this);
        }.bind(this), this.timeout);

        this.on('remove', function () {
            clearTimeout(this.timeoutId);
        }.bind(this));
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
    }
});
