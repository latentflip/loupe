/* JSX: React.DOM */

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Callback = require('./callback.jsx');
var EventsMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventsMixin
    ],

    getInitialState: function () {
        return {
            queue: app.store.renderQueue
        };
    },

    registerListeners: function (props, state) {
        this.listenTo(state.queue, 'all', function () {
            this.forceUpdate();
        }.bind(this));
    },

    render: function () {
        var queue = this.state.queue.map(function (callback) {
            return (
                <Callback state={callback.state} state={callback.state} key={callback.id}>
                    {callback.id}
                </Callback>
            );
        });

        return (
          <div className="callback-queue render-queue flexChild">
            {queue}
          </div>
        )
    }
});
