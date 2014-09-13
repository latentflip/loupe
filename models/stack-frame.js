var AndModel = require('ampersand-model');

module.exports = AndModel.extend({
    type: 'stack-frame',
    props: {
        _id: 'string',
        nodeId: 'number',
        source: 'string',
        expressionType: 'string',
        createdAt: 'number',
        isCallback: ['boolean', true, false]
    },
    initialize: function () {
        this.id = Math.floor(Math.random() * 10000000);
        this.createdAt = +new Date();
    }
});
