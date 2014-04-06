var AndModel = require('ampersand-model');

module.exports = AndModel.extend({
    type: 'stack-frame',
    props: {
        id: 'number',
        nodeId: 'number',
        source: 'string',
        expressionType: 'string',
        createdAt: 'number'
    },
    initialize: function () {
        this.id = Math.floor(Math.random() * 10000000);
        this.createdAt = +new Date();
    }
});
