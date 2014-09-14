var React = require('react');
var EventMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [EventMixin],

    registerListeners: function (props, state) {
        this.listenTo(state.code, 'change:delay', function () {
            this.forceUpdate();
        }.bind(this));
    },

    getInitialState: function () {
        return {
            code: app.store.code
        };
    },

    changeDelay: function () {
        this.state.code.delay = parseInt(this.refs.delay.getDOMNode().value);
    },

    changeRenders: function () {
        app.store.code.simulateRenders = this.refs.renders.getDOMNode().checked;
    },

    render: function () {
        var classes = "flexChild columnParent settingsColumn";
        if (!this.props.open) { classes += " hidden"; }

        return (
          <div className={classes}>
            <div className="setting">
              <label>
                Delay: {this.state.code.delay}ms
                <input type="range" ref="delay" onChange={this.changeDelay} min="0" max="2000" initialValue={this.state.code.delay}/>
              </label>
              <label>
                Simulate Renders:
                <input type="checkbox" ref="renders" onChange={this.changeRenders} />
              </label>
            </div>
          </div>
        );
    }
});
