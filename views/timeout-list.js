var AndView = require('ampersand-view');
var templates = require('../templates');

var TimeoutItem = AndView.extend({
    template: templates.timeoutItem,
    bindings: {
        id: '[role=id]',
        state: '[role=state]',
    },
    render: function () {
        this.renderAndBind();
        return this;
    }
});

var TimeoutList = AndView.extend({
    template: templates.timeoutList,
    render: function () {
        this.renderAndBind({});
        this.renderCollection(this.collection, TimeoutItem, this.el);
        return this;
    }
});

module.exports = TimeoutList;
