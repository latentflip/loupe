var AmpersandState = require('ampersand-state');

module.exports = AmpersandState.extend({
    props: {
        id: 'string',
        code: 'string',
        state: 'string'
    }
});
