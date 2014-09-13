var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
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
            calls.unshift(<CallStackItem key={call._key} isCallback={call.isCallback}>{call.code}</CallStackItem>);
        });

        return (
            <div className="stack-wrapper flexChild">
                <div className="stack">
                  <ReactCSSTransitionGroup transitionName="tr-stack">
                    {calls}
                  </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
});
