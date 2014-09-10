var AndView = require('ampersand-view');
var templates = require('../templates');

var StackFrame = AndView.extend({
    template: templates.stackFrame,
    bindings: {
        'model.id': '[data-hook=id]',
        'model.type': '[data-hook=type]',
        'model.source': '[data-hook=source]',
    }
});

var StackFrameList = AndView.extend({
    template: templates.stackFrameList,
    render: function () {
        this.renderWithTemplate();
        this.renderCollection(this.collection, StackFrame, this.el);
        return this;
    }
});

module.exports = StackFrameList;
