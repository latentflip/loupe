var Collection = require('./base-collection');

var Timeout = require('./timeout');

module.exports = Collection.extend({
    model: Timeout
});
