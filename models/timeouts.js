var Collection = require('ampersand-collection')
                    .extend(require('ampersand-collection-underscore-mixin'));

var Timeout = require('./timeout');

module.exports = Collection.extend({
    model: Timeout
});
