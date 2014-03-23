var AndModel = require('ampersand-model');

module.exports = AndModel.extend({
    type: 'timeout',
    props: {
        id: 'number',
        state: 'string',
        queuedAt: ['date'],
        startedAt: ['date'],
        finishedAt: ['date']
    }
});
