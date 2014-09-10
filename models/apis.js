var AmpersandCollection = require('ampersand-collection');
var AmpersandState = require('ampersand-state');

var Timeout = AmpersandState.extend({
    props: {
        id: ['string'],
        type: ['string', true, 'timeout'],
        timeout: ['number', true, 0],
        code: 'string'
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
        setTimeout(function () {
            this.trigger('callback:spawn', {
                id: this.id,
                code: this.code
            });
            this.collection.remove(this);
        }.bind(this), this.timeout);
    }
});

module.exports = AmpersandCollection.extend({
    model: function (props, opts) {
        if (props.type === 'timeout') {
            return new Timeout(props, opts);
        }
        throw 'Unknown prop type: ' + props.type;
    }
});
