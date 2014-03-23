var AndView = require('ampersand-view');
var templates = require('../templates');

var Timeouts = require('../models/timeouts');
var TimeoutList = require('../views/timeout-list');

var CodeView = require('../views/code');

module.exports = AndView.extend({
    template: templates.mainView,
    initialize: function () {
        this.timeouts = new Timeouts();
    },
    render: function () {
        this.renderAndBind();
        
        var timeoutsView = new TimeoutList({ collection: this.timeouts });
        var codeView = new CodeView({ timeouts: this.timeouts });

        this.renderSubview(timeoutsView, this.getByRole('timeouts'));
        this.renderSubview(codeView, this.getByRole('code'));
        return this;
    }
});
