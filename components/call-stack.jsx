var React = require('react');
var CallStackItem = require('./call-stack-item.jsx');
var EventsMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventsMixin
    ],

    registerListeners: function (props, state) {
        var self = this;

        this.listenTo(state.stack, 'all', function () {
            self.forceUpdate();
        });

    },

    getInitialState: function () {
        return {
            stack: window.app.store.callstack
        };
    },

    render: function () {
        var calls = [];

        this.state.stack.each(function (call) {
            calls.unshift(<CallStackItem key={call.id}>{call.code}</CallStackItem>);
        });

        return (
            <div className="stack">
              {calls}
            </div>
        );
    }
});
