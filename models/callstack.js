var AmpersandState = require('ampersand-state');
var AmpersandCollection = require('ampersand-collection');

var StackFrame = AmpersandState.extend({
    props: {
        _id: 'any',
        _key: 'string',
        code: 'string'
    },
    initialize: function () {
        this._key = this._key || Date.now().toString();
    }
});

module.exports = AmpersandCollection.extend({
    model: StackFrame,
    last: function () {
        return this.at(this.length - 1);
    },
    pop: function () {
        var removed = this.last();
        this.remove(removed);
        return removed;
    }
});
