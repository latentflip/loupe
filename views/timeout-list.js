var AndView = require('ampersand-view');
var templates = require('../templates');

var TimeoutItem = AndView.extend({
    template: templates.timeoutItem,
    bindings: {
        id: '[role=id]',
        state: [
            ['[role=state]', 'text'],
            ['li', 'class']
        ]
    },
    render: function () {
        this.renderAndBind();
        var self = this;
        this.listenTo(this.model, 'change:state', function () {
            this.el.setAttribute('class', self.model.state);
        });
        this.el.setAttribute('class', self.model.state);
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
