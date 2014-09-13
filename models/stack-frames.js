var Collection = require('./base-collection');

var StackFrame = require('./stack-frame');

module.exports = Collection.extend({
    model: StackFrame,
    comparator: function (m) {
        return -1 * m.createdAt;
    },
    pop: function () {
        this.remove(this.at(this.length - 1));
    }
});
