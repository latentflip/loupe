/* JSX: React.DOM */

var React = require('react');
var EventMixin = require('react-backbone-events-mixin');

module.exports = React.createClass({
    mixins: [
        EventMixin
    ],

    registerListeners: function (props, state) {
        var self = this;

        this.listenTo(state.code, 'change', function () {
            this.forceUpdate();
        }.bind(this));

        this.listenTo(state.code, 'node:will-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.add('running');
        });

        this.listenTo(state.code, 'node:did-run', function (id) {
            var node = self.refs.code.getDOMNode().querySelector('#node-' + id);
            node.classList.remove('running');
        });
    },

    getInitialState: function () {
        return {
            code: app.store.code,
            editing: false
        };
    },

    onBlur: function () {
        this.state.code.html = this.refs.code.getDOMNode().innerHTML;
        this.setState({ editing: false });
        this.state.code.run();
    },

    onFocus: function () {
        this.setState({ editing: true });
        console.log('focus');
    },

    render: function () {
        var innerHTML = this.state.editing ? this.state.code.html : this.state.code.wrappedHtml;

        return (
            <div className="editor flexChild"
                 ref="code"
                 contentEditable
                 onBlur={this.onBlur}
                 onFocus={this.onFocus}
                 dangerouslySetInnerHTML={ {__html: innerHTML} }
            ></div>
        );
    }
});
