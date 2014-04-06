var AndView = require('ampersand-view');
var templates = require('../templates');

var Timeouts = require('../models/timeouts');
var TimeoutList = require('../views/timeout-list');

var StackFrames = require('../models/stack-frames');
var StackFrameList = require('../views/stack-frame-list');

var CodeView = require('../views/code');

module.exports = AndView.extend({
    template: templates.mainView,
    initialize: function () {
        this.timeouts = new Timeouts();
        this.stackFrames = new StackFrames();
    },
    render: function () {
        this.renderAndBind();

        var timeoutsView = new TimeoutList({ collection: this.timeouts });
        var stackView = new StackFrameList({ collection: this.stackFrames });
        var codeView = new CodeView({ timeouts: this.timeouts, stackFrames: this.stackFrames });

        this.renderSubview(stackView, this.getByRole('stack'));
        this.renderSubview(timeoutsView, this.getByRole('timeouts'));
        this.renderSubview(codeView, this.getByRole('code'));
        return this;
    }
});
