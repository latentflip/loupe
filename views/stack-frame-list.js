var AndView = require('ampersand-view');
var templates = require('../templates');

var StackFrame = AndView.extend({
    template: templates.stackFrame,
    bindings: {
        id: '[role=id]',
        type: '[role=type]',
        source: '[role=source]',
    },
    render: function () {
        this.renderAndBind();
        return this;
    }
});

var StackFrameList = AndView.extend({
    template: templates.stackFrameList,
    render: function () {
        this.renderAndBind({});
        this.renderCollection(this.collection, StackFrame, this.el);
        return this;
    }
});

module.exports = StackFrameList;
