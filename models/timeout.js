var AndModel = require('ampersand-model');

module.exports = AndModel.extend({
    type: 'timeout',
    props: {
        id: 'number',
        state: 'string',
        delay: 'number',
        created: ['date'],
        queued: ['date'],
        started: ['date'],
        finished: ['date']
    },
    initialize: function () {
        if (this.delay && this.created) {
            setTimeout(function () {
                this.state = 'queued';
                this.queued = +new Date();
            }.bind(this), this.delay);
        }
    }
});
